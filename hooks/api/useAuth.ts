/**
 * Authentication Hooks
 * React Query hooks for authentication operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  endpoints,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "@/lib/api/client";
import { QueryKeys } from "@/types/api";

// Login hook
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      endpoints.auth.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Store tokens
        localStorage.setItem("auth-token", response.data.tokens.accessToken);
        localStorage.setItem(
          "refresh-token",
          response.data.tokens.refreshToken
        );
        localStorage.setItem("user_id", response.data.user.user_email);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", response.data.user.role);

        // Update user cache
        queryClient.setQueryData(
          QueryKeys.user(response.data.user.user_email),
          response.data.user
        );
      }
    },
  });
}

// Register hook
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => endpoints.auth.register(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Store tokens
        localStorage.setItem("auth-token", response.data.tokens.accessToken);
        localStorage.setItem(
          "refresh-token",
          response.data.tokens.refreshToken
        );
        localStorage.setItem("user_id", response.data.user.user_email);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", response.data.user.role);

        // Update user cache
        queryClient.setQueryData(
          QueryKeys.user(response.data.user.user_email),
          response.data.user
        );
      }
    },
  });
}

// Logout hook
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => endpoints.auth.logout(),
    onSuccess: () => {
      // Clear all stored data
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");

      // Clear all queries
      queryClient.clear();
    },
  });
}

// Get current user hook
export function useCurrentUser() {
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  return useQuery({
    queryKey: QueryKeys.user(userEmail || ""),
    queryFn: async () => {
      if (!userEmail) {
        throw new Error("No user email found");
      }

      const response = await endpoints.auth.getMe();

      if (!response.success || !response.data) {
        throw new Error("Failed to fetch user");
      }

      return response.data;
    },
    enabled: !!userEmail,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });
}

// Forgot password hook
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => endpoints.auth.forgotPassword(email),
  });
}

// Reset password hook
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      endpoints.auth.resetPassword(token, password),
  });
}

// Change password hook
export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => endpoints.auth.changePassword(currentPassword, newPassword),
  });
}

// Refresh token hook
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem("refresh-token");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      return endpoints.auth.refreshToken(refreshToken);
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update tokens
        localStorage.setItem("auth-token", response.data.tokens.accessToken);
        localStorage.setItem(
          "refresh-token",
          response.data.tokens.refreshToken
        );

        // Update user cache
        queryClient.setQueryData(
          QueryKeys.user(response.data.user.user_email),
          response.data.user
        );
      }
    },
  });
}
