import { NextFunction, Request, Response } from "express";
import multer from "multer";
import ErrorHandler from "../utils/errorHandler.js";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
  // Files stay in memory and are streamed straight to Cloudinary
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new ErrorHandler("Only JPG, PNG, WebP and GIF images are allowed", 400));
  },
});

// Accepts up to MAX_FILES images in the "images" field, with readable errors
export const uploadProductImages = (req: Request, res: Response, next: NextFunction): void => {
  upload.array("images", MAX_FILES)(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? `Each image must be ${MAX_FILE_SIZE_MB}MB or smaller`
          : err.code === "LIMIT_FILE_COUNT"
            ? `You can upload up to ${MAX_FILES} images at a time`
            : err.message;
      next(new ErrorHandler(message, 400));
      return;
    }
    next(err);
  });
};
