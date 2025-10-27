import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys, Website } from "@/types/api";
import { endpoints } from "@/lib/api/client";

// Get all websites
export function useWebsites() {
  return useQuery({
    queryKey: QueryKeys.websites,
    queryFn: async () => {
      try {
        const response = await endpoints.websites.getWebsites();
        return response.data;
      } catch (error) {
        console.error("Error loading websites:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

// Add website
export function useAddWebsite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (website: any) => {
      const res = await fetch(
        "https://guestpostnow.io/guestpost-backend/websites-add.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(website),
        }
      );
      const text = await res.text();
      return JSON.parse(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.websites });
    },
  });
}

// Update website
export function useUpdateWebsite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (website: any) => {
      const res = await fetch(
        "https://guestpostnow.io/guestpost-backend/websites-update.php",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(website),
        }
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.websites });
    },
  });
}

// Delete website
export function useDeleteWebsite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(
        "https://guestpostnow.io/guestpost-backend/websites-delete.php",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.websites });
    },
  });
}
