import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import defaultProductImage from "../../assets/default_product.png";
import { useDeleteProductMutation, useGetAdminProductsQuery } from "../../store/adminApi";
import { productsApi } from "../../store/productsApi";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetAdminProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const products = data?.products ?? [];
  const term = search.trim().toLowerCase();
  const visible = term
    ? products.filter((p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
    : products;

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setBusyId(id);
    setError("");
    try {
      await deleteProduct(id).unwrap();
      dispatch(productsApi.util.invalidateTags([{ type: "Products", id: "LIST" }]));
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message || "Could not delete the product.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Products</h1>
          <p className="mt-1 text-slate-500">{products.length} products in the catalogue</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or category"
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading products...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-red-600">Could not load products.</td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No products found.</td>
              </tr>
            ) : (
              visible.map((p) => (
                <tr key={p._id} className={busyId === p._id ? "opacity-50" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]?.url || defaultProductImage}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultProductImage;
                        }}
                      />
                      <Link
                        to="/products/$productId"
                        params={{ productId: p._id }}
                        className="line-clamp-2 max-w-xs font-medium text-slate-800 hover:text-blue-600"
                      >
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">${p.price.toFixed(2)}</td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      p.stock === 0 ? "text-red-600" : p.stock <= 5 ? "text-amber-600" : "text-slate-700"
                    }`}
                  >
                    {p.stock}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/admin/products/$productId/edit"
                        params={{ productId: p._id }}
                        aria-label={`Edit ${p.name}`}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === p._id}
                        onClick={() => handleDelete(p._id, p.name)}
                        aria-label={`Delete ${p.name}`}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
