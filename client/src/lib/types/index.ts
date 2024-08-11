// types.ts

// Notification types for various states
export type NotificationType =
  | "success"
  | "error"
  | "loading"
  | "custom"
  | "info";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Interface for verifying email data
export interface VerifyEmailData {
  email: string;
  otp: string;
  token: string;
}

// Interface for login data
export interface LoginData {
  email: string;
  password: string;
}

// Interface for user data within the response
export interface User {
  id?: string;
  token: string;
  roles?: string[];
  is_auth?: boolean;
  is_verified?: boolean;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  picture?: string;
}

// Interface for user response from API
export interface UserResponse {
  response: string;
  token: string;
  email: string;
  user: User;
}

// Interface for profile response from API
export interface ProfileResponse {
  user: User;
}

// Interface for password reset data
export interface PasswordResetData {
  _id: string;
  token: string;
  Password: string;
  ConfirmPassword: string;
}

// Interface for changing password data
export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

// Generic interface for API responses
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  user: {
    token: string;
    email: string;
    is_verified: boolean;
    roles?: string[];
    is_auth?: boolean;
    name: string;
  };
}
