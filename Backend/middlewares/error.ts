import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.js";

export default (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

// Handle Invalid Mongoose ID error

if (err.name === "CastError") {
  const message = `Resource not found. Invalid: ${err?.path}`;
  error = new ErrorHandler(message, 404);
}

// Handle Validation Error

if (err.name === "ValidationError") {
  const message = Object.values(err.errors).map((value: any) => value.message).join(", ");
  error = new ErrorHandler(message, 400);
}

//Handle Mongoose Duplicate Key error

if (err.code === 11000) {
  const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
  error = new ErrorHandler(message, 400);
}

//Handle wrong JWT error

if (err.name === "JsonWebTokenError") {
  const message = `Json Web Token is Invalid, please try again!!!`;
  error = new ErrorHandler(message, 401);
}

//Handle wrong JWT error

if (err.name === "tokenExpireError") {
  const message = `JSON web token is expired, please try again.`;
  error = new ErrorHandler(message, 401);
}

  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }
  if (process.env.NODE_ENV === "production") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
