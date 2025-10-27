"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  ShoppingBag,
  Package,
  CheckCircle,
  Eye,
  FileText,
  MessageSquare,
  Download,
  Calendar,
  DollarSign,
  User,
  LinkIcon,
  RefreshCcw,
} from "lucide-react";
import { useOrders, useUpdateOrder } from "@/hooks/api/useOrders";
import { Order } from "@/types/api";
import { toast } from "sonner";

export default function AdminOrders() {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completionData, setCompletionData] = useState({
    message: "",
    link: "",
  });

  // Use new API hooks
  const { data: orders = [], isLoading, refetch } = useOrders();
  const updateOrderMutation = useUpdateOrder();

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    if (newStatus === "completed") {
      // Show completion dialog for completed orders
      const order = orders && orders?.find((o) => o.id === orderId);

      if (order) {
        setSelectedOrder(order);
        setCompletionData({ message: "", link: "" });
        setShowCompletionDialog(true);
      }
      return;
    }
    // For other status updates, proceed normally
    performStatusUpdate(orderId, newStatus);
  };

  const performStatusUpdate = async (
    id: string,
    newStatus: string,
    completionMessage?: string,
    completionLink?: string
  ) => {
    try {
      const updateData: any = {
        id: id,
        status: newStatus,
      };

      if (newStatus === "completed") {
        updateData.completionMessage = completionMessage;
        updateData.completionLink = completionLink;
        updateData.completedAt = new Date().toISOString();
      } else {
        updateData.updatedAt = new Date().toISOString();
      }

      await updateOrderMutation.mutateAsync(updateData);
      toast.success(`Order ${id} status updated to ${newStatus}`);
      refetch(); // Refresh the orders list
    } catch (error: any) {
      toast.error(`Error updating order status: ${error.message || error}`);
    }
  };

  const handleCompleteOrder = () => {
    if (selectedOrder) {
      performStatusUpdate(
        selectedOrder.id,
        "completed",
        completionData.message,
        completionData.link
      );
      setShowCompletionDialog(false);
      setCompletionData({ message: "", link: "" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleDownloadFile = (file: any) => {
    try {
      const link = document.createElement("a");
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const totalRevenue =
    orders &&
    orders.reduce((sum, order) => sum + Math.floor(order.total_amount), 0);
  const completedOrders =
    orders && orders.filter((order) => order.status === "completed").length;
  const processingOrders =
    orders && orders.filter((order) => order.status === "processing").length;
  const failedOrders =
    orders && orders.filter((order) => order.status === "failed").length;
  const ordersWithDetails =
    orders &&
    orders.filter((order) => order.article || order.file || order.message)
      .length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Orders Management</h1>
            <p className="text-gray-400 mt-2">
              View and manage all user orders
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {orders?.length}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {ordersWithDetails} with submitted details
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Revenue
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${totalRevenue?.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-1">From all orders</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {completedOrders}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Processing
              </CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {processingOrders}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Currently in progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders by ID, user, or item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40 bg-white/10 border-white/20 text-white rounded-md px-3 py-2 h-10"
              >
                <option value="all">All Status</option>
                <option value="processing">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              Orders ({filteredOrders?.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 w-fit flex flex-col gap-1 mx-auto items-center justify-center">
                <p className="text-secondary h-5 w-5 animate-spin">
                  <RefreshCcw />
                </p>
                <p className="text-gray-400 mb-4 flex gap-2 w-fit mx-auto">
                  {/* <p className="animate-spin rounded-full h-6 w-6 border-white border mx-auto mb-4"></p> */}
                  Loading Orders...
                </p>
              </div>
            ) : filteredOrders?.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {orders?.length === 0
                    ? "No orders yet"
                    : "No orders match your filters"}
                </h3>
                <p className="text-gray-400 mb-4">
                  {orders?.length === 0
                    ? "Orders will appear here when users make purchases"
                    : "Try adjusting your search or filter criteria"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders?.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">🛒</div>
                        <div>
                          <h3 className="font-medium text-white">
                            {order.itemName}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Order #{order.id}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {order.userName}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {order.orderDate ||
                                new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {Math.floor(order.price)}
                            </div>
                            {(order.article || order.file || order.message) && (
                              <div className="flex items-center text-green-400">
                                <FileText className="w-4 h-4 mr-1" />
                                Details Submitted
                              </div>
                            )}
                            {order.completionMessage && (
                              <div className="flex items-center text-blue-400">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Completion Details
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1).replace("-", " ")}
                        </Badge>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            updateOrderStatus(order.id, value)
                          }>
                          <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Completion Dialog */}
        <Dialog
          open={showCompletionDialog}
          onOpenChange={setShowCompletionDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-400">
                <CheckCircle className="w-6 h-6 mr-2" />
                Complete Order - #{selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <p className="text-gray-300">
                Add a completion message and optional link for the customer.
                This will be visible in their order details.
              </p>

              {/* Completion Message */}
              <div className="space-y-2">
                <Label
                  htmlFor="completion-message"
                  className="text-white flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Completion Message
                </Label>
                <Textarea
                  id="completion-message"
                  placeholder="Your order has been completed successfully. Thank you for your business!"
                  value={completionData.message}
                  onChange={(e) =>
                    setCompletionData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Completion Link */}
              <div className="space-y-2">
                <Label
                  htmlFor="completion-link"
                  className="text-white flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Completion Link (Optional)
                </Label>
                <Input
                  id="completion-link"
                  type="url"
                  placeholder="https://example.com/your-completed-work"
                  value={completionData.link}
                  onChange={(e) =>
                    setCompletionData((prev) => ({
                      ...prev,
                      link: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400">
                  Provide a link to the completed work, deliverables, or any
                  relevant resources
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCompletionDialog(false)}
                  className="flex-1 border-slate-600 text-white hover:bg-slate-700 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleCompleteOrder}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Order Details Modal */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Package className="w-6 h-6 mr-2" />
                Order Details - #{selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Basic Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-400">Customer:</span>{" "}
                        {selectedOrder.userName}
                      </p>
                      <p>
                        <span className="text-gray-400">Email:</span>{" "}
                        {selectedOrder.userEmail}
                      </p>
                      <p>
                        <span className="text-gray-400">Item:</span>{" "}
                        {selectedOrder.itemName}
                      </p>
                      <p>
                        <span className="text-gray-400">Price:</span> $
                        {Math.floor(selectedOrder.price)}
                      </p>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <Badge
                          className={`ml-2 ${getStatusColor(
                            selectedOrder.status
                          )}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() +
                            selectedOrder.status.slice(1).replace("-", " ")}
                        </Badge>
                      </div>
                      <p>
                        <span className="text-gray-400">Order Date:</span>{" "}
                        {selectedOrder.orderDate ||
                          new Date(
                            selectedOrder.createdAt
                          ).toLocaleDateString()}
                      </p>
                      {selectedOrder.submittedAt && (
                        <p>
                          <span className="text-gray-400">
                            Details Submitted:
                          </span>{" "}
                          {new Date(selectedOrder.submittedAt).toLocaleString()}
                        </p>
                      )}
                      {selectedOrder.completedAt && (
                        <p>
                          <span className="text-gray-400">Completed:</span>{" "}
                          {new Date(selectedOrder.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Item Description
                    </h3>
                    <p className="text-sm text-gray-300">
                      {selectedOrder.description}
                    </p>
                    {selectedOrder.features &&
                      selectedOrder.features.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-200 mb-2">
                            Features:
                          </h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {(typeof selectedOrder?.features === "string"
                              ? JSON.parse(selectedOrder.features)
                              : selectedOrder?.features || []
                            ).map((feature: any, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>

                {/* Completion Details */}
                {selectedOrder.status === "completed" &&
                  (selectedOrder.completionMessage ||
                    selectedOrder.completionLink) && (
                    <>
                      <div className="border-t border-slate-700 pt-6">
                        <h3 className="font-semibold text-white mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                          Order Completion Details
                        </h3>

                        <div className="space-y-4">
                          {selectedOrder.completionMessage && (
                            <div>
                              <h4 className="font-medium text-gray-200 mb-2">
                                Completion Message:
                              </h4>
                              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                  {selectedOrder.completionMessage}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedOrder.completionLink && (
                            <div>
                              <h4 className="font-medium text-gray-200 mb-2">
                                Completion Link:
                              </h4>
                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <a
                                  href={selectedOrder.completionLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline flex items-center">
                                  <LinkIcon className="w-4 h-4 mr-2" />
                                  {selectedOrder.completionLink}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                {/* Submitted Details */}
                {(selectedOrder.article ||
                  selectedOrder.file ||
                  selectedOrder.message) && (
                  <>
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="font-semibold text-white mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Customer Submitted Details
                      </h3>

                      <div className="space-y-4">
                        {/* Article Content */}
                        {selectedOrder.article && (
                          <div>
                            <h4 className="font-medium text-gray-200 mb-2">
                              Article Content:
                            </h4>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                                {selectedOrder.article}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Uploaded File */}
                        {selectedOrder?.file &&
                          typeof selectedOrder.file === "object" && (
                            <div>
                              <h4 className="font-medium text-gray-200 mb-2">
                                Uploaded File:
                              </h4>
                              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                                    <div>
                                      <p className="text-sm font-medium text-white">
                                        {selectedOrder.file?.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {selectedOrder.file?.type} •{" "}
                                        {selectedOrder.file?.size &&
                                          (
                                            selectedOrder.file.size /
                                            1024 /
                                            1024
                                          ).toFixed(2)}{" "}
                                        MB
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleDownloadFile(selectedOrder.file)
                                    }
                                    className="bg-blue-500 hover:bg-blue-600">
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Message */}
                        {selectedOrder.message && (
                          <div>
                            <h4 className="font-medium text-gray-200 mb-2 flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Customer Message:
                            </h4>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                {selectedOrder.message}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Status Update */}
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-200">
                        Update Order Status:
                      </h4>
                      <p className="text-sm text-gray-400">
                        Change the status of this order
                      </p>
                    </div>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => {
                        if (value === "completed") {
                          setShowOrderDetails(false);
                          updateOrderStatus(selectedOrder.id, value);
                        } else {
                          performStatusUpdate(selectedOrder.id, value);
                          setSelectedOrder({
                            ...selectedOrder,
                            status: value as any,
                          });
                        }
                      }}>
                      <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-slate-700">
                  <Button
                    onClick={() => setShowOrderDetails(false)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
