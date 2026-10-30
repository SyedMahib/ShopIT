import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Wishlist from "../models/wishlist.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

// Get current user's wishlist with product details => /api/v1/wishlist
export const getWishlist = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req.user as any)?._id;
    let wishlist = await Wishlist.findOne({ user: userId })
      .populate("products", "name price images category stock ratings");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  }
);

// Add product to wishlist => /api/v1/wishlist/add
export const addToWishlist = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.body;
    const userId = (req.user as any)?._id;

    if (!productId) {
      return next(new ErrorHandler("Please provide product ID", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId });
    }

    if (wishlist.products.some((id) => id.toString() === String(productId))) {
      return next(new ErrorHandler("Product already in wishlist", 400));
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({
      success: true,
      wishlist,
    });
  }
);

// Remove product from wishlist => /api/v1/wishlist/remove/:productId
export const removeFromWishlist = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.params;
    const userId = (req.user as any)?._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return next(new ErrorHandler("Wishlist not found", 404));
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      wishlist,
    });
  }
);
