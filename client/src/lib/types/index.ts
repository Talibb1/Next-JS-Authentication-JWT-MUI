export type NotificationType = 'success' | 'error' | 'loading' | 'custom' | 'info';


// types.ts

export interface VerifyEmailData {
  token: string;
  email: string;
  otp: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  token: string;
  email: string;
  user: {
    is_verified: boolean;
    // Add other user properties as needed
  };
}

export interface ProfileResponse {
  email: string;
  name: string;
  // Add other profile properties as needed
}

export interface PasswordResetData {
  id: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface User {
  id: string;
  token: string;
  name: string;
  email: string;
  roles: string[];
  is_auth: boolean;
}

// Define the type for the profile response
export interface ProfileResponse {
  user: User;
}


