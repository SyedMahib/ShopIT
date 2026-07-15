import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new order => /api/v1/orders/new

export const newOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      paymentInfo,
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      paymentInfo,
      user: req.user?._id,
    });

    res.status(200).json({
        order,
    })
  },
);
