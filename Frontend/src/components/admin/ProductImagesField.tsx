import { useRef, useState, type DragEvent } from "react";
import { ChevronLeft, ImagePlus, Link as LinkIcon, Loader2, X } from "lucide-react";
import defaultProductImage from "../../assets/default_product.png";
import { useDeleteUnusedImageMutation, useUploadProductImagesMutation } from "../../store/adminApi";
import type { ProductImage } from "../../store/adminApi";

const MAX_SIZE_MB = 5;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ProductImagesFieldProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  /** public_ids already saved on the product; only other uploads are deleted on remove */
  savedIds: Set<string>;
}

export default function ProductImagesField({ images, onChange, savedIds }: ProductImagesFieldProps) {
  const [uploadImages, { isLoading: isUploading }] = useUploadProductImagesMutation();
  const [deleteUnusedImage] = useDeleteUnusedImageMutation();
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;

    const invalid = files.find((f) => !ACCEPTED.includes(f.type));
    if (invalid) {
      setError(`${invalid.name}: only JPG, PNG, WebP and GIF images are allowed`);
      return;
    }
    const tooBig = files.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig) {
      setError(`${tooBig.name} is larger than ${MAX_SIZE_MB}MB`);
      return;
    }

    setError("");
    try {
      const result = await uploadImages(files).unwrap();
      onChange([...images, ...result.images]);
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message || "Upload failed. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const removed = images[index];
    onChange(images.filter((_, i) => i !== index));
    // Clean up uploads that were never saved on the product
    if (removed.public_id && !savedIds.has(removed.public_id)) {
      deleteUnusedImage(removed.public_id);
    }
  };

  const moveToFront = (index: number) => {
    const next = [...images];
    const [image] = next.splice(index, 1);
    onChange([image, ...next]);
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!/^https?:\/\//i.test(url)) {
      setError("Image URL must start with http:// or https://");
      return;
    }
    setError("");
    onChange([...images, { url }]);
    setUrlInput("");
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!isUploading) handleFiles(e.dataTransfer.files);
  };

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-slate-700">Images</legend>
      <p className="mt-1 text-xs text-slate-500">The first image is shown on product cards. JPG, PNG, WebP or GIF, up to {MAX_SIZE_MB}MB each.</p>

      {images.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={`${image.public_id ?? image.url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
            >
              <img
                src={image.url}
                alt={`Product image ${index + 1}`}
                className="h-full w-full object-contain p-2"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultProductImage;
                }}
              />
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Main
                </span>
              )}
              <div className="absolute right-1.5 top-1.5 flex gap-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveToFront(index)}
                    aria-label={`Make image ${index + 1} the main image`}
                    title="Make main image"
                    className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-slate-600 shadow hover:text-blue-600"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove image ${index + 1}`}
                  title="Remove"
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-slate-600 shadow hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragging ? "border-blue-500 bg-blue-50" : "border-slate-300"
        }`}
      >
        {isUploading ? (
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
          </p>
        ) : (
          <>
            <ImagePlus className="h-6 w-6 text-slate-400" />
            <p className="mt-2 text-sm text-slate-600">
              Drag images here or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                browse
              </button>
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder="Or paste an image URL"
            aria-label="Image URL"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={!urlInput.trim()}
          className="rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}
