import { Link, Navigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Banknote, CreditCard, Lock, MapPin } from "lucide-react";
import defaultProductImage from "../assets/default_product.png";
import { calcOrderPrices, clearCart } from "../store/cartSlice";
import { useCreateCheckoutSessionMutation, useCreateOrderMutation } from "../store/ordersApi";
import type { Order } from "../store/ordersApi";
import type { RootState } from "../store";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import OrderSummary from "../components/checkout/OrderSummary";

const paymentOptions = [
  {
    value: "COD",
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives.",
    icon: Banknote,
  },
  {
    value: "Card",
    label: "Credit / debit card",
    description: "Pay securely with Stripe. Your card details never touch our servers.",
    icon: CreditCard,
  },
] as const;

export default function ConfirmOrderPage() {
  const dispatch = useDispatch();
  const { items, shippingInfo } = useSelector((state: RootState) => state.cart);
  const [createOrder, { isLoading: isPlacing }] = useCreateOrderMutation();
  const [createCheckoutSession, { isLoading: isStartingPayment }] = useCreateCheckoutSessionMutation();
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("COD");
  const [errorMessage, setErrorMessage] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [redirectingToPayment, setRedirectingToPayment] = useState(false);
  const isLoading = isPlacing || isStartingPayment || redirectingToPayment;

  // Once the cart is cleared after placing the order, go to the order page (or
  // stay put while the browser leaves for Stripe) instead of falling into the
  // empty-cart redirect below.
  if (redirectingToPayment) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Lock className="mx-auto h-8 w-8 animate-pulse text-blue-600" />
        <p className="mt-4 text-slate-600">Taking you to secure payment...</p>
      </div>
    );
  }
  if (placedOrderId) {
    return (
      <Navigate
        to="/dashboard/orders/$orderId"
        params={{ orderId: placedOrderId }}
        search={paymentMethod === "COD" ? { success: true } : {}}
      />
    );
  }
  if (items.length === 0) return <Navigate to="/cart" />;
  if (!shippingInfo) return <Navigate to="/shipping" />;

  const prices = calcOrderPrices(items);

  const handlePlaceOrder = async () => {
    setErrorMessage("");
    try {
      const { order } = await createOrder({
        orderItems: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingInfo,
        paymentMethod,
      }).unwrap();

      if (paymentMethod === "Card") {
        try {
          const { url } = await createCheckoutSession(order._id).unwrap();
          setRedirectingToPayment(true);
          dispatch(clearCart());
          window.location.assign(url);
          return;
        } catch {
          // The order exists and holds its stock; it can be paid from the order page
        }
      }

      setPlacedOrderId(order._id);
      dispatch(clearCart());
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setErrorMessage(message || "Could not place your order. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutSteps current={2} />
      <h1 className="mt-8 text-2xl font-bold text-slate-900 sm:text-3xl">Confirm Order</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <MapPin className="h-5 w-5 text-blue-600" /> Shipping to
              </h2>
              <Link to="/shipping" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Edit
              </Link>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              {shippingInfo.address}, {shippingInfo.city} {shippingInfo.zipCode}, {shippingInfo.country}
            </p>
            <p className="mt-1 text-sm text-slate-500">Phone: {shippingInfo.phoneNo}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CreditCard className="h-5 w-5 text-blue-600" /> Payment
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentOptions.map(({ value, label, description, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    paymentMethod === value
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                    className="mt-1 accent-blue-600"
                  />
                  <span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Icon className="h-4 w-4 text-slate-500" /> {label}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">{description}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Items</h2>
              <Link to="/cart" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Edit
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.product} className="flex items-center gap-4 py-3">
                  <img
                    src={item.image || defaultProductImage}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-lg bg-slate-50 object-contain p-1"
                  />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{item.name}</p>
                  <p className="shrink-0 text-sm text-slate-600">
                    {item.quantity} × ${item.price.toFixed(2)} ={" "}
                    <span className="font-semibold text-slate-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <OrderSummary prices={prices}>
          {errorMessage && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{errorMessage}</div>
          )}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
          >
            {paymentMethod === "Card"
              ? isLoading ? "Starting payment..." : "Continue to payment"
              : isLoading ? "Placing order..." : "Place order"}
          </button>
        </OrderSummary>
      </div>
    </div>
  );
}
