import { Clock, PackageCheck, Truck, XCircle } from "lucide-react";
import type { Order, OrderStatus } from "../../store/ordersApi";

export const statusConfig: Record<OrderStatus, { color: string; bg: string; icon: typeof Clock }> = {
  Processing: {
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
  },
  Shipped: {
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Truck,
  },
  Delivered: {
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: PackageCheck,
  },
  Cancelled: {
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
    icon: XCircle,
  },
};

// Next statuses an admin can move an order to (mirrors the backend rules)
export const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

// A card order whose payment hasn't gone through yet (it can't ship until it's paid)
export const isAwaitingPayment = (order: Order) =>
  order.paymentMethod === "Card" && order.paymentInfo?.status === "unpaid" && order.orderStatus === "Processing";
