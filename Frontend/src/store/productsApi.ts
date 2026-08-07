import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type ProductsQueryParams = Record<string, any>;

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  endpoints: (builder) => ({
    getProducts: builder.query<{
      success?: boolean;
      products: any[];
      productCount?: number;
      resPerPage?: number;
      filteredProductsCount?: number;
    }, ProductsQueryParams | void>({
      query: (params) => {
        if (!params) return "/products";
        const qp = new URLSearchParams();
        // allow arbitrary keys (including bracketed keys) in params
        Object.entries(params).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          qp.set(k, String(v));
        });
        const q = qp.toString();
        return `/products${q ? "?" + q : ""}`;
      },
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
