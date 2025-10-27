import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys, BlogPost } from "@/types/api";
import { endpoints } from "@/lib/api/client";

// Get all blog posts
export function useBlogPosts(params?: Record<string, any>) {
  return useQuery({
    queryKey: QueryKeys.blogPosts,
    queryFn: async () => {
      try {
        const response = await endpoints.blog.getBlogPosts(params);
        return response.data;
      } catch (error) {
        console.error("Error loading blog posts:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

// Get published blog posts
export function usePublishedBlogPosts(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...QueryKeys.blogPosts, "published"],
    queryFn: async () => {
      try {
        const response = await endpoints.blog.getPublishedBlogPosts(params);
        return response.data;
      } catch (error) {
        console.error("Error loading published blog posts:", error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

// Get single blog post
export function useBlogPost(id: string) {
  return useQuery({
    queryKey: QueryKeys.blogPost(id),
    queryFn: async () => {
      try {
        const response = await endpoints.blog.getBlogPost(id);
        return response.data;
      } catch (error) {
        console.error("Error loading blog post:", error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Get blog post by slug
export function useBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: [...QueryKeys.blogPosts, "slug", slug],
    queryFn: async () => {
      try {
        const response = await endpoints.blog.getBlogPostBySlug(slug);
        return response.data;
      } catch (error) {
        console.error("Error loading blog post by slug:", error);
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Create blog post
export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Partial<BlogPost>) =>
      endpoints.blog.createBlogPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.blogPosts });
    },
  });
}

// Update blog post
export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: Partial<BlogPost> }) =>
      endpoints.blog.updateBlogPost(id, post),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.blogPosts });
      queryClient.invalidateQueries({ queryKey: QueryKeys.blogPost(id) });
    },
  });
}

// Delete blog post
export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => endpoints.blog.deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.blogPosts });
    },
  });
}

// Publish blog post
export function usePublishBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => endpoints.blog.publishBlogPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.blogPosts });
      queryClient.invalidateQueries({ queryKey: QueryKeys.blogPost(id) });
    },
  });
}

// Get blog stats
export function useBlogStats() {
  return useQuery({
    queryKey: [...QueryKeys.blogPosts, "stats"],
    queryFn: async () => {
      try {
        const response = await endpoints.blog.getBlogStats();
        return response.data;
      } catch (error) {
        console.error("Error loading blog stats:", error);
        return {
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          totalViews: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Get blog categories
export function useBlogCategories() {
  return useQuery({
    queryKey: [...QueryKeys.blogPosts, "categories"],
    queryFn: async () => {
      try {
        const response = await endpoints.blog.getBlogCategories();
        return response.data;
      } catch (error) {
        console.error("Error loading blog categories:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

// Get blog tags
export function useBlogTags() {
  return useQuery({
    queryKey: [...QueryKeys.blogPosts, "tags"],
    queryFn: async () => {
      try {
        const response = await endpoints.blog.getBlogTags();
        return response.data;
      } catch (error) {
        console.error("Error loading blog tags:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

// Get related blog posts
export function useRelatedBlogPosts(id: string) {
  return useQuery({
    queryKey: [...QueryKeys.blogPosts, "related", id],
    queryFn: async () => {
      try {
        const response = await endpoints.blog.getRelatedBlogPosts(id);
        return response.data;
      } catch (error) {
        console.error("Error loading related blog posts:", error);
        return [];
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
