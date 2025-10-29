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
      const response = await endpoints.websites.createWebsite(website);
      return response.data;
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
      if (!website._id && !website.id) {
        throw new Error("Website ID is required for update");
      }
      const websiteId = website._id || website.id;
      const response = await endpoints.websites.updateWebsite(websiteId, website);
      return response.data;
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
      const websiteId = typeof id === "number" ? String(id) : id;
      await endpoints.websites.deleteWebsite(websiteId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.websites });
    },
  });
}
