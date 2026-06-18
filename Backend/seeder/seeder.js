import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";



const seedProducts = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/shopIT");

        await Product.deleteMany();
        console.log("All products are deleted successfully");

        await Product.insertMany(products);
        console.log("All products are added successfully");

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
};

seedProducts();