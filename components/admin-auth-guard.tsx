"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAdminAuth = () => {
      const userRole = localStorage.getItem("userRole");
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const token = localStorage.getItem("auth-token");

      // Check if user is logged in and has admin role
      if (isLoggedIn !== "true" || !token || userRole !== "admin") {
        console.log("Admin auth failed - redirecting to login");
        router.push("/login");
        return false;
      }

      // Set admin-authenticated flag if not set but user is admin
      const adminAuth = localStorage.getItem("admin-authenticated");
      if (userRole === "admin" && adminAuth !== "true") {
        localStorage.setItem("admin-authenticated", "true");
        const userEmail = localStorage.getItem("user_id");
        if (userEmail) {
          localStorage.setItem("adminEmail", userEmail);
        }
      }

      return true;
    };

    checkAdminAuth();
  }, [router]);

  return <>{children}</>;
}

