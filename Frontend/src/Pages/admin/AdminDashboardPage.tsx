import { Link } from "@tanstack/react-router";
import { AlertTriangle, DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { useGetAdminProductsQuery, useGetAllOrdersQuery, useGetAllUsersQuery } from "../../store/adminApi";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import type { OrderStatus } from "../../store/ordersApi";

const LOW_STOCK = 5;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function StatCard({ icon: Icon, label, value, subtext }: { icon: typeof Package; label: string; value: string | number; subtext: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{subtext}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const { data: productsData, isLoading: productsLoading } = useGetAdminProductsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();

  const orders = ordersData?.orders ?? [];
  const products = productsData?.products ?? [];
  const users = usersData?.users ?? [];

  const revenue = orders
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const statusCounts = orders.reduce(
    (acc, o) => ({ ...acc, [o.orderStatus]: (acc[o.orderStatus] ?? 0) + 1 }),
    {} as Partial<Record<OrderStatus, number>>,
  );
  const lowStock = products.filter((p) => p.stock <= LOW_STOCK).sort((a, b) => a.stock - b.stock);

  if (ordersLoading || productsLoading || usersLoading) {
    return (
      <div className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Store Overview</h1>
      <p className="mt-1 text-slate-500">Everything happening in your shop</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(revenue)} subtext="Excludes cancelled orders" />
        <StatCard icon={ShoppingBag} label="Orders" value={orders.length} subtext={`${statusCounts.Processing ?? 0} waiting to ship`} />
        <StatCard icon={Package} label="Products" value={products.length} subtext={`${lowStock.length} low on stock`} />
        <StatCard icon={Users} label="Users" value={users.length} subtext={`${users.filter((u) => u.role === "admin").length} admin(s)`} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Latest orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {orders.slice(0, 6).map((order) => (
                <li key={order._id}>
                  <Link
                    to="/dashboard/orders/$orderId"
                    params={{ orderId: order._id }}
                    className="flex items-center justify-between gap-4 py-3 hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">
                        #{order._id.slice(-6).toUpperCase()}{" "}
                        <span className="font-normal text-slate-500">
                          · {typeof order.user === "object" ? order.user.name : "Deleted user"}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <OrderStatusBadge status={order.orderStatus} />
                      <span className="w-20 text-right text-sm font-semibold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Low stock
          </h2>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">All products have more than {LOW_STOCK} in stock.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lowStock.slice(0, 8).map((p) => (
                <li key={p._id} className="flex items-center justify-between gap-3 text-sm">
                  <Link
                    to="/admin/products/$productId/edit"
                    params={{ productId: p._id }}
                    className="truncate text-slate-700 hover:text-blue-600"
                  >
                    {p.name}
                  </Link>
                  <span className={`shrink-0 font-semibold ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}>
                    {p.stock === 0 ? "Out" : p.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
