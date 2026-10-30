import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new order => /api/v1/orders/new

export const newOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { orderItems, shippingInfo, paymentMethod, paymentInfo } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return next(new ErrorHandler("Please add items to your order", 400));
    }

    // Build items from the database so prices can't be set by the client
    const items = [];
    for (const item of orderItems) {
      const quantity = Number(item?.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return next(new ErrorHandler("Invalid item quantity", 400));
      }

      const product = await Product.findById(item?.product);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      if (product.stock < quantity) {
        return next(new ErrorHandler(`Not enough stock for ${product.name}`, 400));
      }

      items.push({
        name: product.name,
        quantity,
        image: product.images[0]?.url ?? "",
        price: String(product.price),
        product: product._id,
      });
    }

    const round = (n: number) => Math.round(n * 100) / 100;
    const itemsPrice = round(items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0));
    const shippingAmount = itemsPrice > 100 ? 0 : 25;
    const taxAmount = round(itemsPrice * 0.15);
    const totalAmount = round(itemsPrice + shippingAmount + taxAmount);

    const order = await Order.create({
      orderItems: items,
      shippingInfo,
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      paymentInfo,
      user: (req.user as any)?._id,
    });

    res.status(200).json({
      order,
    });
  },
);

// Get order details => /api/v1/orders/:id

export const getOrderDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    const currentUser = req.user as any;
    const isOwner = (order.user as any)?._id?.toString() === currentUser?._id?.toString();
    if (!isOwner && currentUser?.role !== "admin") {
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
    const orders = await Order.find({ user: (req.user as any)?._id });

    res.status(200).json({
      orders,
    });
  },
);

// Get all orders - Admin => /api/v1/admin/orders

export const allOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const orders = await Order.find();

    res.status(200).json({
      orders,
    });
  },
);

// Upadate orders - Admin => /api/v1/admin/orders/:id

export const updateOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    if (order?.orderStatus === "Shipped") {
      return next(
        new ErrorHandler("You have already delivered this order", 400),
      );
    }

    // Update product stock

    order?.orderItems?.forEach(async (item) => {
      const product = await Product.findById(item?.product?.toString());

      if (!product) {
        return next(new ErrorHandler("No products found with this ID", 404));
      }

      product.stock = product.stock - item.quantity;

      await product.save();
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
    });
  },
);

// Delete Order => /api/v1/admin/orders/:id

export const deleteOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
    });
  },
);
