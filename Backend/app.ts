import dotenv from "dotenv";
dotenv.config({ path: "Backend/config/config.env" });

import express from "express";
import passport from "passport";
import session from "express-session";
import { connectDatabase } from "./config/dbConnect.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import "./config/passport.config.js";
import User from "./models/user.js";

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1)
})

const app = express();

// Connect to database
connectDatabase();

app.use(express.json());
app.use(cookieParser());

// Passport session support
app.use(
  session({
    secret: process.env.JWT_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);

// Proxy Google avatars (Google blocks direct cross-origin requests)
app.get("/api/avatar/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user?.avatar?.url) return res.status(404).send("No avatar");

    const response = await fetch(user.avatar.url, {
      headers: {
        Referer: "https://www.google.com/",
        "User-Agent": "Mozilla/5.0",
      },
    });
    const buffer = await response.arrayBuffer();
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Failed to fetch avatar");
  }
});


// Using Error Middlewares

app.use(errorMiddleware);

const PORT = process.env.PORT as string;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running on port: ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});

// Handle Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err}`);
  console.log("Shutting down servern due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
