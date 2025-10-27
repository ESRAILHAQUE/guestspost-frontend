"use client";

import type React from "react";
import { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Activity,
  Settings,
  LogOut,
  DollarSign,
  FileText,
  Globe,
  Send,
  Menu,
  X,
  BookOpen,
  Star,
  Package,
  MessageCircleMoreIcon,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Messages", href: "/admin/messages", icon: MessageCircleMoreIcon },
  { name: "Activities", href: "/admin/activities", icon: Activity },
  {
    name: "Service Purchases",
    href: "/admin/service-purchases",
    icon: FileText,
  },
  { name: "Fund Requests", href: "/admin/fund-requests", icon: DollarSign },
  { name: "Manage Websites", href: "/admin/manage-websites", icon: Globe },
  { name: "Site Submissions", href: "/admin/site-submissions", icon: Send },
  {
    name: "Package Management",
    href: "/admin/package-management",
    icon: Package,
  },
  { name: "Client Reviews", href: "/admin/client-reviews", icon: Star },
  { name: "Blog Management", href: "/admin/blog-management", icon: BookOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use admin authentication hook
  const { isAuthenticated } = useAdminAuth();

  useEffect(() => {
    // Check if user is authenticated as admin
    if (!isAuthenticated) {
      // Check localStorage for admin authentication as fallback
      if (typeof window !== "undefined") {
        const adminAuth = localStorage.getItem("admin-authenticated");

        if (adminAuth !== "true") {
          // User is not authenticated as admin, redirect to admin login
          router.push("/admin/login");
        }
      }
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin-authenticated");
      localStorage.removeItem("admin-id");
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      window.location.href = "/admin/login";
    }
  };

  // Show loading state while checking authentication
  if (
    !isAuthenticated &&
    typeof window !== "undefined" &&
    localStorage.getItem("admin-authenticated") !== "true"
  ) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}>
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="text-sm text-gray-400">
              Welcome to the Admin Dashboard
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
