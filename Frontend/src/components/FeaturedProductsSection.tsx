import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import Products from "./Products";

export interface FeaturedProductsSectionProps {
  perPage?: number;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  filterParams?: Record<string, string>;
}

const FeaturedProductsSection = ({
  perPage = 4,
  subheading = "A few dependable choices customers keep coming back to.",
  ctaText = "Shop all products",
  ctaLink = "/shop",
  filterParams,
}: FeaturedProductsSectionProps) => {
  return (
    <section id="featured" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Customer favourites</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Popular right now</h2>
            <p className="mt-3 text-slate-600">{subheading}</p>
          </div>
          <Link to={ctaLink} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            {ctaText} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Products perPage={perPage} params={filterParams} />
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
