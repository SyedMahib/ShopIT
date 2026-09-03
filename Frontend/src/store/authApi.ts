import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1", credentials: "include" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation<{ success: boolean; token: string; user: User }, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation<{ success: boolean; token: string }, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<{ user: User }, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
    googleLogin: builder.mutation<{ success: boolean; token: string; user: User }, void>({
      query: () => ({
        url: "/auth/google",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetMeQuery, useGoogleLoginMutation } = authApi;
