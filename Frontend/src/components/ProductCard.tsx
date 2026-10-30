import { ShoppingCart, Star, Heart } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { useAddToWishlistMutation } from "../store/productsApi";
import type { RootState } from "../store";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  ratings: number;
  NumOfReviews: number;
  imageUrl: string;
  category: string;
  description?: string;
}

function formatPrice(price: number) {
  return `$${price.toFixed(0)}`;
}

function ProductCard({
  id,
  name,
  price,
  ratings,
  NumOfReviews,
  imageUrl,
  category,
  description,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [addToWishlist] = useAddToWishlistMutation();

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    
    await addToWishlist({ productId: id }).unwrap();
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg">
      <img src={imageUrl} alt={name} className="h-48 w-full object-contain" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
          <span>{ratings.toFixed(1)}</span>
          <span>({NumOfReviews})</span>
          <span className="truncate">{category}</span>
        </div>
        <Link
          to="/products/$productId"
          params={{ productId: id }}
          className="mt-3 text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600"
        >
          {name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{description || "Quality product for your next build."}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-base font-bold text-slate-900">{formatPrice(price)}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Add ${name} to wishlist`}
              onClick={handleWishlistClick}
              className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Add ${name} to cart`}
              className="grid h-9 w-9 place-items-center rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-500"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
