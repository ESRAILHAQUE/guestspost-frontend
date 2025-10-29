// API Response Types

export interface User {
  ID: string;
  user_nicename: string;
  user_email: string;
  user_pass?: string;
  user_url?: string;
  balance: number;
  user_status?: string;
  registration_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Website {
  id: number;
  name: string;
  url: string;
  category: string;
  niche: string;
  section: "standard" | "premium";
  da: number;
  dr: number;
  traffic: string;
  language: string;
  country: string;
  status: "active" | "pending" | "inactive";
  delivery: string;
  doFollowPrice: number;
  noFollowPrice: number;
  standardPrice?: number;
  premiumDoFollowPrice?: number;
  premiumNoFollowPrice?: number;
  description?: string;
  guidelines?: string;
  logo?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  user_id: string;
  userName: string;
  item_name: string;
  price: number;
  status: "processing" | "completed" | "failed" | "pending";
  date: string;
  created_at: string;
  orderDate?: string;
  description?: string;
  features?: string | string[];
  type: string;
  article?: string;
  file?: {
    name: string;
    type: string;
    size: number;
    data: string;
  };
  message?: string;
  message_time?: string;
  submittedAt?: string;
  completionMessage?: string;
  completionLink?: string;
  completedAt?: string;
}

export interface FundRequest {
  id: string;
  userId?: string;
  userName?: string;
  userEmail: string;
  amount: number;
  paypalEmail?: string;
  status: "pending" | "invoice-sent" | "paid" | "rejected";
  requestDate: string;
  notes?: string;
  adminNotes?: string;
  processedDate?: string;
  processedBy?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category: string;
  tags?: string[];
  image?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface SiteSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  websites: string[];
  isOwner: boolean;
  csvFile?: {
    name: string;
    data: string;
    type: string;
  };
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

// API Response Wrappers
export interface APIResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query Keys for React Query
export const QueryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["user", id] as const,
  currentUser: ["currentUser"] as const,
  websites: ["websites"] as const,
  website: (id: number) => ["website", id] as const,
  orders: (userId?: string) => ["orders", userId] as const,
  order: (id: string) => ["order", id] as const,
  fundRequests: (userId?: string) => ["fundRequests", userId] as const,
  blogPosts: ["blogPosts"] as const,
  blogPost: (id: string) => ["blogPost", id] as const,
  siteSubmissions: (userId?: string) => ["siteSubmissions", userId] as const,
  siteSubmission: (id: string) => ["siteSubmission", id] as const,
  siteSubmissionStats: (userId?: string) =>
    ["siteSubmissionStats", userId] as const,
  packages: (status?: string) => ["packages", status] as const,
  package: (id: string) => ["package", id] as const,
  packageStats: () => ["packageStats"] as const,
  reviews: () => ["reviews"] as const,
  review: (id: string) => ["review", id] as const,
  reviewStats: () => ["reviewStats"] as const,
  activities: (limit?: number) => ["activities", limit] as const,
  activitiesByType: (type: string, limit?: number) =>
    ["activitiesByType", type, limit] as const,
  activitiesByUser: (userId: string, limit?: number) =>
    ["activitiesByUser", userId, limit] as const,
  activityStats: () => ["activityStats"] as const,
  messages: () => ["messages"] as const,
  message: (id: string) => ["message", id] as const,
  messageStats: () => ["messageStats"] as const,
  balance: (userId: string) => ["balance", userId] as const,
} as const;
