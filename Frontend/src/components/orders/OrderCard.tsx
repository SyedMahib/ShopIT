import { Link } from "@tanstack/react-router";
import { ChevronRight, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import type { Order } from "../../store/ordersApi";
import { isAwaitingPayment, statusConfig } from "./orderStatus";

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

export default function OrderCard({ order }: { order: Order }) {
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
            {isAwaitingPayment(order) && <AwaitingPaymentTag />}
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

export function AwaitingPaymentTag() {
  return (
    <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700">
      Awaiting payment
    </span>
  );
}

export function EmptyOrders() {
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
