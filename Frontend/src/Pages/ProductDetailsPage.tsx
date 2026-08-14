import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft, Minus, PackageCheck, Plus, RotateCcw, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { useState } from "react";
import defaultProductImage from "../assets/default_product.png";
import { useGetProductByIdQuery } from "../store/productsApi";

function ProductImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = defaultProductImage;
      }}
    />
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-5 w-32 rounded bg-slate-200" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square rounded-3xl bg-slate-200" />
        <div className="space-y-5 pt-2">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-10 w-4/5 rounded bg-slate-200" />
          <div className="h-6 w-36 rounded bg-slate-200" />
          <div className="h-12 w-full rounded bg-slate-200" />
          <div className="h-28 w-full rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function ProductDetailsPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const { data, error, isLoading } = useGetProductByIdQuery(productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <ProductDetailsSkeleton />;

  if (error || !data?.product) {
    const message = (error as { data?: { message?: string }; error?: string })?.data?.message
      || (error as { error?: string })?.error
      || "We couldn't find that product.";

    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Product unavailable</h1>
        <p className="mt-3 text-slate-600">{message}</p>
        <Link to="/shop" className="mt-7 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
          Back to shop
        </Link>
      </div>
    );
  }

  const product = data.product;
  const images = product.images.length ? product.images : [{ url: defaultProductImage }];
  const activeImage = images[Math.min(selectedImage, images.length - 1)].url;
  const isInStock = product.stock > 0;
  const reviewCount = product.NumOfReviews ?? 0;

  return (
    <main className="bg-slate-50/70 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="mb-7 inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600">
          <ChevronLeft className="h-4 w-4" /> Back to shop
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-10">
                <ProductImage src={activeImage} alt={product.name} className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      aria-label={`View image ${index + 1} of ${product.name}`}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-2 transition ${selectedImage === index ? "border-blue-600" : "border-slate-200 hover:border-slate-400"}`}
                    >
                      <ProductImage src={image.url} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">{product.category}</span>
                <span className={`font-medium ${isInStock ? "text-emerald-700" : "text-rose-600"}`}>
                  {isInStock ? "In stock" : "Out of stock"}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-6">
                <div className="flex items-center" aria-label={`${product.ratings} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} className={`h-5 w-5 ${index < Math.round(product.ratings) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
                <span className="font-semibold text-slate-800">{product.ratings.toFixed(1)}</span>
                <span className="text-sm text-slate-500">{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</span>
              </div>

              <p className="mt-6 text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
              <p className="mt-5 leading-7 text-slate-600">{product.description}</p>

              <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                <div className="flex h-12 items-center self-start rounded-xl border border-slate-300 bg-white">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={!isInStock || quantity === 1} className="grid h-full w-11 place-items-center text-slate-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold text-slate-900">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} disabled={!isInStock || quantity >= product.stock} className="grid h-full w-11 place-items-center text-slate-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button type="button" disabled={!isInStock} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300">
                  <ShoppingCart className="h-5 w-5" /> {isInStock ? "Add to cart" : "Out of stock"}
                </button>
              </div>
              {isInStock && <p className="mt-3 text-sm text-slate-500">{product.stock} available from {product.seller}</p>}

              <div className="mt-9 grid gap-4 border-t border-slate-200 pt-7 sm:grid-cols-3">
                <div className="flex gap-3 text-sm text-slate-600"><Truck className="h-5 w-5 shrink-0 text-blue-600" /><span><strong className="block text-slate-800">Fast delivery</strong>Reliable shipping</span></div>
                <div className="flex gap-3 text-sm text-slate-600"><ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" /><span><strong className="block text-slate-800">Secure payment</strong>Protected checkout</span></div>
                <div className="flex gap-3 text-sm text-slate-600"><RotateCcw className="h-5 w-5 shrink-0 text-blue-600" /><span><strong className="block text-slate-800">Easy returns</strong>Simple 30-day returns</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Product information</h2>
          </div>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4"><dt className="text-slate-500">Category</dt><dd className="mt-1 font-semibold text-slate-900">{product.category}</dd></div>
            <div className="rounded-xl bg-slate-50 p-4"><dt className="text-slate-500">Sold by</dt><dd className="mt-1 font-semibold text-slate-900">{product.seller}</dd></div>
            <div className="rounded-xl bg-slate-50 p-4"><dt className="text-slate-500">Availability</dt><dd className={`mt-1 font-semibold ${isInStock ? "text-emerald-700" : "text-rose-600"}`}>{isInStock ? `${product.stock} in stock` : "Currently unavailable"}</dd></div>
          </dl>
        </section>
      </div>
    </main>
  );
}

export default ProductDetailsPage;
