import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";

// Register a User => /api/v1/register
export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    sendToken(user, 201, res);
  }
);

// Login a User => /api/v1/login
export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    //  check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  }
);