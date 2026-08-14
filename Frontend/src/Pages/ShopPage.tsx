import { useMemo, useState } from "react";
import { X } from "lucide-react";
import SidebarFilters from "../components/shop/SidebarFilters";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import { useGetProductsQuery } from "../store/productsApi";

const ShopPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const perPage = 8;

  const queryArg = useMemo(() => {
    const q: Record<string, any> = { page, limit: perPage };
    if (filters.minPrice) q["price[gte]"] = filters.minPrice;
    if (filters.maxPrice) q["price[lte]"] = filters.maxPrice;
    if (filters.categories && filters.categories.length) q.category = filters.categories.join(",");
    if (filters.sellers && filters.sellers.length) q.seller = filters.sellers.join(",");
    if (filters.rating) q["ratings[gte]"] = filters.rating;
    if (filters.sort) q.sort = filters.sort;
    return q;
  }, [filters, page]);

  const { data, isLoading, error, isFetching } = useGetProductsQuery(queryArg);
  const products = data?.products || [];
  const total = data?.filteredProductsCount ?? data?.productCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="hidden lg:block lg:col-span-1">
          <SidebarFilters
            initial={{}}
            onApply={(f) => {
              setFilters(f as any);
              setPage(1);
            }}
            onReset={() => {
              setFilters({});
              setPage(1);
            }}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Shop Products</h1>
              <p className="text-sm text-slate-500">Browse products by category, seller, price, and rating.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="sm:hidden inline-flex items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
                Filters
              </button>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">Sort:</label>
                <select
                  value={filters.sort || ""}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                  className="rounded border px-3 py-2 text-sm"
                >
                  <option value="">Featured</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="ratings">Rating</option>
                  <option value="latest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {showMobileFilters ? (
            <div className="fixed inset-0 z-50 flex items-stretch">
              <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowMobileFilters(false)} />
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-2xl sm:max-w-sm">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-slate-100 text-slate-700"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="pt-10">
                  <h2 className="mb-4 text-xl font-semibold">Filters</h2>
                  <SidebarFilters
                    initial={{}}
                    onApply={(f) => {
                      setFilters(f as any);
                      setPage(1);
                      setShowMobileFilters(false);
                    }}
                    onReset={() => {
                      setFilters({});
                      setPage(1);
                      setShowMobileFilters(false);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <ProductGrid
            products={products}
            loading={isLoading && !data}
            refreshing={isFetching && Boolean(data)}
            skeletonCount={perPage}
            error={(error as any)?.data?.message || (error as any)?.error || null}
          />

          <div className="mt-6">
            <Pagination current={page} total={totalPages} onChange={(p) => setPage(p)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
