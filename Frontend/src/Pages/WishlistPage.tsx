import { useSelector } from "react-redux";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Trash2, ShoppingBag, AlertCircle } from "lucide-react";
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "../store/productsApi";
import type { RootState } from "../store";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isError } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

  if (isError) {
    navigate({ to: "/login" });
    return null;
  }

  const wishlist = data?.wishlist;
  const products = wishlist?.products ?? [];

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId).unwrap();
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
          <p className="mt-1 text-slate-500">
            {products.length} item{products.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Heart className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-700">Your wishlist is empty</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Start adding products you love to your wishlist.
          </p>
          <button
            onClick={() => navigate({ to: "/shop" })}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => handleRemove(product._id)}
                disabled={isRemoving}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                title="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-100">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="h-10 w-10 text-slate-300" />
                )}
              </div>

              <div className="mt-4">
                <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
                <p className="mt-1 text-xs text-slate-500">{product.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">${product.price}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">★</span>
                    <span className="text-xs font-medium text-slate-700">{product.ratings}</span>
                  </div>
                </div>
                {product.stock === 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    Out of stock
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
