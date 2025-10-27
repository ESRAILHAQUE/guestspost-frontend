"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Activity,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  RefreshCw,
} from "lucide-react";
import {
  useActivities,
  useActivityStats,
  ActivityType,
} from "@/hooks/api/useActivities";

export default function AdminActivities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  // Use new API hooks
  const { data: activities = [], isLoading, refetch } = useActivities(100);
  const { data: stats } = useActivityStats();

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, []);

  const filteredActivities = activities.filter((activity: ActivityType) => {
    const matchesSearch =
      activity.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Activities Monitor
            </h1>
            <p className="text-gray-400 mt-2">
              Monitor all user activities and system events
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">
                    Total Activities
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.total || activities.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">
                    User Actions
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {
                      activities.filter((a: ActivityType) => a.type === "user")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Orders</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      activities.filter((a: ActivityType) => a.type === "order")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">
                    Fund Requests
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {
                      activities.filter(
                        (a: ActivityType) => a.type === "fund_request"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Websites</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      activities.filter(
                        (a: ActivityType) => a.type === "website"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-40 bg-white/10 border-white/20 text-white rounded-md px-3 py-2 h-10">
                <option value="all">All Types</option>
                <option value="user">User Actions</option>
                <option value="order">Orders</option>
                <option value="website">Websites</option>
                <option value="site_submission">Site Submissions</option>
                <option value="fund_request">Fund Requests</option>
                <option value="blog">Blog</option>
              </select>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent className="bg-white/5 border-white/10 text-white">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-secondary">
              Recent Activities ({filteredActivities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Loading activities...
                </h3>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No activities yet
                </h3>
                <p className="text-gray-400 mb-4">
                  User activities and system events will appear here
                </p>
                <p className="text-sm text-gray-400">
                  Activities include user registrations, orders, payments, and
                  system events
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity: ActivityType) => (
                  <div
                    key={activity._id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                            {activity.type}
                          </span>
                          {activity.userName && (
                            <span className="text-sm text-gray-400">
                              {activity.userName}
                            </span>
                          )}
                        </div>
                        <p className="text-white font-medium">
                          {activity.action}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {activity.description}
                        </p>
                      </div>
                      {activity.createdAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
