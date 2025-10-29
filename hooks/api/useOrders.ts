import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys, Order } from "@/types/api";
import { endpoints } from "@/lib/api/client";

// Get all orders
export function useOrders(userId?: string) {
  return useQuery({
    queryKey: QueryKeys.orders(userId),
    queryFn: async () => {
      try {
        const params = userId ? { userEmail: userId } : {};
        const response = await endpoints.orders.getOrders(params);
        return response.data;
      } catch (error) {
        console.error("Error loading orders:", error);
        return [];
      }
    },
    staleTime: 30 * 1000,
    retry: false,
  });
}

// Create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: any) => {
      const response = await endpoints.orders.createOrder(order);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.orders() });
      if (variables.userId || variables.user_id) {
        const userId = variables.userId || variables.user_id;
        queryClient.invalidateQueries({
          queryKey: QueryKeys.orders(userId),
        });
        queryClient.invalidateQueries({
          queryKey: QueryKeys.balance(userId),
        });
      }
    },
  });
}

// Update order
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: any) => {
      if (!order.id) {
        throw new Error("Order ID is required for update");
      }
      const response = await endpoints.orders.updateOrder(order.id, order);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.orders() });
    },
  });
}
