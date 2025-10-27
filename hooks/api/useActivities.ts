import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/types/api";
import { endpoints } from "@/lib/api/client";

export interface ActivityType {
  _id?: string;
  userId?: string;
  userName?: string;
  type:
    | "order"
    | "user"
    | "website"
    | "site_submission"
    | "fund_request"
    | "blog";
  action: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt?: string;
}

export function useActivities(limit?: number) {
  return useQuery({
    queryKey: QueryKeys.activities(limit),
    queryFn: async () => {
      try {
        const response = await endpoints.activities.getActivities(limit);
        return response.data;
      } catch (error) {
        console.error("Error loading activities:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false,
  });
}

export function useActivitiesByType(type: string, limit?: number) {
  return useQuery({
    queryKey: QueryKeys.activitiesByType(type, limit),
    queryFn: async () => {
      try {
        const response = await endpoints.activities.getActivitiesByType(
          type,
          limit
        );
        return response.data;
      } catch (error) {
        console.error("Error loading activities:", error);
        return [];
      }
    },
    enabled: !!type,
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

export function useActivitiesByUser(userId: string, limit?: number) {
  return useQuery({
    queryKey: QueryKeys.activitiesByUser(userId, limit),
    queryFn: async () => {
      try {
        const response = await endpoints.activities.getActivitiesByUser(
          userId,
          limit
        );
        return response.data;
      } catch (error) {
        console.error("Error loading activities:", error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

export function useActivityStats() {
  return useQuery({
    queryKey: QueryKeys.activityStats(),
    queryFn: async () => {
      const response = await endpoints.activities.getActivityStats();
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}
