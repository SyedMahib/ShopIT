import { Navigate, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../store/cartSlice";
import type { ShippingInfo } from "../store/ordersApi";
import type { RootState } from "../store";
import CheckoutSteps from "../components/checkout/CheckoutSteps";

const fields: { name: keyof ShippingInfo; label: string; type: string; autoComplete: string }[] = [
  { name: "address", label: "Address", type: "text", autoComplete: "street-address" },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2" },
  { name: "phoneNo", label: "Phone Number", type: "tel", autoComplete: "tel" },
  { name: "zipCode", label: "Zip Code", type: "text", autoComplete: "postal-code" },
  { name: "country", label: "Country", type: "text", autoComplete: "country-name" },
];

export default function ShippingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, shippingInfo } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) return <Navigate to="/cart" />;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const info = Object.fromEntries(
      fields.map((f) => [f.name, String(formData.get(f.name) ?? "").trim()]),
    ) as unknown as ShippingInfo;

    dispatch(saveShippingInfo(info));
    navigate({ to: "/checkout/confirm" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <CheckoutSteps current={1} />
      <h1 className="mt-8 text-2xl font-bold text-slate-900">Shipping Information</h1>
      <p className="mt-1 text-slate-500">Where should we deliver your order?</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm font-medium text-slate-700">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required
              defaultValue={shippingInfo?.[f.name] ?? ""}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
