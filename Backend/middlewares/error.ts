import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.js";

export default (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

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
