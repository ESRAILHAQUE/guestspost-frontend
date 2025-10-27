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
      const res = await fetch(
        "https://guestpostnow.io/guestpost-backend/orders.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );
      return await res.text();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.orders() });
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.orders(variables.userId),
        });
        queryClient.invalidateQueries({
          queryKey: QueryKeys.balance(variables.userId),
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
      const res = await fetch(
        "https://guestpostnow.io/guestpost-backend/orders.php",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.orders() });
    },
  });
}
