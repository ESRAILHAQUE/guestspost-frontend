"use client";

import { useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Globe,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminStats } from "@/hooks/api/useAdminStats";

export default function AdminDashboard() {
  const router = useRouter();

  // Use React Query hook
  const { data: stats, isLoading, refetch, error } = useAdminStats();

  // Show error state if API fails
  if (error && !isLoading) {
    console.error("Failed to load admin stats:", error);
  }

  useEffect(() => {
    const isAuthenticated =
      typeof window !== "undefined" &&
      localStorage.getItem("admin-authenticated") === "true";
    const adminEmail = localStorage.getItem("adminEmail");
    if (!isAuthenticated && !adminEmail) {
      router.push("/admin/login");
    }
  }, [router]);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      description: `${stats?.activeUsers || 0} active users`,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Active Websites",
      value: stats?.totalWebsites || 0,
      description: "Available for purchase",
      icon: Globe,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      description: "All time orders",
      icon: ShoppingCart,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      description: "All time revenue",
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Fund Requests",
      value: stats?.pendingFundRequests || 0,
      description: "Pending approval",
      icon: DollarSign,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      description: "Currently active",
      icon: Activity,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
    },
  ];
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300 mt-2">
              Overview of your marketplace performance
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <RefreshCw
                    className={`h-4 w-4 mr-2 text-white m-3 animate-spin`}
                  />
                ) : (
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                )}
                <p className="text-xs text-gray-400">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-300">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white h-12">
                <a href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </a>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-12">
                <a href="/admin/manage-websites">
                  <Globe className="h-4 w-4 mr-2" />
                  Add Website
                </a>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12">
                <a href="/admin/orders">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Orders
                </a>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white h-12">
                <a href="/admin/fund-requests">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Fund Requests
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
            <CardDescription className="text-gray-300">
              Current system information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Admin Panel Status</span>
                <span className="text-green-400 font-medium">✓ Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database Status</span>
                <span className="text-green-400 font-medium">✓ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last Updated</span>
                <span className="text-gray-400">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
