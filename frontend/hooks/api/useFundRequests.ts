import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys, FundRequest } from "@/types/api";
import { endpoints } from "@/lib/api/client";

// Get fund requests
export function useFundRequests(userId?: string) {
  return useQuery({
    queryKey: QueryKeys.fundRequests(userId),
    queryFn: async () => {
      try {
        const params = userId ? { userEmail: userId } : {};
        const response = await endpoints.fundRequests.getFundRequests(params);
        return response.data;
      } catch (error) {
        console.error("Error loading fund requests:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

// Create fund request
export function useCreateFundRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: any) => {
      // Create user fund request
      await fetch(
        "https://guestpostnow.io/guestpost-backend/funds-request-add.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );

      // Create admin fund request
      const adminRes = await fetch(
        "https://guestpostnow.io/guestpost-backend/admin-funds-request-add.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );
      const text = await adminRes.text();
      return JSON.parse(text);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.fundRequests() });
      if (variables.userEmail) {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.fundRequests(variables.userEmail),
        });
      }
    },
  });
}

// Update fund request
export function useUpdateFundRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: any) => {
      const res = await fetch(
        "https://guestpostnow.io/guestpost-backend/admin-funds-request-update.php",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.fundRequests() });
    },
  });
}
