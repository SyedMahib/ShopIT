import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useGetMyOrdersQuery } from "../store/ordersApi";
import type { OrderStatus } from "../store/ordersApi";
import OrderCard, { EmptyOrders } from "../components/orders/OrderCard";

const filters: ("All" | OrderStatus)[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function MyOrdersPage() {
  const { data, isLoading, isError, refetch } = useGetMyOrdersQuery();
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");

  const orders = data?.orders ?? [];
  const visible = filter === "All" ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ChevronLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Orders</h1>
      <p className="mt-1 text-slate-500">
        {orders.length} order{orders.length !== 1 ? "s" : ""} placed
      </p>

      {orders.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = f === "All" ? orders.length : orders.filter((o) => o.orderStatus === f).length;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
          ))
        ) : isError ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center">
            <p className="text-slate-600">We couldn&apos;t load your orders.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">No {filter.toLowerCase()} orders.</p>
        ) : (
          visible.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
}
