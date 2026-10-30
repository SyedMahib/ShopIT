import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/product.js";
import Order from "../models/order.js";
import type { IReview } from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Get all products => GET /api/v1/products
export const getProducts = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    const requestedPageSize = Number(req.query.limit);
    // The client uses this value to calculate pagination, so the API must
    // paginate with the same value. Keep a safe default and upper bound.
    const resPerPage =
      Number.isInteger(requestedPageSize) && requestedPageSize > 0
        ? Math.min(requestedPageSize, 50)
        : 4;
    const apiFilters = new APIFilters(
      Product.find(),
      req.query as Record<string, any>,
    )
      .search()
      .filters()
      .sort();

    let products = await apiFilters.query;
    const filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();

    res.status(200).json({
      resPerPage,
      filteredProductsCount,
      products,
    });
  },
);

// Fields an admin may set on a product. Ratings and reviews are managed by the review endpoints.
const editableProductFields = ["name", "price", "description", "images", "category", "seller", "stock"];

const pickProductFields = (body: Record<string, any>) => {
  const data: Record<string, any> = {};
  for (const field of editableProductFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  if (Array.isArray(data.images)) {
    data.images = data.images.map((img: any) => ({
      public_id: img?.public_id || String(img?.url ?? ""),
      url: String(img?.url ?? ""),
    }));
  }
  return data;
};

// Get all products - Admin => GET /api/v1/admin/products
export const adminProducts = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    const products = await Product.find().select("-reviews").sort({ createdAt: -1 });

    res.status(200).json({
      products,
    });
  },
);

// Create new product => POST /api/v1/admin/products
export const newProduct = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    const product = await Product.create({
      ...pickProductFields(req.body),
      user: (req.user as any)?._id,
    });

    res.status(201).json({
      product,
    });
  },
);

// Get single product details => GET /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const product = await Product.findById(req.params?.id);

    if (!product) {
      next(new ErrorHandler("Product not found", 404));
      return;
    }

    res.status(200).json({
      product,
    });
  },
);

// Update product details => PUT /api/v1/products/:id
export const updateProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let product = await Product.findById(req.params?.id);

    if (!product) {
      next(new ErrorHandler("Product not found", 404));
      return;
    }

    product = await Product.findByIdAndUpdate(req.params?.id, pickProductFields(req.body), {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      product,
    });
  },
);

// Delete product => DELETE /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const product = await Product.findById(req.params?.id);

    if (!product) {
      next(new ErrorHandler("Product not found", 404));
      return;
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  },
);

// Only customers who have received the product may review it
const hasReceivedProduct = (userId: string, productId: string) =>
  Order.exists({
    user: userId,
    orderStatus: "Delivered",
    "orderItems.product": productId,
  });

const recalcRatings = (reviews: IReview[]) =>
  reviews.length === 0
    ? 0
    : Math.round((reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length) * 10) / 10;

// Create/Update Reviews =>  /api/v1/reviews
export const createProductReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { productId } = req.body;
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment ?? "").trim();
    const userId = (req.user as any)?._id;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      next(new ErrorHandler("Rating must be a whole number from 1 to 5", 400));
      return;
    }
    if (!comment) {
      next(new ErrorHandler("Please write a comment", 400));
      return;
    }
    if (comment.length > 1000) {
      next(new ErrorHandler("Comment cannot exceed 1000 characters", 400));
      return;
    }
    if (!mongoose.isValidObjectId(productId)) {
      next(new ErrorHandler("Product not found", 404));
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      next(new ErrorHandler("Product not found", 404));
      return;
    }

    if (!(await hasReceivedProduct(String(userId), String(product._id)))) {
      next(new ErrorHandler("You can review this product after your order is delivered", 403));
      return;
    }

    const existing = product.reviews.find((r) => r.user.toString() === userId.toString());

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
    } else {
      product.reviews.push({ user: userId, rating, comment } as IReview);
    }

    product.NumOfReviews = product.reviews.length;
    product.ratings = recalcRatings(product.reviews);

    // Seeded products have no creator `user`, so only validate what changed
    await product.save({ validateModifiedOnly: true });

    res.status(200).json({
      success: true,
    });
  },
);

// Get product Reviews (public) => /api/v1/reviews?id=
export const getProductReviews = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.isValidObjectId(req.query.id)) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const product = await Product.findById(req.query.id)
      .select("reviews")
      .populate("reviews.user", "name avatar");

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      reviews: product.reviews,
    });
  },
);

// Can the current user review this product? => /api/v1/can_review?productId=
export const canUserReview = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    const productId = req.query.productId;
    const canReview = mongoose.isValidObjectId(productId)
      ? Boolean(await hasReceivedProduct(String((req.user as any)?._id), String(productId)))
      : false;

    res.status(200).json({
      canReview,
    });
  },
);

// Delete product Reviews =>  /api/v1/admin/reviews
export const deleteProductReviews = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let product = await Product.findById(req.query.productId);

    if (!product) {
      next(new ErrorHandler("Product not found", 404));
      return;
    }

    const reviews = product?.reviews?.filter(
      (review) => review._id!.toString() !== req?.query?.id?.toString(),
    );

    const numOfReviews = reviews.length;

    const ratings = recalcRatings(reviews);

    product = await Product.findByIdAndUpdate(
      req.query.productId,
      { reviews, NumOfReviews: numOfReviews, ratings },
      { returnDocument: "after" },
    );

    res.status(200).json({
      success: true,
      product,
    });
  },
);
