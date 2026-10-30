import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type ProductsQueryParams = Record<string, any>;

export interface ProductDetails {
  _id: string;
  name: string;
  price: number;
  ratings: number;
  NumOfReviews: number;
  images: { public_id?: string; url: string }[];
  category: string;
  description: string;
  seller: string;
  stock: number;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: { url?: string } } | null;
  rating: number;
  comment: string;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1", credentials: "include" }),
  tagTypes: ["Products", "Reviews"],
  // Retain inactive product queries for five minutes so returning to a view is instant.
  keepUnusedDataFor: 300,
  // Refresh cached data after a minute when a view remounts or its query changes.
  refetchOnMountOrArgChange: 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,
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
      providesTags: [{ type: "Products", id: "LIST" }],
    }),
    getProductById: builder.query<{ product: ProductDetails }, string>({
      query: (productId) => `/products/${productId}`,
      providesTags: (_result, _error, productId) => [{ type: "Products", id: productId }],
    }),
    getProductReviews: builder.query<{ reviews: Review[] }, string>({
      query: (productId) => `/reviews?id=${productId}`,
      providesTags: (_result, _error, productId) => [{ type: "Reviews", id: productId }],
    }),
    canReview: builder.query<{ canReview: boolean }, string>({
      query: (productId) => `/can_review?productId=${productId}`,
      providesTags: (_result, _error, productId) => [{ type: "Reviews", id: productId }],
    }),
    submitReview: builder.mutation<{ success: boolean }, { productId: string; rating: number; comment: string }>({
      query: (body) => ({ url: "/reviews", method: "PUT", body }),
      // New review changes the product's average rating too
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Products", id: productId },
        { type: "Products", id: "LIST" },
      ],
    }),
    deleteReview: builder.mutation<{ success: boolean }, { productId: string; reviewId: string }>({
      query: ({ productId, reviewId }) => ({
        url: `/admin/reviews?productId=${productId}&id=${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Products", id: productId },
        { type: "Products", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductReviewsQuery,
  useCanReviewQuery,
  useSubmitReviewMutation,
  useDeleteReviewMutation,
} = productsApi;

export interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  images: { public_id?: string; url: string }[];
  category: string;
  stock: number;
  ratings: number;
}

export interface WishlistData {
  success: boolean;
  wishlist: {
    _id: string;
    user: string;
    products: WishlistProduct[];
    createdAt: string;
    updatedAt: string;
  };
}

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1", credentials: "include" }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistData, void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation<WishlistData, { productId: string }>({
      query: (body) => ({
        url: "/wishlist/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation<WishlistData, string>({
      query: (productId) => ({
        url: `/wishlist/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } = wishlistApi;
