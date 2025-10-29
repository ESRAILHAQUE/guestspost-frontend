import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys, SiteSubmission } from "@/types/api";
import { endpoints } from "@/lib/api/client";
import { useCurrentUser } from "./useAuth";

// Get site submissions
export function useSiteSubmissions(userEmail?: string) {
  const { data: currentUser } = useCurrentUser();

  // Use provided email or current user's email
  const emailToUse = userEmail || currentUser?.user_email;

  return useQuery({
    queryKey: QueryKeys.siteSubmissions(emailToUse),
    queryFn: async () => {
      try {
        const params = emailToUse ? { userEmail: emailToUse } : {};
        const response = await endpoints.siteSubmissions.getSiteSubmissions(
          params
        );
        return response.data;
      } catch (error) {
        console.error("Error loading site submissions:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
    enabled: !!emailToUse, // Only fetch if we have an email
  });
}

// Get single site submission
export function useSiteSubmission(id: string) {
  return useQuery({
    queryKey: QueryKeys.siteSubmission(id),
    queryFn: async () => {
      try {
        const response = await endpoints.siteSubmissions.getSiteSubmission(id);
        return response.data;
      } catch (error) {
        console.error("Error loading site submission:", error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

// Create site submission
export function useCreateSiteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submission: Partial<SiteSubmission>) =>
      endpoints.siteSubmissions.createSiteSubmission(submission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.siteSubmissions() });
    },
  });
}

// Update site submission
export function useUpdateSiteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      submission,
    }: {
      id: string;
      submission: Partial<SiteSubmission>;
    }) => endpoints.siteSubmissions.updateSiteSubmission(id, submission),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.siteSubmission(id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.siteSubmissions() });
    },
  });
}

// Delete site submission
export function useDeleteSiteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      endpoints.siteSubmissions.deleteSiteSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.siteSubmissions() });
    },
  });
}

// Get site submission stats
export function useSiteSubmissionStats(userEmail?: string) {
  const { data: currentUser } = useCurrentUser();

  // Use provided email or current user's email
  const emailToUse = userEmail || currentUser?.user_email;

  return useQuery({
    queryKey: QueryKeys.siteSubmissionStats(emailToUse),
    queryFn: async () => {
      try {
        const params = emailToUse ? { userEmail: emailToUse } : {};
        const response = await endpoints.siteSubmissions.getSiteSubmissionStats(
          params
        );
        return response.data;
      } catch (error) {
        console.error("Error loading site submission stats:", error);
        return {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        };
      }
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
    enabled: !!emailToUse, // Only fetch if we have an email
  });
}
