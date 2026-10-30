import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order, { IOrder, OrderStatus } from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendOrderEmail } from "../utils/orderEmails.js";

// Which status an order may move to from its current status
const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

// Put reserved stock back on the shelf (used when an order is cancelled or deleted)
const restoreStock = async (order: IOrder): Promise<void> => {
  for (const item of order.orderItems) {
    await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
  }
};

// Create new order => /api/v1/orders/new

export const newOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { orderItems, shippingInfo, paymentMethod, paymentInfo } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return next(new ErrorHandler("Please add items to your order", 400));
    }

    // Combine repeated products into one line each
    const quantities = new Map<string, number>();
    for (const item of orderItems) {
      const productId = String(item?.product ?? "");
      const quantity = Number(item?.quantity);
      if (!mongoose.isValidObjectId(productId)) {
        return next(new ErrorHandler("Product not found", 404));
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        return next(new ErrorHandler("Invalid item quantity", 400));
      }
      quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
    }

    // Reserve stock for each item. The stock check and decrement happen in a
    // single update, so two customers can't both buy the last unit.
    // Item details and prices come from the database, never from the client.
    const items = [];
    const reserved: { product: mongoose.Types.ObjectId; quantity: number }[] = [];
    const releaseReserved = () =>
      Promise.all(
        reserved.map((r) => Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } })),
      );

    for (const [productId, quantity] of quantities) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { returnDocument: "after" },
      );

      if (!product) {
        await releaseReserved();
        const exists = await Product.findById(productId).select("name");
        return next(
          exists
            ? new ErrorHandler(`Not enough stock for ${exists.name}`, 400)
            : new ErrorHandler("Product not found", 404),
        );
      }

      reserved.push({ product: product._id as mongoose.Types.ObjectId, quantity });
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

    let order;
    try {
      order = await Order.create({
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
    } catch (error) {
      // e.g. missing shipping info: give the reserved stock back
      await releaseReserved();
      throw error;
    }

    sendOrderEmail(order, req.user as any, "Placed");

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
    const orders = await Order.find({ user: (req.user as any)?._id }).sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  },
);

// Cancel own order (only while Processing) => /api/v1/orders/:id/cancel

export const cancelMyOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const order = await Order.findOne({ _id: req.params.id, user: (req.user as any)?._id });

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    if (order.orderStatus !== "Processing") {
      return next(
        new ErrorHandler(`This order is already ${order.orderStatus.toLowerCase()} and can't be cancelled`, 400),
      );
    }

    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    await order.save();
    await restoreStock(order);

    sendOrderEmail(order, req.user as any, "Cancelled");

    res.status(200).json({
      order,
    });
  },
);

// Get all orders - Admin => /api/v1/admin/orders

export const allOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");

    res.status(200).json({
      orders,
    });
  },
);

// Update order status - Admin => /api/v1/admin/orders/:id

export const updateOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    const status = req.body.status as OrderStatus;
    if (!allowedTransitions[order.orderStatus]?.includes(status)) {
      return next(
        new ErrorHandler(`Can't change order from ${order.orderStatus} to ${status}`, 400),
      );
    }

    order.orderStatus = status;
    if (status === "Delivered") order.deliveredAt = new Date();
    if (status === "Cancelled") order.cancelledAt = new Date();
    await order.save();

    if (status === "Cancelled") await restoreStock(order);

    // "Processing" is never a target status, so every change here is worth an email
    sendOrderEmail(order, order.user as any, status as "Shipped" | "Delivered" | "Cancelled");

    res.status(200).json({
      order,
    });
  },
);

// Delete Order - Admin => /api/v1/admin/orders/:id

export const deleteOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    // Stock for an order that never shipped is still reserved: release it
    if (order.orderStatus === "Processing") await restoreStock(order);

    await order.deleteOne();

    res.status(200).json({
      success: true,
    });
  },
);
