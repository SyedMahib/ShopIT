import ProductCard from "./ProductCard";

export interface Product {
  _id: string;
  name: string;
  price: number;
  ratings: number;
  NumOfReviews: number;
  images: { url: string }[];
  category: string;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  refreshing?: boolean;
  skeletonCount?: number;
  error: string | null;
}

function ProductGrid({ products, loading, refreshing = false, skeletonCount = 8, error }: ProductGridProps) {
  if (loading) {
    return (
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        role="status"
        aria-label="Loading products"
      >
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white"
            aria-hidden="true"
          >
            <div className="h-48 bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-2/5 rounded bg-slate-200" />
              <div className="h-4 w-4/5 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-3/5 rounded bg-slate-200" />
              <div className="mt-6 h-5 w-1/3 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-rose-600 shadow-sm">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-slate-700 shadow-sm">
        No products available.
      </div>
    );
  }

  return (
    <div aria-busy={refreshing}>
      {refreshing && (
        <p className="mb-3 text-sm text-slate-500" role="status">
          Updating products...
        </p>
      )}
      {error && (
        <p className="mb-3 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {error}. Showing the most recently loaded products.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.price}
            ratings={product.ratings}
            NumOfReviews={product.NumOfReviews}
            imageUrl={product.images?.[0]?.url || "https://via.placeholder.com/400x300"}
            category={product.category}
            description={product.description}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
