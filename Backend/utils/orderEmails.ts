import { IOrder } from "../models/order.js";
import { getOrderStatusTemplate } from "./emailTemplates.js";
import sendEmail from "./sendEmail.js";

type OrderEmailEvent = "Placed" | "Shipped" | "Delivered" | "Cancelled";

const content: Record<OrderEmailEvent, { subject: string; heading: string; intro: string }> = {
  Placed: {
    subject: "Your ShopIT order is confirmed",
    heading: "Thanks for your order!",
    intro: "We've received your order and are getting it ready.",
  },
  Shipped: {
    subject: "Your ShopIT order has shipped",
    heading: "Your order is on its way",
    intro: "Good news! Your order has left our warehouse and is on its way to you.",
  },
  Delivered: {
    subject: "Your ShopIT order was delivered",
    heading: "Your order has been delivered",
    intro: "Your order has arrived. We hope you love it! You can now leave a review for the products you bought.",
  },
  Cancelled: {
    subject: "Your ShopIT order was cancelled",
    heading: "Your order has been cancelled",
    intro: "Your order has been cancelled. If this wasn't expected, please contact support.",
  },
};

// Extra sentence about the payment for placed and cancelled orders
const paymentNote = (order: IOrder, event: OrderEmailEvent): string => {
  if (event === "Placed") {
    return order.paymentMethod === "COD"
      ? "You'll pay in cash when it's delivered."
      : "Your card payment was successful.";
  }
  if (event === "Cancelled" && order.paymentMethod === "Card") {
    return order.paymentInfo?.status === "refunded"
      ? "Your card payment has been refunded; it can take 5-10 business days to show on your statement."
      : "The payment wasn't completed, so your card was not charged.";
  }
  return "";
};

/**
 * Emails the customer about their order. Runs in the background and never
 * throws: a failed email must not fail the order action itself.
 */
export const sendOrderEmail = (
  order: IOrder,
  user: { name?: string; email?: string } | null | undefined,
  event: OrderEmailEvent,
): void => {
  if (!user?.email) return;

  const { subject, heading } = content[event];
  const intro = `${content[event].intro} ${paymentNote(order, event)}`.trim();
  const orderId = String(order._id);
  const { address, city, zipCode, country } = order.shippingInfo;

  const message = getOrderStatusTemplate(
    user.name ?? "there",
    heading,
    intro,
    {
      orderId,
      items: order.orderItems,
      itemsPrice: order.itemsPrice,
      shippingAmount: order.shippingAmount,
      taxAmount: order.taxAmount,
      totalAmount: order.totalAmount,
      shippingAddress: `${address}, ${city} ${zipCode}, ${country}`,
    },
    `${process.env.FRONTEND_URL}/dashboard/orders/${orderId}`,
  );

  sendEmail({ email: user.email, subject, message }).catch((error) => {
    console.log(`Failed to send "${event}" email for order ${orderId}: ${(error as Error)?.message}`);
  });
};
