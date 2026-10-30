import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteOrderMutation, useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "../../store/adminApi";
import type { OrderStatus } from "../../store/ordersApi";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import { nextStatuses } from "../../components/orders/orderStatus";

const filters: ("All" | OrderStatus)[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { data, isLoading, isError } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const orders = data?.orders ?? [];
  const visible = filter === "All" ? orders : orders.filter((o) => o.orderStatus === filter);

  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setError("");
    try {
      await action();
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message || "Something went wrong.");
    } finally {
      setBusyId("");
    }
  };

  const handleStatus = (id: string, status: OrderStatus) => {
    if (status === "Cancelled" && !window.confirm("Cancel this order and return its items to stock?")) return;
    run(id, () => updateOrderStatus({ id, status }).unwrap());
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this order permanently? Unshipped items go back to stock.")) return;
    run(id, () => deleteOrder(id).unwrap());
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Orders</h1>
      <p className="mt-1 text-slate-500">{orders.length} orders in total</p>

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

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading orders...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-red-600">Could not load orders.</td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No orders here.</td>
              </tr>
            ) : (
              visible.map((order) => {
                const customer = typeof order.user === "object" ? order.user : undefined;
                const busy = busyId === order._id;
                return (
                  <tr key={order._id} className={busy ? "opacity-50" : ""}>
                    <td className="px-4 py-3">
                      <Link
                        to="/dashboard/orders/$orderId"
                        params={{ orderId: order._id }}
                        className="font-mono font-medium text-blue-600 hover:text-blue-700"
                      >
                        #{order._id.slice(-6).toUpperCase()}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {order.orderItems.reduce((s, i) => s + i.quantity, 0)} item(s) · {order.paymentMethod}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800">{customer?.name ?? "Deleted user"}</p>
                      <p className="text-xs text-slate-500">{customer?.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {nextStatuses[order.orderStatus].map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={busy}
                            onClick={() => handleStatus(order._id, status)}
                            className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                              status === "Cancelled"
                                ? "border border-red-200 text-red-600 hover:bg-red-50"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                          >
                            {status === "Cancelled" ? "Cancel" : `Mark ${status}`}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDelete(order._id)}
                          aria-label="Delete order"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
