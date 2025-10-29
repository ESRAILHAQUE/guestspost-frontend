import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys, User } from "@/types/api";
import { endpoints } from "@/lib/api/client";

// Get all users (Admin only)
export function useUsers() {
  return useQuery({
    queryKey: QueryKeys.users,
    queryFn: async () => {
      try {
        // Check if user is admin before making the request
        const isAdmin =
          typeof window !== "undefined" &&
          localStorage.getItem("admin-authenticated") === "true";

        if (!isAdmin) {
          throw new Error("Admin access required");
        }

        const response = await endpoints.users.getUsers();
        return response.data;
      } catch (error) {
        console.error("Error loading users:", error);
        // Return empty array instead of throwing to prevent UI crashes
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: false,
    // Only run query if user is admin
    enabled:
      typeof window !== "undefined" &&
      localStorage.getItem("admin-authenticated") === "true",
  });
}

// Get single user by email
export function useUser(email: string | null) {
  return useQuery({
    queryKey: QueryKeys.user(email || ""),
    queryFn: async () => {
      try {
        if (!email) return null;
        const response = await endpoints.users.getUsers();
        const users = response.data;
        return users.find((u: any) => u.user_email === email);
      } catch (error) {
        return null;
      }
    },
    enabled: !!email,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

// Get current logged in user
export function useCurrentUser() {
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  return useQuery({
    queryKey: QueryKeys.user(userEmail || ""),
    queryFn: async () => {
      if (!userEmail) {
        throw new Error("No user email found");
      }

      try {
        const response = await endpoints.auth.getMe();
        return response.data;
      } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
      }
    },
    enabled: !!userEmail,
    staleTime: 5 * 60 * 1000,
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retrying
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: any) => {
      if (!userData.ID && !userData._id) {
        throw new Error("User ID is required");
      }
      const userId = userData.ID || userData._id;
      const response = await endpoints.users.updateUser(userId, userData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users });
      if (variables.user_email) {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.user(variables.user_email),
        });
      }
    },
  });
}
