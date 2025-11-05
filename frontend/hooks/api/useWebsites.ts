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
      // Use Node.js backend endpoint
      const res = await endpoints.websites.createWebsite(website);
      return res;
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
      // Use Node.js backend endpoint
      const { _id, ...updateData } = website;
      const res = await endpoints.websites.updateWebsite(_id, updateData);
      return res;
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
    mutationFn: async (id: string | number) => {
      // Use Node.js backend endpoint
      const res = await endpoints.websites.deleteWebsite(String(id));
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.websites });
    },
  });
}
