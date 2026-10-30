import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ChevronLeft, Plus, X } from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  useCreateProductMutation,
  useGetAdminProductsQuery,
  useUpdateProductMutation,
} from "../../store/adminApi";
import type { ProductInput } from "../../store/adminApi";
import { productsApi } from "../../store/productsApi";
import type { ProductDetails } from "../../store/productsApi";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

/** Create page (no productId) and edit page (with productId) share this form. */
export default function ProductFormPage() {
  const params = useParams({ strict: false }) as { productId?: string };
  const productId = params.productId;
  const { data, isLoading } = useGetAdminProductsQuery(undefined, { skip: !productId });

  if (productId && isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />;
  }

  const product = productId ? data?.products.find((p) => p._id === productId) : undefined;
  if (productId && !product) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Product not found</h1>
        <Link to="/admin/products" className="mt-4 inline-block text-sm font-medium text-blue-600">
          Back to products
        </Link>
      </div>
    );
  }

  // key resets the form state when switching between products
  return <ProductForm key={productId ?? "new"} product={product} />;
}

function ProductForm({ product }: { product?: ProductDetails }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images.length ? product.images.map((i) => i.url) : [""],
  );
  const [error, setError] = useState("");
  const isEdit = Boolean(product);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body: ProductInput = {
      name: String(form.get("name")).trim(),
      price: Number(form.get("price")),
      description: String(form.get("description")).trim(),
      category: String(form.get("category")),
      seller: String(form.get("seller")).trim(),
      stock: Number(form.get("stock")),
      images: imageUrls.map((url) => url.trim()).filter(Boolean).map((url) => ({ url })),
    };

    setError("");
    try {
      if (product) {
        await updateProduct({ id: product._id, body }).unwrap();
        dispatch(productsApi.util.invalidateTags([{ type: "Products", id: "LIST" }, { type: "Products", id: product._id }]));
      } else {
        await createProduct(body).unwrap();
        dispatch(productsApi.util.invalidateTags([{ type: "Products", id: "LIST" }]));
      }
      navigate({ to: "/admin/products" });
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message || "Could not save the product.");
    }
  };

  return (
    <div className="max-w-2xl">
      <Link
        to="/admin/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ChevronLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{isEdit ? "Edit product" : "New product"}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
          <input id="name" name="name" required maxLength={200} defaultValue={product?.name} className={inputClass} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price ($)</label>
            <input id="price" name="price" type="number" min="0" step="0.01" required defaultValue={product?.price} className={inputClass} />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-700">Stock</label>
            <input id="stock" name="stock" type="number" min="0" step="1" required defaultValue={product?.stock} className={inputClass} />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
            <select id="category" name="category" required defaultValue={product?.category ?? ""} className={inputClass}>
              <option value="" disabled>Select a category</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="seller" className="block text-sm font-medium text-slate-700">Seller</label>
            <input id="seller" name="seller" required defaultValue={product?.seller} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
          <textarea id="description" name="description" required rows={5} defaultValue={product?.description} className={inputClass} />
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-slate-700">Image URLs</legend>
          <div className="mt-2 space-y-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  placeholder="https://..."
                  aria-label={`Image URL ${index + 1}`}
                  onChange={(e) => setImageUrls((urls) => urls.map((u, i) => (i === index ? e.target.value : u)))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImageUrls((urls) => urls.filter((_, i) => i !== index))}
                    aria-label={`Remove image ${index + 1}`}
                    className="rounded-lg border border-slate-300 px-3 text-slate-500 hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setImageUrls((urls) => [...urls, ""])}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" /> Add another image
          </button>
        </fieldset>

        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {isCreating || isUpdating ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </button>
      </form>
    </div>
  );
}
