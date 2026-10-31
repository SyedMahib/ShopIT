import Stripe from "stripe";
import { IOrder } from "../models/order.js";
import ErrorHandler from "./errorHandler.js";

let client: Stripe | null = null;

export const isStripeConfigured = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY);

// Created on first use, so the server still starts without Stripe keys (COD keeps working)
export const getStripe = (): Stripe => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ErrorHandler("Card payments are not available right now", 503);
  }
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
};

/**
 * Settles the card payment of an order that is being cancelled: refunds it if
 * it was paid, or closes the open checkout page so it can't be paid any more.
 * Updates order.paymentInfo but doesn't save; the caller saves the order.
 * Throws if the refund fails, so the order isn't cancelled without its refund.
 */
export const settlePaymentOnCancel = async (order: IOrder): Promise<void> => {
  if (order.paymentMethod !== "Card" || !order.paymentInfo) return;

  if (order.paymentInfo.status === "paid" && order.paymentInfo.id) {
    await getStripe().refunds.create({ payment_intent: order.paymentInfo.id });
    order.paymentInfo.status = "refunded";
    return;
  }

  if (order.paymentInfo.status === "unpaid" && order.paymentInfo.sessionId) {
    try {
      await getStripe().checkout.sessions.expire(order.paymentInfo.sessionId);
    } catch {
      // Already expired or completed: nothing left to close
    }
  }
};
