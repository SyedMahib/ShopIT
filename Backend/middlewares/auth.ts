import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Check if the user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.cookies;

    if (!token) {
      next(new ErrorHandler("Please login to access this resource", 401));
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    req.user = await User.findById(decoded.id) ?? undefined;

    next();
  }
);