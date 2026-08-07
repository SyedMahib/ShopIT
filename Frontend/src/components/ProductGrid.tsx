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
  error: string | null;
}

function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-slate-700 shadow-sm">
        Loading products...
      </div>
    );
  }

  if (error) {
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
  );
}

export default ProductGrid;
