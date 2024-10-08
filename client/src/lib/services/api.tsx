// authApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  User,
  VerifyEmailData,
  LoginData,
  UserResponse,
  ProfileResponse,
  PasswordResetData,
  ChangePasswordData,
  ApiResponse,
  CreateUserInput,
} from "../types";

// Use environment variable for base URL
// const baseUrl = "http://localhost:5000/api/user/";
const baseUrl = process.env.NEXT_PUBLIC_API_URL_PRODUCTION;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    createUser: builder.mutation<ApiResponse<UserResponse>, CreateUserInput>({
      query: (user) => ({
        url: "register",
        method: "POST",
        body: user,
        headers: {
          "Content-type": "application/json",
        },
      }),
    }),

    verifyEmail: builder.mutation<ApiResponse<null>, VerifyEmailData>({
      query: (user) => ({
        url: "varify-email",
        method: "POST",
        body: user,
        headers: {
          "Content-type": "application/json",
        },
      }),
    }),

    resendOtp: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: "resend-otp",
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json",
        },
      }),
    }),

    cancelRegistration: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: "cancel-registration",
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json",
        },
      }),
    }),

    loginUser: builder.mutation<ApiResponse<UserResponse>, LoginData>({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      }),
    }),

    getUser: builder.query<ApiResponse<ProfileResponse>, void>({
      query: () => ({
        url: "profile",
        method: "GET",
        credentials: "include",
      }),
    }),

    logoutUser: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "logout",
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    forgetPasswordLink: builder.mutation<ApiResponse<null>, PasswordResetData>({
      query: (data) => ({
        url: "forgetPasswordLink",
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json",
        },
      }),
    }),

    forgetPassword: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: "forgetPassword",
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json",
        },
      }),
    }),

    changeUserPassword: builder.mutation<ApiResponse<null>, ChangePasswordData>(
      {
        query: (data) => ({
          url: "changeUserPassword",
          method: "POST",
          body: data,
          credentials: "include",
        }),
      }
    ),
  }),
});

export const {
  useCreateUserMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useCancelRegistrationMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useLogoutUserMutation,
  useForgetPasswordLinkMutation,
  useForgetPasswordMutation,
  useChangeUserPasswordMutation,
} = authApi;
