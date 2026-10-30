import { IOrder } from "../models/order.js";
import { getOrderStatusTemplate } from "./emailTemplates.js";
import sendEmail from "./sendEmail.js";

type OrderEmailEvent = "Placed" | "Shipped" | "Delivered" | "Cancelled";

const content: Record<OrderEmailEvent, { subject: string; heading: string; intro: string }> = {
  Placed: {
    subject: "Your ShopIT order is confirmed",
    heading: "Thanks for your order!",
    intro: "We've received your order and are getting it ready. You'll pay in cash when it's delivered.",
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
    intro: "Your order has been cancelled. If you paid in advance, you'll be refunded. If this wasn't expected, please contact support.",
  },
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

  const { subject, heading, intro } = content[event];
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
