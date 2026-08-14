import { RotateCcw, SlidersHorizontal, Star, Store, Tag } from "lucide-react";
import { useState } from "react";

export interface Filters {
  minPrice?: string;
  maxPrice?: string;
  categories?: string[];
  sellers?: string[];
  rating?: string;
}

interface Props {
  initial?: Filters;
  onApply: (filters: Filters) => void;
  onReset?: () => void;
}

const availableCategories = ["Electronics", "Headphones", "Accessories", "Cameras", "Food", "Laptops"];
const availableSellers = ["Amazon", "Ebay", "Kauffman's Fruit Farm & Market"];

export default function SidebarFilters({ initial, onApply, onReset }: Props) {
  const [minPrice, setMinPrice] = useState(initial?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initial?.maxPrice || "");
  const [categories, setCategories] = useState<string[]>(initial?.categories || []);
  const [sellers, setSellers] = useState<string[]>(initial?.sellers || []);
  const [rating, setRating] = useState(initial?.rating || "");
  const activeFilterCount = Number(Boolean(minPrice || maxPrice)) + categories.length + sellers.length + Number(Boolean(rating));

  function toggle(list: string[], setList: (value: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function resetFilters() {
    setMinPrice("");
    setMaxPrice("");
    setCategories([]);
    setSellers([]);
    setRating("");
    onReset?.();
  }

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><SlidersHorizontal className="h-4 w-4" /></span>
          <div>
            <h2 className="font-semibold text-slate-900">Filters</h2>
            <p className="text-xs text-slate-500">Refine your results</p>
          </div>
        </div>
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
            {activeFilterCount}
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        <section className="p-5">
          <h3 className="text-sm font-semibold text-slate-900">Price range</h3>
          <p className="mt-1 text-xs text-slate-500">Set your preferred budget.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="relative">
              <span className="sr-only">Minimum price</span>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" min="0" inputMode="decimal" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="relative">
              <span className="sr-only">Maximum price</span>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" min="0" inputMode="decimal" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" />
            </label>
          </div>
        </section>

        <section className="p-5">
          <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-slate-400" /><h3 className="text-sm font-semibold text-slate-900">Category</h3></div>
          <div className="mt-3 space-y-1">
            {availableCategories.map((category) => {
              const checked = categories.includes(category);
              return (
                <label key={category} className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition ${checked ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                  <span>{category}</span>
                  <input type="checkbox" checked={checked} onChange={() => toggle(categories, setCategories, category)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </label>
              );
            })}
          </div>
        </section>

        <section className="p-5">
          <div className="flex items-center gap-2"><Store className="h-4 w-4 text-slate-400" /><h3 className="text-sm font-semibold text-slate-900">Seller</h3></div>
          <div className="mt-3 space-y-1">
            {availableSellers.map((seller) => {
              const checked = sellers.includes(seller);
              return (
                <label key={seller} className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition ${checked ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                  <span className="truncate">{seller}</span>
                  <input type="checkbox" checked={checked} onChange={() => toggle(sellers, setSellers, seller)} className="h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </label>
              );
            })}
          </div>
        </section>

        <section className="p-5">
          <div className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-400" /><h3 className="text-sm font-semibold text-slate-900">Customer rating</h3></div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["4", "3", "2"].map((value) => {
              const selected = rating === value;
              return (
                <button key={value} type="button" onClick={() => setRating(selected ? "" : value)} className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm font-medium transition ${selected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {value}.0 & up
                </button>
              );
            })}
            <button type="button" onClick={() => setRating("")} className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${!rating ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>Any rating</button>
          </div>
        </section>
      </div>

      <div className="flex gap-3 border-t border-slate-200 bg-slate-50 p-4">
        <button type="button" onClick={resetFilters} disabled={activeFilterCount === 0} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <button type="button" onClick={() => onApply({ minPrice, maxPrice, categories, sellers, rating })} className="h-11 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
          Show products
        </button>
      </div>
    </aside>
  );
}
