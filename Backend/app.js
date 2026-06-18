import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";


dotenv.config({ path:"Backend/config/config.env" });

// connecting to database

connectDatabase();

app.use(express.json());


// import all routes

import productRoutes from './routes/products.js';

app.use('/api/v1', productRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});  