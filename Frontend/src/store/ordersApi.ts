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

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

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
  orderStatus: OrderStatus;
  deliveredAt?: string;
  cancelledAt?: string;
  user?: string | { _id: string; name: string; email: string };
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

export interface NewOrderRequest {
  orderItems: { product: string; quantity: number }[];
  shippingInfo: ShippingInfo;
  paymentMethod: "COD" | "Card";
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
    createOrder: builder.mutation<OrderDetailsResponse, NewOrderRequest>({
      query: (body) => ({
        url: "/orders/new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
    cancelOrder: builder.mutation<OrderDetailsResponse, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetMyOrdersQuery, useGetOrderDetailsQuery, useCreateOrderMutation, useCancelOrderMutation } =
  ordersApi;
