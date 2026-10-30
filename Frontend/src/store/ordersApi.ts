import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: string;
  product: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  phoneNo: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  itemsPrice: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: "COD" | "Card";
  paymentInfo?: { id?: string; status?: string };
  orderStatus: "Processing" | "Shipped";
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyOrdersResponse {
  success?: boolean;
  orders: Order[];
}

export interface OrderDetailsResponse {
  success?: boolean;
  order: Order;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1", credentials: "include" }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getMyOrders: builder.query<MyOrdersResponse, void>({
      query: () => "/me/orders",
      providesTags: ["Orders"],
    }),
    getOrderDetails: builder.query<OrderDetailsResponse, string>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: "Orders", id: orderId }],
    }),
  }),
});

export const { useGetMyOrdersQuery, useGetOrderDetailsQuery } = ordersApi;
