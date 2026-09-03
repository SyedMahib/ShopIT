import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface SaleSectionProps {
  heading?: string;
  description?: string;
  initialCountdown?: number;
  ctaLabel?: string;
  ctaLink?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const SaleSection = ({
  heading = "Make room for your next upgrade.",
  description = "Explore selected components, accessories, and essentials with special savings for a limited time.",
  initialCountdown = 60 * 60 * 3 + 14 * 60 + 22,
  ctaLabel = "Shop the sale",
  ctaLink = "/shop",
  imageUrl = "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=85",
  imageAlt = "Modern PC setup",
}: SaleSectionProps) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialCountdown);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const hours = String(Math.floor(secondsRemaining / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, "0");
  const seconds = String(secondsRemaining % 60).padStart(2, "0");

  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full bg-rose-400/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
            Limited-time savings
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            {description}
          </p>
          <div className="mt-7">
            <p className="mb-3 text-sm font-medium text-slate-300">Offer ends in</p>
            <div 
              className="flex items-center gap-2" 
              aria-label={`Sale ends in ${hours} hours, ${minutes} minutes and ${seconds} seconds`}
            >
              {[hours, minutes, seconds].map((value, index) => (
                <span 
                  key={`${value}-${index}`} 
                  className="rounded-lg bg-white/10 px-3 py-2 font-mono text-base font-semibold text-white backdrop-blur-sm sm:text-lg"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
          <Link 
            to={ctaLink} 
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          <img
            src={imageUrl}
            alt={imageAlt}
            width={1000}
            height={700}
            loading="lazy"
            className="aspect-4/3 w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default SaleSection;
