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
    });
  },
);

// Get order details => /api/v1/orders/:id

export const getOrderDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    res.status(200).json({
      order,
    });
  },
);

// Get current user orders => /api/v1/me/orders

export const myOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const orders = await Order.find({ user: req.user?._id });


    res.status(200).json({
      orders,
    });
  },
);

// Get all orders - Admin => /api/v1/admin/orders

export const allOrders = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const orders = await Order.find();

  res.status(200).json({
    orders,
  })
})
