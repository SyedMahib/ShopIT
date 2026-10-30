import { Link, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, CreditCard, MapPin, User } from "lucide-react";
import defaultProductImage from "../assets/default_product.png";
import orderSuccessImage from "../assets/order_success.png";
import { useCancelOrderMutation, useGetOrderDetailsQuery } from "../store/ordersApi";
import type { OrderStatus } from "../store/ordersApi";
import { useUpdateOrderStatusMutation } from "../store/adminApi";
import type { RootState } from "../store";
import OrderSummary from "../components/checkout/OrderSummary";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import { nextStatuses } from "../components/orders/orderStatus";

function errorMessage(err: unknown, fallback: string) {
  return (err as { data?: { message?: string } })?.data?.message || fallback;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrderDetailsPage() {
  const { orderId } = useParams({ from: "/protected/dashboard/orders/$orderId" });
  const { success } = useSearch({ from: "/protected/dashboard/orders/$orderId" });
  const { data, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [actionError, setActionError] = useState("");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-56 rounded bg-slate-200" />
        <div className="mt-8 h-64 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
        <p className="mt-3 text-slate-600">We couldn't find this order in your account.</p>
        <Link
          to="/dashboard"
          className="mt-7 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const order = data.order;
  const isAdmin = currentUser?.role === "admin";
  const customer = typeof order.user === "object" ? order.user : undefined;
  const isOwner = customer?._id === currentUser?._id;
  const canCancel = isOwner && order.orderStatus === "Processing";
  const adminNext = isAdmin ? nextStatuses[order.orderStatus] : [];

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order? This can't be undone.")) return;
    setActionError("");
    try {
      await cancelOrder(order._id).unwrap();
    } catch (err) {
      setActionError(errorMessage(err, "Could not cancel the order."));
    }
  };

  const handleStatusChange = async (status: OrderStatus) => {
    if (status === "Cancelled" && !window.confirm("Cancel this order and return its items to stock?")) return;
    setActionError("");
    try {
      await updateOrderStatus({ id: order._id, status }).unwrap();
      refetch();
    } catch (err) {
      setActionError(errorMessage(err, "Could not update the order."));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {isAdmin && !isOwner ? (
        <Link
          to="/admin/orders"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-4 w-4" /> Back to all orders
        </Link>
      ) : (
        <Link
          to="/dashboard/orders"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-4 w-4" /> Back to my orders
        </Link>
      )}

      {success && (
        <div className="mb-8 flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <img src={orderSuccessImage} alt="" className="h-24 w-24 object-contain" />
          <h2 className="mt-3 text-xl font-bold text-emerald-800">Thank you! Your order has been placed.</h2>
          <p className="mt-1 text-sm text-emerald-700">You'll pay in cash when it's delivered.</p>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="mt-1 text-slate-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <OrderStatusBadge status={order.orderStatus} />
          {order.orderStatus === "Delivered" && order.deliveredAt && (
            <p className="mt-1 text-xs text-slate-500">Delivered {formatDate(order.deliveredAt)}</p>
          )}
          {order.orderStatus === "Cancelled" && order.cancelledAt && (
            <p className="mt-1 text-xs text-slate-500">Cancelled {formatDate(order.cancelledAt)}</p>
          )}
        </div>
      </div>

      {(canCancel || adminNext.length > 0) && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {adminNext.length > 0 && (
            <>
              <span className="text-sm font-medium text-slate-700">Admin: move order to</span>
              {adminNext.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
                    status === "Cancelled"
                      ? "border border-red-200 text-red-600 hover:bg-red-50"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {status === "Cancelled" ? "Cancel order" : `Mark as ${status}`}
                </button>
              ))}
            </>
          )}
          {canCancel && !isAdmin && (
            <>
              <span className="text-sm text-slate-600">Changed your mind? You can cancel until the order ships.</span>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancel}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Cancel order"}
              </button>
            </>
          )}
          {actionError && <p className="w-full text-sm text-red-600">{actionError}</p>}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Items</h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {order.orderItems.map((item) => (
                <li key={item.product} className="flex items-center gap-4 py-3">
                  <img
                    src={item.image || defaultProductImage}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-lg bg-slate-50 object-contain p-1"
                  />
                  <Link
                    to="/products/$productId"
                    params={{ productId: item.product }}
                    className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                  <p className="shrink-0 text-sm text-slate-600">
                    {item.quantity} × ${Number(item.price).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {isAdmin && customer && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <User className="h-5 w-5 text-blue-600" /> Customer
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-800">{customer.name}</p>
              <p className="text-sm text-slate-500">{customer.email}</p>
            </section>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <MapPin className="h-5 w-5 text-blue-600" /> Shipping
              </h2>
              <p className="mt-3 text-sm text-slate-700">
                {order.shippingInfo.address}, {order.shippingInfo.city} {order.shippingInfo.zipCode},{" "}
                {order.shippingInfo.country}
              </p>
              <p className="mt-1 text-sm text-slate-500">Phone: {order.shippingInfo.phoneNo}</p>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <CreditCard className="h-5 w-5 text-blue-600" /> Payment
              </h2>
              <p className="mt-3 text-sm text-slate-700">
                {order.paymentMethod === "COD" ? "Cash on delivery" : "Card"}
              </p>
            </section>
          </div>
        </div>

        <OrderSummary
          prices={{
            itemsPrice: order.itemsPrice,
            shippingAmount: order.shippingAmount,
            taxAmount: order.taxAmount,
            totalAmount: order.totalAmount,
          }}
        />
      </div>
    </div>
  );
}
