"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { endpoints } from "@/lib/api/client";
import { toast } from "sonner";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const adminAuth =
        typeof window !== "undefined" &&
        localStorage.getItem("admin-authenticated") === "true";

      // Also verify the user's role
      if (adminAuth) {
        try {
          const userRole = localStorage.getItem("userRole");
          if (userRole === "admin") {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("admin-authenticated");
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Use the new Node.js backend authentication
      const response = await endpoints.auth.login({
        user_email: username,
        user_pass: password,
      });

      if (response.success) {
        const user = response.data.user;

        // Check if user has admin role
        if (user.role === "admin") {
          setIsAuthenticated(true);
          localStorage.setItem("admin-authenticated", "true");
          localStorage.setItem("admin-id", user.ID);
          localStorage.setItem("auth-token", response.data.tokens.accessToken);
          localStorage.setItem("user_id", user.user_email);
          localStorage.setItem("userRole", user.role); // Store user role
          localStorage.setItem("isLoggedIn", "true");
          toast.success("Admin login successful!");
          return true;
        } else {
          toast.error("Access denied. Admin privileges required.");
          return false;
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
        return false;
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token
      await endpoints.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      localStorage.removeItem("admin-authenticated");
      localStorage.removeItem("admin-id");
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("isLoggedIn");
      toast.success("Logged out successfully!");
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
