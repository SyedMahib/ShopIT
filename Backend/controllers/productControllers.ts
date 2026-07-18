import { NextFunction, Request, Response } from "express";
import Product from "../models/product.js";
import type { IReview } from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Get all products => GET /api/v1/products
export const getProducts = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    const resPerPage = 4;
    const apiFilters = new APIFilters(
      Product.find(),
      req.query as Record<string, string>,
    ).search();

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

// Create new product => POST /api/v1/admin/products
export const newProduct = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    req.body.user = req.user?._id;

    const product = await Product.create(req.body);

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

    req.body.user = req.user?._id;

    product = await Product.findByIdAndUpdate(req.params?.id, req.body, {
      returnDocument: "after",
      runvalidators: true,
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

// Creat/Update Reviews =>  /api/v1/reviews
export const createProductReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req?.user?._id,
      rating: Number(rating),
      comment,
    } as IReview;

    const product = await Product.findById(productId);

    if (!product) {
      next(new ErrorHandler("Product not found", 404));
      return;
    }

    const isReviewed = product?.reviews?.find(
      (r) => r.user.toString() === req?.user?._id.toString(),
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req?.user?._id.toString())
          review.comment = comment;
        review.rating = rating;

      });
    } else {
      product.reviews.push (review);
      product.NumOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
    });
  },
);
