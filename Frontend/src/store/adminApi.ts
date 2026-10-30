import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Order, OrderStatus } from "./ordersApi";
import type { ProductDetails } from "./productsApi";
import type { User } from "./authApi";

export const PRODUCT_CATEGORIES = [
  "Laptops",
  "Cameras",
  "Electronics",
  "Accessories",
  "Headphones",
  "Food",
  "Books",
  "Sports",
  "Outdoor",
  "Home",
] as const;

export interface AdminUser extends User {
  createdAt: string;
}

export interface ProductInput {
  name: string;
  price: number;
  description: string;
  category: string;
  seller: string;
  stock: number;
  images: { url: string }[];
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1/admin", credentials: "include" }),
  tagTypes: ["AdminOrders", "AdminProducts", "AdminUsers"],
  endpoints: (builder) => ({
    // Orders
    getAllOrders: builder.query<{ orders: Order[] }, void>({
      query: () => "/orders",
      providesTags: ["AdminOrders"],
    }),
    updateOrderStatus: builder.mutation<{ order: Order }, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({ url: `/orders/${id}`, method: "PUT", body: { status } }),
      // Status changes can move stock, so refresh products too
      invalidatesTags: ["AdminOrders", "AdminProducts"],
    }),
    deleteOrder: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminOrders", "AdminProducts"],
    }),

    // Products
    getAdminProducts: builder.query<{ products: ProductDetails[] }, void>({
      query: () => "/products",
      providesTags: ["AdminProducts"],
    }),
    createProduct: builder.mutation<{ product: ProductDetails }, ProductInput>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["AdminProducts"],
    }),
    updateProduct: builder.mutation<{ product: ProductDetails }, { id: string; body: ProductInput }>({
      query: ({ id, body }) => ({ url: `/products/${id}`, method: "PUT", body }),
      invalidatesTags: ["AdminProducts"],
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminProducts"],
    }),

    // Users
    getAllUsers: builder.query<{ users: AdminUser[] }, void>({
      query: () => "/users",
      providesTags: ["AdminUsers"],
    }),
    updateUser: builder.mutation<{ user: AdminUser }, { id: string; body: Partial<Pick<User, "name" | "email" | "role">> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PUT", body }),
      invalidatesTags: ["AdminUsers"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApi;
