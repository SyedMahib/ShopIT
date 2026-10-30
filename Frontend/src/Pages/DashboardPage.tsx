import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { avatarSrc } from "../utils/avatar";
import defaultAvatar from "../assets/default_avatar.jpg";
import {
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  User,
  Heart,
  Settings,
  Receipt,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import type { RootState } from "../store";
import { useGetMyOrdersQuery } from "../store/ordersApi";
import type { Order } from "../store/ordersApi";
import { statusConfig } from "../components/orders/orderStatus";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OrderCard({ order }: { order: Order }) {
  const status = statusConfig[order.orderStatus] || statusConfig.Processing;
  const StatusIcon = status.icon;
  const itemNames = order.orderItems.map((i) => i.name).join(", ");
  const itemCount = order.orderItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className={`rounded-xl border ${status.bg} p-4 transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">#{order._id.slice(-6).toUpperCase()}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${status.bg} ${status.color}`}
            >
              <StatusIcon className="h-3 w-3" />
              {order.orderStatus}
            </span>
          </div>
          <p className="mt-1 truncate text-sm font-medium text-slate-700">{itemNames}</p>
          <p className="mt-0.5 text-xs text-slate-500">{itemCount} item{itemCount > 1 ? "s" : ""}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-slate-900">{formatCurrency(order.totalAmount)}</p>
          <p className="mt-1 text-xs text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <CreditCard className="h-3 w-3" />
          {order.paymentMethod}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {order.shippingInfo.city}, {order.shippingInfo.country}
        </span>
      </div>
      <Link
        to="/dashboard/orders/$orderId"
        params={{ orderId: order._id }}
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        View Details <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <ShoppingBag className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-700">No orders yet</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Start shopping and your order history will appear here.
      </p>
      <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
        Browse Products
      </Link>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: typeof Package;
  label: string;
  value: string | number;
  subtext: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{subtext}</p>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  description,
  to,
}: {
  icon: typeof User;
  label: string;
  description: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 cursor-pointer"
    >
      <Icon className="h-4 w-4 text-slate-400" />
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </Link>
  );
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { data: ordersData, isLoading } = useGetMyOrdersQuery(undefined, {
    skip: !isAuthenticated,
  });
  const orders = ordersData?.orders ?? [];

  const totalOrders = orders.length;
  const totalSpent = orders
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const processingOrders = orders.filter((o) => o.orderStatus === "Processing").length;
  const shippedOrders = orders.filter((o) => o.orderStatus === "Shipped").length;
  const recentOrders = orders.slice(0, 5);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-slate-500">
            Welcome back,{" "}
            <span className="font-semibold text-slate-700">{user?.name}</span>
          </p>
        </div>
        {user?.avatar?.url ? (
          <img
            src={avatarSrc(user)}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-200"
          />
        ) : (
          <img
            src={defaultAvatar}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-200"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=48`;
            }}
          />
        )}
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          subtext="All time"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Receipt}
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          subtext="Lifetime"
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={Clock}
          label="Processing"
          value={processingOrders}
          subtext="Pending shipment"
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={Truck}
          label="Shipped"
          value={shippedOrders}
          subtext="On the way"
          color="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <span className="text-sm font-medium text-blue-600">View All</span>
          </div>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white" />
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => <OrderCard key={order._id} order={order} />)
            ) : (
              <EmptyOrders />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              {user?.avatar?.url ? (
                <img
                  src={avatarSrc(user)}
                  alt={user.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100"
                />
              ) : (
                <img
                  src={defaultAvatar}
                  alt={user.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=random&size=56`;
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {user?.role || "Customer"}
                </span>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {user?.role === "admin" && (
                <SidebarItem
                  icon={ShieldCheck}
                  label="Admin Panel"
                  description="Manage orders, products & users"
                  to="/admin"
                />
              )}
              <SidebarItem icon={User} label="My Profile" description="Edit your personal info" to="/dashboard/profile" />
              <SidebarItem
                icon={Settings}
                label="Settings"
                description="Password & preferences"
                to="/dashboard/settings"
              />
              <SidebarItem
                icon={Heart}
                label="Wishlist"
                description="Your saved items"
                to="/dashboard/wishlist"
              />
            </div>
          </div>

          {/* Quick Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Support</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>support@shopit.com</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Free shipping on orders over $100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
