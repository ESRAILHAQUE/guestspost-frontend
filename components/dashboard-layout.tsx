"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBalance } from "@/hooks/use-balance";
import { useCurrentUser } from "@/hooks/api/useAuth";
import {
  LayoutDashboard,
  Globe,
  Package,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Wallet,
  Plus,
  MessageCircleMore,
} from "lucide-react";
import { toast } from "sonner";
import { endpoints } from "@/lib/api/client";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Messages", href: "/dashboard/messages", icon: MessageCircleMore },
  { name: "Website Catalog", href: "/dashboard/catalog", icon: Globe },
  { name: "Guest Post Packages", href: "/dashboard/packages", icon: Package },
  { name: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
  {
    name: "Service Orders",
    href: "/dashboard/service-orders",
    icon: ShoppingBag,
  },
  { name: "Add Funds", href: "/dashboard/funds", icon: CreditCard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

interface DashboardUser {
  ID: string;
  user_nicename: string;
  user_email: string;
  avatar?: string;
  balance: string;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { balance } = useBalance();

  // Use React Query hook instead of manual fetching
  const { data: user, isLoading, error } = useCurrentUser();

  // Check if user is logged in
  useEffect(() => {
    const userEmail = localStorage.getItem("user_id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("userRole");

    // If no login credentials, redirect to login
    if (!isLoggedIn || isLoggedIn !== "true" || !userEmail) {
      router.push("/login");
      return;
    }

    // If user is admin, redirect to admin dashboard
    if (userRole === "admin") {
      router.push("/admin");
      return;
    }
  }, [router]);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await endpoints.auth.logout();
        localStorage.removeItem("user_id");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("auth-token");
        toast.success("Logged out successfully.");
        router.push("/");
      } catch (error: any) {
        toast.error(`Logout failed: ${error.message}`);
      }
    }
  };

  const handleAddFunds = () => {
    router.push("/dashboard/funds");
  };

  // Show loading spinner while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  // If no user found after loading, redirect to login
  if (!isLoading && !user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-gray-900 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}>
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-900/50 backdrop-blur-xl border-r border-white/10">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <div className="mb-3">
              <p className="text-sm font-medium text-white">
                {user?.user_nicename}
              </p>
              <p className="text-xs text-gray-400">{user?.user_email}</p>
              <Badge className="mt-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                ${user?.balance ? Math.abs(user.balance) : 0}
              </Badge>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 bg-transparent"
              size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex bg-gray-900 lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-900/50 backdrop-blur-xl border-r border-white/10">
          <div className="flex items-center h-16 px-4 border-b border-white/10">
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>

          {/* Balance Card */}
          <div className="p-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">
                    Account Balance
                  </span>
                  <Wallet className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    ${user?.balance ? Math.abs(user.balance) : 0}
                  </span>
                  <Button
                    size="sm"
                    onClick={handleAddFunds}
                    className="h-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="mb-3">
              <p className="text-sm font-medium text-white">
                {user?.user_nicename}
              </p>
              <p className="text-xs text-gray-400">{user?.user_email}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddFunds}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                <Plus className="h-3 w-3 mr-1" />
                Add Funds
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-primary/20 bg-primary/5 backdrop-blur-xl px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-primary hover:bg-primary/10">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-primary">Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-secondary">
                ${Math.abs(balance)}
              </Badge>
              <Button
                size="sm"
                onClick={handleAddFunds}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                <Plus className="h-3 w-3 mr-1" />
                Add Funds
              </Button>
            </div>
          </div>
        </div>

        <main className="py-8">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
