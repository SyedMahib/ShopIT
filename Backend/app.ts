import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
import productRoutes from "./routes/products.js";
import errorMiddleware from "./middlewares/error.js"

dotenv.config({ path: "Backend/config/config.env" });

const app = express();

// Connect to database
connectDatabase();

app.use(express.json());

// Routes
app.use("/api/v1", productRoutes);



// Using Error Middlewares

app.use(errorMiddleware);

const PORT = process.env.PORT as string;

app.listen(PORT, () => {
  console.log(
    `Server is running on port: ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
