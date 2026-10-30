import type { ReactNode } from "react";

interface OrderSummaryProps {
  prices: {
    itemsPrice: number;
    shippingAmount: number;
    taxAmount: number;
    totalAmount: number;
  };
  children?: ReactNode;
}

export default function OrderSummary({ prices, children }: OrderSummaryProps) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Subtotal</dt>
          <dd className="font-medium text-slate-900">${prices.itemsPrice.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Shipping</dt>
          <dd className="font-medium text-slate-900">
            {prices.shippingAmount === 0 ? "Free" : `$${prices.shippingAmount.toFixed(2)}`}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Tax (15%)</dt>
          <dd className="font-medium text-slate-900">${prices.taxAmount.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
          <dt className="font-semibold text-slate-900">Total</dt>
          <dd className="font-bold text-slate-900">${prices.totalAmount.toFixed(2)}</dd>
        </div>
      </dl>
      {children}
    </aside>
  );
}
