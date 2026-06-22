import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.js";

export default (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  res.status(error.statusCode).json({
    message: error.message,
  });
};