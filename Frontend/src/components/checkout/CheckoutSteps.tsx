import { Check } from "lucide-react";

const steps = ["Cart", "Shipping", "Confirm"];

/** Progress indicator for checkout. `current` is the index of the active step. */
export default function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 text-sm">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                done || active ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <span className={active ? "font-semibold text-slate-900" : "text-slate-500"}>{label}</span>
            {index < steps.length - 1 && <span className="mx-1 h-px w-8 bg-slate-300 sm:w-12" />}
          </li>
        );
      })}
    </ol>
  );
}
