"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import { useUsers, useUpdateUser } from "@/hooks/api/useUsers";
import { toast } from "sonner";
import { User } from "@/types/api";

export default function AdminUsers() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Use new API hooks
  const { data: users = [], isLoading, refetch } = useUsers();
  const updateUserMutation = useUpdateUser();

  // Memoize filtered users to prevent unnecessary re-renders
  const memoizedFilteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.user_nicename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.user_status === statusFilter);
    }

    return filtered;
  }, [users, searchTerm, statusFilter]);

  // Update filtered users when memoized value changes
  useEffect(() => {
    setFilteredUsers(memoizedFilteredUsers);
  }, [memoizedFilteredUsers]);

  const updateUserStatus = async (
    userId: string,
    newStatus: "active" | "inactive" | "suspended"
  ) => {
    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        user_status: newStatus,
      });
      toast.success(`Updated user ${userId} status to ${newStatus}`);
      refetch(); // Refresh the users list
    } catch (error: any) {
      toast.error(`Error updating user status: ${error.message || error}`);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Status",
        "Registration Date",
        "Last Login",
        "Balance",
        "Total Orders",
      ],
      ...filteredUsers.map((user) => [
        user.user_nicename,
        user.user_email,
        user.user_status,
        new Date(user.registration_date || new Date()).toLocaleDateString(),
        "Never", // Last login not available in current backend
        Math.abs(user.balance).toString(),
        "0", // Total orders - would need to fetch separately
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
            Inactive
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            Suspended
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
            Unknown
          </Badge>
        );
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.user_status === "active").length,
    inactive: users.filter((u) => u.user_status === "inactive").length,
    suspended: users.filter((u) => u.user_status === "suspended").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-300 mt-2">
              Manage and monitor all registered users
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Active Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.active}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Inactive Users
              </CardTitle>
              <UserX className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.inactive}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Suspended
              </CardTitle>
              <UserX className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.suspended}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              Users ({filteredUsers.length})
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLoading
                ? "Loading users..."
                : `Showing ${filteredUsers.length} of ${users.length} users`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-gray-300">Loading users...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">
                        Registration
                      </TableHead>
                      <TableHead className="text-gray-300">Balance</TableHead>
                      <TableHead className="text-gray-300">Orders</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.ID} className="border-white/20">
                        <TableCell className="text-white font-medium">
                          {user.user_nicename}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {user.user_email}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.user_status || "inactive")}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(
                            user.registration_date || new Date()
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          ${Math.abs(user.balance).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-300">0</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {user.user_status !== "active" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateUserStatus(user.ID, "active")
                                }
                                className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30">
                                Activate
                              </Button>
                            )}
                            {user.user_status !== "suspended" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateUserStatus(user.ID, "suspended")
                                }
                                className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30">
                                Suspend
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredUsers.length > 0 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                      Previous
                    </Button>
                    <div className="flex gap-2">
                      {Array.from(
                        { length: Math.ceil(users.length / itemsPerPage) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          className={`${
                            currentPage === page
                              ? "bg-blue-500 text-white"
                              : "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          }`}>
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={
                        currentPage >= Math.ceil(users.length / itemsPerPage)
                      }
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-400 text-lg mb-4">No users found</div>
                <p className="text-gray-500 mb-6">
                  {users.length === 0
                    ? "No users have registered yet."
                    : "No users match your current filters."}
                </p>
                {searchTerm || statusFilter !== "all" ? (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    Clear Filters
                  </Button>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
