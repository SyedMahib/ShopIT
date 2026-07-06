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


// Authorize roles

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user?.role as string)) {
      return next (
        new ErrorHandler(` Role (${req.user?.role}) is not allowed to access this resource`, 403)
      )
    }

    next();
  }
}