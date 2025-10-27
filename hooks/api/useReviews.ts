import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/types/api";
import { endpoints } from "@/lib/api/client";

export interface ReviewType {
  _id?: string;
  name: string;
  company: string;
  rating: number;
  review: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useReviews() {
  return useQuery({
    queryKey: QueryKeys.reviews(),
    queryFn: async () => {
      try {
        const response = await endpoints.reviews.getReviews();
        return response.data;
      } catch (error) {
        console.error("Error loading reviews:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: QueryKeys.review(id),
    queryFn: async () => {
      const response = await endpoints.reviews.getReview(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      reviewData: Omit<ReviewType, "_id" | "createdAt" | "updatedAt">
    ) => {
      const response = await endpoints.reviews.createReview(reviewData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.reviews() });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      reviewData,
    }: {
      id: string;
      reviewData: Partial<ReviewType>;
    }) => {
      const response = await endpoints.reviews.updateReview(id, reviewData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.reviews() });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await endpoints.reviews.deleteReview(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.reviews() });
    },
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: QueryKeys.reviewStats(),
    queryFn: async () => {
      const response = await endpoints.reviews.getReviewStats();
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}
