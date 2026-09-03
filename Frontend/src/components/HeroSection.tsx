import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface HeroSectionProps {
  tagline?: string;
  heading?: string;
  highlightText?: string;
  description?: string;
  imageAlt?: string;
  imageUrl?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  trustItems?: Array<{ icon?: string; text: string }>;
}

const HeroSection = ({
  tagline = "Technology selected for real life",
  heading = "Find the gear that",
  highlightText = "fits your flow.",
  description = "Thoughtful technology and everyday essentials—easy to explore, simple to choose, and ready for what's next.",
  imageAlt = "Modern laptop on a desk",
  imageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85",
  ctaPrimaryLabel = "Explore products",
  ctaPrimaryLink = "/shop",
  ctaSecondaryLabel = "See what's popular",
  ctaSecondaryHref = "#featured",
  trustItems = [
    { text: "Curated selection" },
    { text: "Secure shopping" },
    { text: "Helpful support" },
  ],
}: HeroSectionProps) => {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.18),transparent_28%)]" />
      <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full border border-white/10" />
      <div className="absolute -right-12 top-1/3 h-56 w-56 rounded-full border border-white/10" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        {/* Left content */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
            <Sparkles className="h-3.5 w-3.5" />
            {tagline}
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {heading} <span className="text-blue-300">{highlightText}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={ctaPrimaryLink}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500"
            >
              {ctaPrimaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            {ctaSecondaryHref && (
              <a
                href={ctaSecondaryHref}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {ctaSecondaryLabel}
              </a>
            )}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm text-slate-300">
            {trustItems.map((item) => (
              <span key={item.text} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-300" />
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-4 rounded-4xl bg-blue-500/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-4xl border border-white/15 bg-slate-800 shadow-2xl shadow-black/30">
            <img
              src={imageUrl}
              alt={imageAlt}
              width={1200}
              height={800}
              className="aspect-4/3 w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-200">
                  Built for every day
                </p>
                <p className="mt-1 text-lg font-semibold">Work. Create. Play.</p>
              </div>
              <Link
                to={ctaPrimaryLink}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-slate-900 transition hover:bg-blue-100"
                aria-label="Browse products"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl sm:block">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold">Highly rated picks</p>
                <p className="text-xs text-slate-500">Chosen by customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
