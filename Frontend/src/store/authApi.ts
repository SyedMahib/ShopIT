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
    register: builder.mutation<{ success: boolean }, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation<{ success: boolean }, LoginRequest>({
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
    forgotPassword: builder.mutation<{ success: boolean; message: string }, { email: string }>({
      query: (body) => ({
        url: "/password/forgot",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      { success: boolean },
      { token: string; password: string; confirmPassword: string }
    >({
      query: ({ token, ...body }) => ({
        url: `/password/reset/${token}`,
        method: "PUT",
        body,
      }),
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
    updateProfile: builder.mutation<{ user: User }, Partial<User>>({
      query: (body) => ({
        url: "/me/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation<{ user: User }, File>({
      query: (file) => {
        const body = new FormData();
        body.append("avatar", file);
        return { url: "/me/avatar", method: "PUT", body };
      },
      invalidatesTags: ["User"],
    }),
    removeAvatar: builder.mutation<{ user: User }, void>({
      query: () => ({ url: "/me/avatar", method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<{ success: boolean; message: string }, { oldPassword: string; newPassword: string }>({
      query: (body) => ({
        url: "/password/update",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetMeQuery, useGoogleLoginMutation, useUpdateProfileMutation, useUpdatePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation, useUploadAvatarMutation, useRemoveAvatarMutation } = authApi;
