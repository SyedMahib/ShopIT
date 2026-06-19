import { Request, Response } from "express";
import Product from "../models/product.js";

// Get all products => GET /api/v1/products
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await Product.find();

  res.status(200).json({
    products,
  });
};

// Create new product => POST /api/v1/admin/products
export const newProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await Product.create(req.body);

  res.status(201).json({
    product,
  });
};

// Get single product details => GET /api/v1/products/:id
export const getProductDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await Product.findById(req.params?.id);

  if (!product) {
    res.status(404).json({
      error: "Product not found",
    });
    return;
  }

  res.status(200).json({
    product,
  });
};

// Update product details => PUT /api/v1/products/:id
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  let product = await Product.findById(req.params?.id);

  if (!product) {
    res.status(404).json({
      error: "Product not found",
    });
    return;
  }

  product = await Product.findByIdAndUpdate(req.params?.id, req.body, {
    returnDocument: "after",
    runvalidators: true,
  });

  res.status(200).json({
    product,
  });
};

// Delete product => DELETE /api/v1/products/:id
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await Product.findById(req.params?.id);

  if (!product) {
    res.status(404).json({
      error: "Product not found",
    });
    return;
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted successfully",
  });
};
