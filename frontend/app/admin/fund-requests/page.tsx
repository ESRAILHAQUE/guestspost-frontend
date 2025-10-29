"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Search,
  RefreshCw,
  Check,
  X,
  Clock,
  Mail,
  CreditCard,
} from "lucide-react";
import {
  useFundRequests,
  useUpdateFundRequest,
} from "@/hooks/api/useFundRequests";
import { FundRequest } from "@/types/api";
import { toast } from "sonner";

export default function AdminFundRequests() {
  const [filteredRequests, setFilteredRequests] = useState<FundRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Use new API hooks
  const { data: requests = [], isLoading, refetch } = useFundRequests();
  const updateFundRequestMutation = useUpdateFundRequest();

  useEffect(() => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.paypalEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter]);

  const updateRequestStatus = async (
    requestId: string,
    newStatus: "invoice-sent" | "paid" | "rejected",
    notes?: string
  ) => {
    try {
      const updateData = {
        id: requestId,
        status: newStatus,
        processedDate: new Date().toISOString(),
        notes: notes || "",
      };

      await updateFundRequestMutation.mutateAsync(updateData);
      toast.success(`Fund request ${requestId} status updated to ${newStatus}`);
      refetch(); // Refresh the fund requests list
    } catch (error: any) {
      toast.error(
        `Error updating fund request status: ${error.message || error}`
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Pending
          </Badge>
        );
      case "invoice-sent":
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            Invoice Sent
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            Paid
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            Rejected
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

  // console.log('Request', requests);

  const stats = {
    total: requests && requests.length,
    pending: requests && requests.filter((r) => r.status === "pending").length,
    invoiceSent:
      requests && requests.filter((r) => r.status === "invoice-sent").length,
    paid: requests && requests.filter((r) => r.status === "paid").length,
    rejected:
      requests && requests.filter((r) => r.status === "rejected").length,
    totalAmount:
      requests &&
      requests
        .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0)
        .toFixed(2),
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Fund Requests</h1>
            <p className="text-gray-300 mt-2">
              Manage user fund addition requests
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Invoice Sent
              </CardTitle>
              <Mail className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.invoiceSent}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Paid
              </CardTitle>
              <Check className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.paid}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Rejected
              </CardTitle>
              <X className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.rejected}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                $
                {stats.totalAmount &&
                  Math.floor(parseInt(stats.totalAmount.toLocaleString()))}
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
                    placeholder="Search by user name, email, or PayPal..."
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
                  className="w-full bg-white/10 border-white/20 text-white rounded-md px-3 py-2 h-10">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="invoice-sent">Invoice Sent</option>
                  <option value="paid">Paid</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fund Requests Table */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              Fund Requests ({filteredRequests && filteredRequests.length})
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLoading
                ? "Loading fund requests..."
                : `Showing ${filteredRequests && filteredRequests.length} of ${
                    requests && requests.length
                  } requests`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-gray-300">Loading fund requests...</p>
              </div>
            ) : filteredRequests && filteredRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">
                        PayPal Email
                      </TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">
                        Request Date
                      </TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests &&
                      filteredRequests.map((request) => (
                        <TableRow key={request.id} className="border-white/20">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-white font-medium">
                                {request.userName}
                              </span>
                              <span className="text-gray-400 text-sm">
                                {request.userEmail}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white font-bold">
                            ${request.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {request.paypalEmail}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(request.requestDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {request.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateRequestStatus(
                                      request.id,
                                      "invoice-sent"
                                    )
                                  }
                                  className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Send Invoice
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateRequestStatus(request.id, "rejected")
                                  }
                                  className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30">
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {request.status === "invoice-sent" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateRequestStatus(request.id, "paid")
                                  }
                                  className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30">
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  Mark as Paid
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateRequestStatus(request.id, "rejected")
                                  }
                                  className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30">
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {(request.status === "paid" ||
                              request.status === "rejected") && (
                              <span className="text-gray-400 text-sm">
                                {request.processedDate
                                  ? new Date(
                                      request.processedDate
                                    ).toLocaleDateString()
                                  : "Processed"}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-400 text-lg mb-4">
                  No fund requests found
                </div>
                <p className="text-gray-500 mb-6">
                  {requests && requests.length === 0
                    ? "No fund requests have been submitted yet."
                    : "No requests match your current filters."}
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
