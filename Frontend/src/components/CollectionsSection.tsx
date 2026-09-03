import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface CollectionCard {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  searchParams?: Record<string, string>;
  imageUrl: string;
  imageAlt: string;
}

export interface CollectionsSectionProps {
  collections?: CollectionCard[];
}

const defaultCollections: CollectionCard[] = [
  {
    title: "Create your best workspace",
    subtitle: "Made for momentum",
    description: "Reliable laptops and essentials for the work you want to do.",
    link: "/shop",
    searchParams: { category: "Laptops" },
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Workspace technology",
  },
  {
    title: "Small upgrades, big difference",
    subtitle: "Everyday technology",
    description: "Find thoughtful electronics for your home, desk, and daily routine.",
    link: "/shop",
    searchParams: { category: "Electronics" },
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Modern electronics",
  },
];

const CollectionsSection = ({
  collections = defaultCollections,
}: CollectionsSectionProps) => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              to={collection.link}
              search={collection.searchParams}
              className="group relative min-h-80 overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:p-9"
            >
              <img
                src={collection.imageUrl}
                alt={collection.imageAlt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="relative flex h-full max-w-sm flex-col justify-end">
                <p className="text-sm font-semibold text-blue-200">{collection.subtitle}</p>
                <h2 className="mt-2 text-2xl font-bold">{collection.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-200">{collection.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  Explore {collection.searchParams?.category?.toLowerCase() ?? "more"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
