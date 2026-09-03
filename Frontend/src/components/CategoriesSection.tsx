import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface Category {
  name: string;
  description: string;
  icon: "laptop" | "cpu" | "headphones" | "camera" | "package-check" | "sparkles";
  tone: string;
}

export interface CategoriesSectionProps {
  categories?: Category[];
  heading?: string;
  subheading?: string;
  linkTo?: string;
}

const defaultCategories: Category[] = [
  { name: "Laptops", description: "Power for every day", icon: "laptop", tone: "bg-violet-50 text-violet-600" },
  { name: "Electronics", description: "Smart essentials", icon: "cpu", tone: "bg-blue-50 text-blue-600" },
  { name: "Headphones", description: "Sound made personal", icon: "headphones", tone: "bg-rose-50 text-rose-600" },
  { name: "Cameras", description: "Capture every detail", icon: "camera", tone: "bg-amber-50 text-amber-600" },
  { name: "Accessories", description: "Complete your setup", icon: "package-check", tone: "bg-emerald-50 text-emerald-600" },
  { name: "Food", description: "Everyday favourites", icon: "sparkles", tone: "bg-orange-50 text-orange-600" },
];

const iconMap = {
  laptop: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect width="20" height="14" x="2" y="3" rx="2"/>
      <line x1="2" x2="22" y1="20" y2="20"/>
    </svg>
  ),
  cpu: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect width="16" height="16" x="4" y="4" rx="2"/>
      <rect width="6" height="6" x="9" y="9" rx="1"/>
      <path d="M15 2v2"/>
      <path d="M15 20v2"/>
      <path d="M2 15h2"/>
      <path d="M2 9h2"/>
      <path d="M20 15h2"/>
      <path d="M20 9h2"/>
      <path d="M9 2v2"/>
      <path d="M9 20v2"/>
      <path d="M20 2v2"/>
      <path d="M20 20v2"/>
      <path d="M4 2H2"/>
      <path d="M4 22H2"/>
      <path d="M22 4h-2"/>
      <path d="M22 20h-2"/>
    </svg>
  ),
  headphones: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 14v-3a9 9 0 0 1 18 0v3"/>
      <path d="M3 14h5v7H3z"/>
      <path d="M16 14h5v7h-5z"/>
    </svg>
  ),
  camera: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  ),
  "package-check": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  ),
  sparkles: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/>
      <path d="M22 5h-4"/>
      <path d="M4 17v2"/>
      <path d="M5 18H3"/>
    </svg>
  ),
};

const CategoriesSection = ({
  categories = defaultCategories,
  heading = "Find your next favourite",
  subheading = "Start with a category, then refine the details in the shop.",
  linkTo = "/shop",
}: CategoriesSectionProps) => {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Browse with ease</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{heading}</h2>
            <p className="mt-3 max-w-xl text-slate-600">{subheading}</p>
          </div>
          <Link to={linkTo} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700">
            View everything <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={linkTo}
              search={{ category: category.name }}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${category.tone}`}>
                {iconMap[category.icon]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900">{category.name}</span>
                <span className="mt-1 block text-sm text-slate-500">{category.description}</span>
              </span>
              <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
