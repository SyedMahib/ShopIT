import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/shopIT");

    await Product.deleteMany();
    console.log("All products deleted successfully");

    await Product.insertMany(products);
    console.log("All products added successfully");

    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
};

seedProducts();
