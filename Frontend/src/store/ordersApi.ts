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

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  itemsPrice: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: "COD" | "Card";
  paymentInfo?: { id?: string; status?: PaymentStatus };
  orderStatus: OrderStatus;
  paidAt?: string;
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
    // Returns the Stripe Checkout page to send the customer to
    createCheckoutSession: builder.mutation<{ url: string }, string>({
      query: (orderId) => ({
        url: `/payment/checkout/${orderId}`,
        method: "POST",
      }),
    }),
    confirmPayment: builder.mutation<{ paymentStatus?: PaymentStatus }, string>({
      query: (orderId) => ({
        url: `/payment/confirm/${orderId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, orderId) => ["Orders", { type: "Orders", id: orderId }],
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

export const {
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useCreateCheckoutSessionMutation,
  useConfirmPaymentMutation,
  useCancelOrderMutation,
} = ordersApi;
