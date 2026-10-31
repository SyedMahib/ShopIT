import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order, { IOrder } from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendOrderEmail } from "../utils/orderEmails.js";
import { getStripe } from "../utils/stripe.js";

// How long the customer has to pay before the order is cancelled and its stock released
const CHECKOUT_EXPIRES_MINUTES = 60;

const toCents = (amount: number) => Math.round(amount * 100);

const paymentIntentId = (session: Stripe.Checkout.Session) =>
  typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

// Mark the order paid. Safe to call more than once for the same session
// (the webhook and the confirm endpoint can both report the same payment).
const markOrderPaid = async (session: Stripe.Checkout.Session): Promise<IOrder | null> => {
  if (session.payment_status !== "paid") return null;

  const order = await Order.findOneAndUpdate(
    { _id: session.metadata?.orderId, "paymentInfo.status": "unpaid" },
    {
      $set: {
        "paymentInfo.id": paymentIntentId(session),
        "paymentInfo.sessionId": session.id,
        "paymentInfo.status": "paid",
        paidAt: new Date(),
      },
    },
    { returnDocument: "after" },
  ).populate("user", "name email");

  if (!order) return null;

  // Paid for an order that was cancelled while the checkout page was open: give the money back
  if (order.orderStatus === "Cancelled") {
    await getStripe().refunds.create({ payment_intent: order.paymentInfo!.id! });
    order.paymentInfo!.status = "refunded";
    await order.save();
    return order;
  }

  sendOrderEmail(order, order.user as any, "Placed");
  return order;
};

// The customer never paid: cancel the order and put its stock back
const cancelExpiredOrder = async (session: Stripe.Checkout.Session): Promise<void> => {
  // Only the order's latest session counts; an older replaced session expiring changes nothing
  const order = await Order.findOneAndUpdate(
    {
      _id: session.metadata?.orderId,
      "paymentInfo.sessionId": session.id,
      "paymentInfo.status": "unpaid",
      orderStatus: "Processing",
    },
    { $set: { orderStatus: "Cancelled", cancelledAt: new Date() } },
    { returnDocument: "after" },
  ).populate("user", "name email");

  if (!order) return;

  for (const item of order.orderItems) {
    await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
  }

  sendOrderEmail(order, order.user as any, "Cancelled");
};

// Start (or resume) card payment for an order => /api/v1/payment/checkout/:orderId

export const createCheckoutSession = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as any;
    const order = await Order.findOne({ _id: req.params.orderId, user: user?._id });

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }
    if (order.paymentMethod !== "Card" || order.paymentInfo?.status !== "unpaid") {
      return next(new ErrorHandler("This order doesn't need a card payment", 400));
    }
    if (order.orderStatus !== "Processing") {
      return next(new ErrorHandler(`This order is ${order.orderStatus.toLowerCase()} and can't be paid`, 400));
    }

    const stripe = getStripe();

    // Reuse the checkout page that's still open, so the order can't be paid twice
    if (order.paymentInfo.sessionId) {
      const existing = await stripe.checkout.sessions.retrieve(order.paymentInfo.sessionId);
      if (existing.status === "open" && existing.url) {
        res.status(200).json({ url: existing.url });
        return;
      }
      if (existing.status === "complete") {
        await markOrderPaid(existing);
        return next(new ErrorHandler("This order has already been paid", 400));
      }
    }

    const orderId = String(order._id);
    const orderUrl = `${process.env.FRONTEND_URL}/dashboard/orders/${orderId}`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.orderItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: toCents(Number(item.price)),
        product_data: {
          name: item.name,
          // Stripe only accepts public https image URLs
          ...(item.image.startsWith("https://") && { images: [item.image] }),
        },
      },
    }));
    if (order.shippingAmount > 0) {
      lineItems.push({
        quantity: 1,
        price_data: { currency: "usd", unit_amount: toCents(order.shippingAmount), product_data: { name: "Shipping" } },
      });
    }
    lineItems.push({
      quantity: 1,
      price_data: { currency: "usd", unit_amount: toCents(order.taxAmount), product_data: { name: "Tax (15%)" } },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: user?.email,
      client_reference_id: orderId,
      metadata: { orderId },
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRES_MINUTES * 60,
      success_url: `${orderUrl}?payment=success`,
      cancel_url: `${orderUrl}?payment=cancelled`,
    });

    order.paymentInfo.sessionId = session.id;
    await order.save();

    res.status(200).json({ url: session.url });
  },
);

// Check with Stripe whether an order has been paid => /api/v1/payment/confirm/:orderId
// The customer lands back on the order page before the webhook may have arrived,
// so the page asks for the payment status directly.

export const confirmPayment = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const order = await Order.findOne({ _id: req.params.orderId, user: (req.user as any)?._id });

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    if (order.paymentInfo?.status === "unpaid" && order.paymentInfo.sessionId) {
      const session = await getStripe().checkout.sessions.retrieve(order.paymentInfo.sessionId);
      await markOrderPaid(session);
    }

    res.status(200).json({
      paymentStatus: (await Order.findById(order._id))?.paymentInfo?.status,
    });
  },
);

// Stripe webhook => /api/v1/payment/webhook (needs the raw request body, see app.ts)

export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"] as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    res.status(400).send(`Webhook error: ${(error as Error).message}`);
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await markOrderPaid(event.data.object);
        break;
      case "checkout.session.expired":
        await cancelExpiredOrder(event.data.object);
        break;
    }
  } catch (error) {
    // A non-2xx reply makes Stripe retry the event later
    console.log(`Failed to handle Stripe event ${event.type}: ${(error as Error).message}`);
    res.status(500).send("Webhook handler failed");
    return;
  }

  res.status(200).json({ received: true });
};
