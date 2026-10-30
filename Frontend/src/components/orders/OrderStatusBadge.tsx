import { statusConfig } from "./orderStatus";
import type { OrderStatus } from "../../store/ordersApi";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] ?? statusConfig.Processing;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.color}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}
