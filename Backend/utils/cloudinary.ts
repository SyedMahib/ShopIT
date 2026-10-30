import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import ErrorHandler from "./errorHandler.js";

// Images we upload live in these folders. Only images in them are ever
// deleted, so seed/demo images from other accounts are never touched.
export const PRODUCT_IMAGE_FOLDER = "ShopIT/products";
export const AVATAR_FOLDER = "ShopIT/avatars";

let configured = false;

const ensureConfigured = (): void => {
  if (configured) return;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new ErrorHandler(
      "Image uploads are not configured. Set the CLOUDINARY_* values in Backend/config/config.env",
      500,
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
};

const uploadToFolder = (
  buffer: Buffer,
  folder: string,
  transformation: UploadApiOptions["transformation"],
): Promise<{ public_id: string; url: string }> => {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", transformation },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(new ErrorHandler(error?.message || "Image upload failed", 500));
          return;
        }
        resolve({ public_id: result.public_id, url: result.secure_url });
      },
    );
    stream.end(buffer);
  });
};

// Keep stored product images a sensible size
export const uploadImage = (buffer: Buffer) =>
  uploadToFolder(buffer, PRODUCT_IMAGE_FOLDER, [{ width: 1600, height: 1600, crop: "limit" }]);

// Square avatar, cropped around the face when one is found
export const uploadAvatar = (buffer: Buffer) =>
  uploadToFolder(buffer, AVATAR_FOLDER, [{ width: 400, height: 400, crop: "fill", gravity: "face" }]);

export const isInFolder = (publicId: string | undefined, folder: string): boolean =>
  Boolean(publicId?.startsWith(`${folder}/`));

export const isOwnImage = (publicId?: string): boolean =>
  isInFolder(publicId, PRODUCT_IMAGE_FOLDER) || isInFolder(publicId, AVATAR_FOLDER);

// Best effort: a failed delete only leaves an unused file in Cloudinary
export const deleteImages = async (publicIds: (string | undefined)[]): Promise<void> => {
  const ours = publicIds.filter(isOwnImage) as string[];
  if (ours.length === 0) return;

  try {
    ensureConfigured();
    await Promise.all(ours.map((id) => cloudinary.uploader.destroy(id)));
  } catch (error) {
    console.log(`Failed to delete images from Cloudinary: ${(error as Error)?.message}`);
  }
};
