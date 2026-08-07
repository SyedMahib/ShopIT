import React, { useState } from "react";

interface Filters {
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

  function toggle(list: string[], setList: (v: string[]) => void, val: string) {
    if (list.includes(val)) setList(list.filter((x) => x !== val));
    else setList([...list, val]);
  }

  return (
    <aside className="w-full">
      <div className="space-y-6">
        <div>
          <h4 className="mb-2 text-sm font-semibold">PRICE RANGE</h4>
          <div className="flex gap-2">
            <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-1/2 rounded border px-2 py-1" />
            <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-1/2 rounded border px-2 py-1" />
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Category</h4>
          <div className="space-y-2">
            {availableCategories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={categories.includes(category)} onChange={() => toggle(categories, setCategories, category)} />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Seller</h4>
          <div className="space-y-2">
            {availableSellers.map((seller) => (
              <label key={seller} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={sellers.includes(seller)} onChange={() => toggle(sellers, setSellers, seller)} />
                {seller}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">RATING</h4>
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full rounded border px-2 py-1 text-sm">
            <option value="">Any</option>
            <option value="4">4 & up</option>
            <option value="3">3 & up</option>
            <option value="2">2 & up</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onApply({ minPrice, maxPrice, categories, sellers, rating })}
            className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setCategories([]);
              setSellers([]);
              setRating("");
              onReset && onReset();
            }}
            className="rounded border px-3 py-2 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}
