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
      const response = await endpoints.fundRequests.createFundRequest(request);
      return response.data;
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
      if (!request._id && !request.id) {
        throw new Error("Fund request ID is required for update");
      }
      const requestId = request._id || request.id;
      const response = await endpoints.fundRequests.updateFundRequest(requestId, request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.fundRequests() });
    },
  });
}
