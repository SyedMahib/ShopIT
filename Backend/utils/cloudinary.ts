import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import ErrorHandler from "./errorHandler.js";

// Images we upload live in this folder. Only images in it are ever deleted,
// so seed/demo images from other accounts are never touched.
export const PRODUCT_IMAGE_FOLDER = "ShopIT/products";

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

export const uploadImage = (buffer: Buffer): Promise<{ public_id: string; url: string }> => {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: PRODUCT_IMAGE_FOLDER,
        resource_type: "image",
        // Keep stored images a sensible size
        transformation: [{ width: 1600, height: 1600, crop: "limit" }],
      },
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

export const isOwnImage = (publicId?: string): boolean =>
  Boolean(publicId?.startsWith(`${PRODUCT_IMAGE_FOLDER}/`));

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
