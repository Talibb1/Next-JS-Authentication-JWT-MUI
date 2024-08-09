// authApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  User,
  VerifyEmailData,
  LoginData,
  UserResponse,
  ProfileResponse,
  PasswordResetData,
  ChangePasswordData,
  ApiResponse
} from '../types'; // Adjust the path according to your file structure

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/user/' }),
  endpoints: (builder) => ({
    createUser: builder.mutation<ApiResponse<UserResponse>, User>({
      query: (user) => ({
        url: 'register',
        method: 'POST',
        body: user,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    verifyEmail: builder.mutation<ApiResponse<null>, VerifyEmailData>({
      query: (data) => ({
        url: 'verify-email',
        method: 'POST',
        body: data,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    loginUser: builder.mutation<ApiResponse<UserResponse>, LoginData>({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data,
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      }),
    }),
    getUser: builder.query<ApiResponse<ProfileResponse>, void>({
      query: () => ({
        url: 'me',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    logoutUser: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
        body: {},
        credentials: 'include',
      }),
    }),
    resetPasswordLink: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: 'resetpassword',
        method: 'POST',
        body: data,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    resetPassword: builder.mutation<ApiResponse<null>, PasswordResetData>({
      query: (data) => ({
        url: 'resetpassword',
        method: 'POST',
        body: data,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordData>({
      query: (data) => ({
        url: 'change-password',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useGetUserQuery,
  useLogoutUserMutation,
  useResetPasswordLinkMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
