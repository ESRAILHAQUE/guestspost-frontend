// API Client for all backend requests

// In dev mode, use proxy to avoid CORS. In production, use direct URL
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1" // Node.js backend
    : process.env.NEXT_PUBLIC_API_URL ||
      "https://guestspost-backend-pi.vercel.app"; // Update with your VPS URL

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query params
    let url = `${this.baseURL}/${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      url += `?${queryString}`;
    }

    // Default headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include", // Important for PHP backend CORS
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        // Try to parse as JSON anyway (PHP backend might not set correct header)
        try {
          return JSON.parse(text) as T;
        } catch {
          throw new Error(`Invalid response format: ${text.substring(0, 100)}`);
        }
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle Node.js backend error format
        const errorMessage =
          data.message ||
          data.error?.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        // Don't log to console in production, just throw
        throw new Error(error.message || "Network request failed");
      }
      throw new Error("Network request failed. Please check your connection.");
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create singleton instance
export const api = new APIClient(API_BASE_URL);

// Authentication types
export interface AuthUser {
  ID: string;
  user_nicename: string;
  user_email: string;
  user_phone?: string;
  user_company?: string;
  user_url?: string;
  user_address?: string;
  user_bio?: string;
  balance: number;
  role: "user" | "admin";
  user_status: "active" | "inactive" | "suspended";
  registration_date: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  user_email: string;
  user_pass: string;
}

export interface RegisterData {
  user_nicename: string;
  user_email: string;
  user_pass: string;
}

// Helper functions for Node.js backend endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: (credentials: LoginCredentials) =>
      api.post<{ success: boolean; data: AuthResponse; message: string }>(
        "auth/login",
        credentials
      ),

    register: (userData: RegisterData) =>
      api.post<{ success: boolean; data: AuthResponse; message: string }>(
        "auth/register",
        userData
      ),

    logout: () =>
      api.post<{ success: boolean; message: string }>("auth/logout"),

    getMe: () =>
      api.get<{ success: boolean; data: AuthUser; message: string }>("auth/me"),

    forgotPassword: (email: string) =>
      api.post<{ success: boolean; message: string }>("auth/forgot-password", {
        user_email: email,
      }),

    resetPassword: (token: string, password: string) =>
      api.post<{ success: boolean; message: string }>("auth/reset-password", {
        token,
        user_pass: password,
      }),

    changePassword: (currentPassword: string, newPassword: string) =>
      api.post<{ success: boolean; message: string }>("auth/change-password", {
        currentPassword,
        newPassword,
      }),

    refreshToken: (refreshToken: string) =>
      api.post<{ success: boolean; data: AuthResponse; message: string }>(
        "auth/refresh-token",
        { refreshToken }
      ),
  },

  // Users
  users: {
    getUsers: () =>
      api.get<{ success: boolean; data: AuthUser[]; message: string }>("users"),
    getUser: (id: string) =>
      api.get<{ success: boolean; data: AuthUser; message: string }>(
        `users/${id}`
      ),
    updateUser: (id: string, userData: Partial<AuthUser>) =>
      api.put<{ success: boolean; data: AuthUser; message: string }>(
        `users/${id}`,
        userData
      ),
    deleteUser: (id: string) =>
      api.delete<{ success: boolean; message: string }>(`users/${id}`),
  },

  // Websites
  websites: {
    getWebsites: (params?: Record<string, any>) =>
      api.get<{
        success: boolean;
        data: any[];
        pagination?: any;
        message: string;
      }>("websites", { params }),
    getWebsite: (id: string) =>
      api.get<{ success: boolean; data: any; message: string }>(
        `websites/${id}`
      ),
    createWebsite: (website: any) =>
      api.post<{ success: boolean; data: any; message: string }>(
        "websites",
        website
      ),
    updateWebsite: (id: string, website: any) =>
      api.put<{ success: boolean; data: any; message: string }>(
        `websites/${id}`,
        website
      ),
    deleteWebsite: (id: string) =>
      api.delete<{ success: boolean; message: string }>(`websites/${id}`),
    getWebsiteStats: () =>
      api.get<{ success: boolean; data: any; message: string }>(
        "websites/stats"
      ),
    getCategories: () =>
      api.get<{ success: boolean; data: string[]; message: string }>(
        "websites/categories"
      ),
    getNiches: () =>
      api.get<{ success: boolean; data: string[]; message: string }>(
        "websites/niches"
      ),
  },

  // Orders
  orders: {
    getOrders: (params?: Record<string, any>) =>
      api.get<{
        success: boolean;
        data: any[];
        pagination?: any;
        message: string;
      }>("orders", { params }),
    getOrder: (id: string) =>
      api.get<{ success: boolean; data: any; message: string }>(`orders/${id}`),
    createOrder: (order: any) =>
      api.post<{ success: boolean; data: any; message: string }>(
        "orders",
        order
      ),
    updateOrder: (id: string, order: any) =>
      api.put<{ success: boolean; data: any; message: string }>(
        `orders/${id}`,
        order
      ),
    deleteOrder: (id: string) =>
      api.delete<{ success: boolean; message: string }>(`orders/${id}`),
    completeOrder: (id: string, data: any) =>
      api.patch<{ success: boolean; data: any; message: string }>(
        `orders/${id}/complete`,
        data
      ),
    getOrderStats: (params?: Record<string, any>) =>
      api.get<{ success: boolean; data: any; message: string }>(
        "orders/stats",
        { params }
      ),
    getOrdersByUser: (userEmail: string, params?: Record<string, any>) =>
      api.get<{ success: boolean; data: any[]; message: string }>(
        `orders/user/${userEmail}`,
        { params }
      ),
  },

  // Fund Requests
  fundRequests: {
    getFundRequests: (params?: Record<string, any>) =>
      api.get<{
        success: boolean;
        data: any[];
        pagination?: any;
        message: string;
      }>("fund-requests", { params }),
    getFundRequest: (id: string) =>
      api.get<{ success: boolean; data: any; message: string }>(
        `fund-requests/${id}`
      ),
    createFundRequest: (request: any) =>
      api.post<{ success: boolean; data: any; message: string }>(
        "fund-requests",
        request
      ),
    updateFundRequest: (id: string, request: any) =>
      api.put<{ success: boolean; data: any; message: string }>(
        `fund-requests/${id}`,
        request
      ),
    deleteFundRequest: (id: string) =>
      api.delete<{ success: boolean; message: string }>(`fund-requests/${id}`),
    approveFundRequest: (id: string, data: any) =>
      api.patch<{ success: boolean; data: any; message: string }>(
        `fund-requests/${id}/approve`,
        data
      ),
    rejectFundRequest: (id: string, data: any) =>
      api.patch<{ success: boolean; data: any; message: string }>(
        `fund-requests/${id}/reject`,
        data
      ),
    getFundRequestStats: (params?: Record<string, any>) =>
      api.get<{ success: boolean; data: any; message: string }>(
        "fund-requests/stats",
        { params }
      ),
    getFundRequestsByUser: (userEmail: string, params?: Record<string, any>) =>
      api.get<{ success: boolean; data: any[]; message: string }>(
        `fund-requests/user/${userEmail}`,
        { params }
      ),
  },

  // Blog Posts
  blog: {
    getBlogPosts: (params?: Record<string, any>) =>
      api.get<{
        success: boolean;
        data: any[];
        pagination?: any;
        message: string;
      }>("blog", { params }),
    getPublishedBlogPosts: (params?: Record<string, any>) =>
      api.get<{
        success: boolean;
        data: any[];
        pagination?: any;
        message: string;
      }>("blog/published", { params }),
    getBlogPost: (id: string) =>
      api.get<{ success: boolean; data: any; message: string }>(`blog/${id}`),
    getBlogPostBySlug: (slug: string) =>
      api.get<{ success: boolean; data: any; message: string }>(
        `blog/slug/${slug}`
      ),
    createBlogPost: (post: any) =>
      api.post<{ success: boolean; data: any; message: string }>("blog", post),
    updateBlogPost: (id: string, post: any) =>
      api.put<{ success: boolean; data: any; message: string }>(
        `blog/${id}`,
        post
      ),
    deleteBlogPost: (id: string) =>
      api.delete<{ success: boolean; message: string }>(`blog/${id}`),
    publishBlogPost: (id: string) =>
      api.patch<{ success: boolean; data: any; message: string }>(
        `blog/${id}/publish`
      ),
    getBlogPostStats: (params?: Record<string, any>) =>
      api.get<{ success: boolean; data: any; message: string }>("blog/stats", {
        params,
      }),
    getCategories: () =>
      api.get<{ success: boolean; data: string[]; message: string }>(
        "blog/categories"
      ),
    getTags: () =>
      api.get<{ success: boolean; data: string[]; message: string }>(
        "blog/tags"
      ),
    getRelatedBlogPosts: (id: string, params?: Record<string, any>) =>
      api.get<{ success: boolean; data: any[]; message: string }>(
        `blog/${id}/related`,
        { params }
      ),
  },

  // Site Submissions
  siteSubmissions: {
    getSiteSubmissions: (params?: Record<string, any>) =>
      api.get<{
        success: boolean;
        data: any[];
        pagination?: any;
        message: string;
      }>("site-submissions", { params }),
    getSiteSubmission: (id: string) =>
      api.get<{ success: boolean; data: any; message: string }>(
        `site-submissions/${id}`
      ),
    createSiteSubmission: (submission: any) =>
      api.post<{ success: boolean; data: any; message: string }>(
        "site-submissions",
        submission
      ),
    updateSiteSubmission: (id: string, submission: any) =>
      api.put<{ success: boolean; data: any; message: string }>(
        `site-submissions/${id}`,
        submission
      ),
    deleteSiteSubmission: (id: string) =>
      api.delete<{ success: boolean; message: string }>(
        `site-submissions/${id}`
      ),
    getSiteSubmissionStats: (params?: Record<string, any>) =>
      api.get<{ success: boolean; data: any; message: string }>(
        "site-submissions/stats",
        { params }
      ),
    getSiteSubmissionsByUser: (
      userEmail: string,
      params?: Record<string, any>
    ) =>
      api.get<{ success: boolean; data: any[]; message: string }>(
        `site-submissions/user/${userEmail}`,
        { params }
      ),
  },

  // Packages
  packages: {
    getPackages: (params?: Record<string, any>) =>
      api.get<{ success: boolean; data: any[]; message: string }>("packages", {
        params,
      }),
    getPackage: (id: string) =>
      api.get<{ success: boolean; data: any; message: string }>(
        `packages/${id}`
      ),
    createPackage: (packageData: any) =>
      api.post<{ success: boolean; data: any; message: string }>(
        "packages",
        packageData
      ),
    updatePackage: (id: string, packageData: any) =>
      api.put<{ success: boolean; data: any; message: string }>(
        `packages/${id}`,
        packageData
      ),
    deletePackage: (id: string) =>
      api.delete<{ success: boolean; message: string }>(`packages/${id}`),
    getPackageStats: () =>
      api.get<{ success: boolean; data: any; message: string }>(
        "packages/stats"
      ),
  },

  // Reviews
  reviews: {
    getReviews: () =>
      api.get<{ success: boolean; data: any[]; message: string }>("reviews"),
    getReview: (id: string) =>
      api.get<{ success: boolean; data: any; message: string }>(
        `reviews/${id}`
      ),
    createReview: (reviewData: any) =>
      api.post<{ success: boolean; data: any; message: string }>(
        "reviews",
        reviewData
      ),
    updateReview: (id: string, reviewData: any) =>
      api.put<{ success: boolean; data: any; message: string }>(
        `reviews/${id}`,
        reviewData
      ),
    deleteReview: (id: string) =>
      api.delete<{ success: boolean; message: string }>(`reviews/${id}`),
    getReviewStats: () =>
      api.get<{ success: boolean; data: any; message: string }>(
        "reviews/stats"
      ),
  },

  // Activities
  activities: {
    getActivities: (limit?: number) =>
      api.get<{ success: boolean; data: any[]; message: string }>(
        `activities${limit ? `?limit=${limit}` : ""}`
      ),
    getActivitiesByType: (type: string, limit?: number) =>
      api.get<{ success: boolean; data: any[]; message: string }>(
        `activities/type/${type}${limit ? `?limit=${limit}` : ""}`
      ),
    getActivitiesByUser: (userId: string, limit?: number) =>
      api.get<{ success: boolean; data: any[]; message: string }>(
        `activities/user/${userId}${limit ? `?limit=${limit}` : ""}`
      ),
    getActivityStats: () =>
      api.get<{ success: boolean; data: any; message: string }>(
        "activities/stats"
      ),
  },

  // Messages
  messages: {
    getMessages: () =>
      api.get<{ success: boolean; data: any[]; message: string }>("messages"),
    getMessage: (id: string) =>
      api.get<{ success: boolean; data: any; message: string }>(
        `messages/${id}`
      ),
    createMessage: (messageData: any) =>
      api.post<{ success: boolean; data: any; message: string }>(
        "messages",
        messageData
      ),
    updateMessage: (id: string, messageData: any) =>
      api.put<{ success: boolean; data: any; message: string }>(
        `messages/${id}`,
        messageData
      ),
    deleteMessage: (id: string) =>
      api.delete<{ success: boolean; message: string }>(`messages/${id}`),
    addReplyToMessage: (id: string, replyData: any) =>
      api.post<{ success: boolean; data: any; message: string }>(
        `messages/${id}/reply`,
        replyData
      ),
    getMessageStats: () =>
      api.get<{ success: boolean; data: any; message: string }>(
        "messages/stats"
      ),
  },

  // Legacy PHP endpoints (for backward compatibility)
  legacy: {
    // Auth
    login: (credentials: { user_email: string; user_pass: string }) =>
      api.post("user-login.php", credentials),

    register: (userData: any) => api.post("user-registered.php", userData),

    // Users
    getUsers: () => api.get<any[]>("users.php"),

    getUser: (email: string) =>
      api
        .get<any[]>("users.php")
        .then((users) => users.find((u: any) => u.user_email === email)),

    updateUser: (userData: any) => api.put("user-update.php", userData),

    // Websites
    getWebsites: () => api.get<{ data: any[] }>("websites.php"),

    addWebsite: (website: any) => api.post("websites-add.php", website),

    updateWebsite: (website: any) => api.put("websites-update.php", website),

    deleteWebsite: (id: number) =>
      api.delete("websites-delete.php", { body: JSON.stringify({ id }) }),

    // Orders
    getOrders: () => api.get<{ data: any[] }>("orders.php"),

    createOrder: (order: any) => api.post("orders.php", order),

    updateOrder: (order: any) => api.put("orders.php", order),

    // Fund Requests
    getFundRequests: () => api.get<{ data: any[] }>("admin-funds-request.php"),

    createFundRequest: (request: any) =>
      api.post("funds-request-add.php", request),

    createAdminFundRequest: (request: any) =>
      api.post("admin-funds-request-add.php", request),

    updateFundRequest: (request: any) =>
      api.put("admin-funds-request-update.php", request),
  },
};
// Frontend enhancement 1
// Frontend enhancement 2
// Frontend enhancement 3
// Frontend enhancement 4
// Frontend enhancement 5
// Frontend enhancement 6
// Frontend enhancement 7
// Frontend enhancement 8
// Frontend enhancement 9
// Frontend enhancement 10
// Frontend enhancement 11
// Frontend enhancement 12
// Frontend enhancement 13
// Frontend enhancement 14
// Frontend enhancement 15
// Frontend enhancement 16
// Frontend enhancement 17
// Frontend enhancement 18
// Frontend enhancement 19
// Frontend enhancement 20
// Frontend update 1
