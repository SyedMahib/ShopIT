import { ShieldCheck, Truck, PackageCheck } from "lucide-react";

export interface TrustIndicator {
  icon: "shield" | "truck" | "package";
  title: string;
  description: string;
}

const defaultIndicators: TrustIndicator[] = [
  {
    icon: "shield",
    title: "Secure shopping",
    description: "Protected at checkout",
  },
  {
    icon: "truck",
    title: "Reliable delivery",
    description: "Updates every step",
  },
  {
    icon: "package",
    title: "Helpful support",
    description: "Here when you need us",
  },
];

const iconMap = {
  shield: ShieldCheck,
  truck: Truck,
  package: PackageCheck,
};

export interface TrustIndicatorsProps {
  indicators?: TrustIndicator[];
}

const TrustIndicators = ({
  indicators = defaultIndicators,
}: TrustIndicatorsProps) => {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        {indicators.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustIndicators;
