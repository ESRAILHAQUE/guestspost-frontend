"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Globe,
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/api/useUsers";
import { useOrders } from "@/hooks/api/useOrders";

export default function DashboardPage() {
  const router = useRouter();

  // Use React Query hooks
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const { data: orders = [], isLoading: ordersLoading } = useOrders(
    userEmail || undefined
  );

  // Only show loading for orders since user is already loaded by layout
  const isLoading = ordersLoading;

  const stats = {
    totalOrders: orders.length || 0,
    activeOrders:
      orders.filter(
        (order: any) =>
          order.status === "pending" || order.status === "processing"
      ).length || 0,
    totalSpent:
      orders.reduce(
        (sum: number, order: any) => sum + (parseInt(order.price) || 0),
        0
      ) || 0,
    accountBalance: user ? Math.abs(user.balance || 0) : 0,
  };

  const quickActions = [
    {
      title: "Browse Websites",
      description: "Explore our catalog of premium websites",
      icon: Globe,
      href: "/dashboard/catalog",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Guest Post Packages",
      description: "View available guest posting packages",
      icon: Package,
      href: "/dashboard/packages",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "My Orders",
      description: "Track your current orders",
      icon: ShoppingCart,
      href: "/dashboard/orders",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Add Funds",
      description: "Top up your account balance",
      icon: CreditCard,
      href: "/dashboard/funds",
      color: "from-orange-500 to-red-500",
    },
  ];

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: Activity,
      color: "text-green-500",
    },
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      title: "Account Balance",
      value: `$${stats.accountBalance.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-cyan-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {user?.user_nicename
              ? `Welcome, ${user.user_nicename}`
              : "Dashboard"}
          </h1>
          <p className="text-gray-800">
            Welcome back! Here's your account overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="bg-primary/5 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-primary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={() => router.push(action.href)}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                      <action.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-800">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-primary mb-4">
            Recent Activity
          </h2>
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                <p className="text-gray-800">No recent activity to display</p>
                <p className="text-sm text-gray-900 mt-2">
                  Your recent orders and activities will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
