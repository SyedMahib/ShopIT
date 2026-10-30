import { NextFunction, Request, Response } from "express";
import multer from "multer";
import ErrorHandler from "../utils/errorHandler.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Accepts up to `maxFiles` images in `field` (files stay in memory and are
// streamed straight to Cloudinary), turning upload errors into readable messages
const imageUpload = (field: string, maxFiles: number, maxSizeMB: number) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024, files: maxFiles },
    fileFilter: (req, file, cb) => {
      if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
      else cb(new ErrorHandler("Only JPG, PNG, WebP and GIF images are allowed", 400));
    },
  }).array(field, maxFiles);

  return (req: Request, res: Response, next: NextFunction): void => {
    upload(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        const message =
          err.code === "LIMIT_FILE_SIZE"
            ? `Each image must be ${maxSizeMB}MB or smaller`
            : err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE"
              ? `You can upload up to ${maxFiles} image${maxFiles > 1 ? "s" : ""} at a time`
              : err.message;
        next(new ErrorHandler(message, 400));
        return;
      }
      next(err);
    });
  };
};

export const uploadProductImages = imageUpload("images", 10, 5);
export const uploadAvatarImage = imageUpload("avatar", 1, 2);
