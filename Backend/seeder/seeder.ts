import dotenv from "dotenv";
dotenv.config({ path: "Backend/config/config.env" });

import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async (): Promise<void> => {
  try {
    // Seed the same database the app uses in development
    await mongoose.connect(process.env.DB_LOCAL_URI as string);

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
