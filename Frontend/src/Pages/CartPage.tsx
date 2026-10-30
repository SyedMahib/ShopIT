import { Link, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import defaultProductImage from "../assets/default_product.png";
import { calcOrderPrices, removeFromCart, updateQuantity } from "../store/cartSlice";
import type { RootState } from "../store";
import OrderSummary from "../components/checkout/OrderSummary";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.cart.items);
  const prices = calcOrderPrices(items);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <ShoppingBag className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Browse the shop and add something you like.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Shopping Cart</h1>
      <p className="mt-1 text-slate-500">
        {itemCount} item{itemCount > 1 ? "s" : ""} in your cart
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li
              key={item.product}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <img
                src={item.image || defaultProductImage}
                alt={item.name}
                className="h-24 w-24 shrink-0 rounded-xl bg-slate-50 object-contain p-2"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultProductImage;
                }}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <Link
                    to="/products/$productId"
                    params={{ productId: item.product }}
                    className="font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                  <p className="shrink-0 font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-slate-500">${item.price.toFixed(2)} each</p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex h-9 items-center rounded-lg border border-slate-300">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(updateQuantity({ product: item.product, quantity: item.quantity - 1 }))
                      }
                      disabled={item.quantity <= 1}
                      className="grid h-full w-9 place-items-center text-slate-600 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(updateQuantity({ product: item.product, quantity: item.quantity + 1 }))
                      }
                      disabled={item.quantity >= item.stock}
                      className="grid h-full w-9 place-items-center text-slate-600 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(item.product))}
                    className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <OrderSummary prices={prices}>
          <button
            type="button"
            onClick={() => navigate({ to: "/shipping" })}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Proceed to checkout
          </button>
          <Link
            to="/shop"
            className="mt-3 block text-center text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Continue shopping
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}
