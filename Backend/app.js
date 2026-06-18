import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";


dotenv.config({ path:"Backend/config/config.env" });

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DB_LOCAL_URI:", process.env.DB_LOCAL_URI);

// connecting to database

connectDatabase();


// import all routes

import productRoutes from './routes/products.js';

app.use('/api/v1', productRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});  