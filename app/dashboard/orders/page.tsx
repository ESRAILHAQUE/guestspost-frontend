"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  Package,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  Download,
  Calendar,
  DollarSign,
  LinkIcon,
  MessageCircleMore,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useOrders, useUpdateOrder } from "@/hooks/api/useOrders";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/types/api";

interface Order {
  id: string;
  userId: string;
  userName: string;
  item_name: string;
  price: number;
  status: "processing" | "completed" | "failed";
  date: string;
  created_at: string;
  orderDate?: string;
  description?: string;
  features?: string[];
  type: string;
  article?: string;
  file?: {
    name: string;
    type: string;
    size: number;
    data: string;
  };
  message?: string;
  submittedAt?: string;
  completionMessage?: string;
  completionLink?: string;
  completedAt?: string;
}

export default function MyOrders() {
  const queryClient = useQueryClient();
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  // Use React Query hooks
  const { data: orders = [], isLoading } = useOrders(userEmail || undefined);
  const updateOrderMutation = useUpdateOrder();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [processing, setProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "hover:bg-primary/30 bg-green-200 text-green-800";
      case "processing":
        return "hover:bg-primary/30 bg-blue-200 text-blue-800";
      case "failed":
        return "hover:bg-primary/30 bg-red-200 text-red-800";
      default:
        return "hover:bg-primary/30 bg-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "failed":
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  const handleViewMesaage = (order: Order) => {
    setSelectedOrder(order);
    setShowMessageDetails(true);
  };

  const handleSendMessage = async (id: string, message: string | undefined) => {
    if (!message) return;

    setProcessing(true);

    const updateData = {
      id: id,
      message: message,
      message_time: new Date().toISOString(),
    };

    try {
      await updateOrderMutation.mutateAsync(updateData);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.orders() });

      toast.success("Message Sent Successfully");
      setProcessing(false);
      setShowMessageDetails(false);

      // Navigate without reload
      window.location.href = "/dashboard/messages";
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to send Message");
    }
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

  const totalOrders = orders.length;
  const completedOrders =
    orders && orders.filter((order) => order.status === "completed").length;
  const processingOrders =
    orders && orders.filter((order) => order.status === "processing").length;
  const failedOrders =
    orders && orders.filter((order) => order.status === "failed").length;

  if (isLoading) {
    // console.log('user not found yet');

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
          <h1 className="text-3xl font-bold text-primary">My Orders</h1>
          <p className="text-gray-800 mt-2">Track and manage your orders</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalOrders}
              </div>
              <p className="text-xs text-gray-800 mt-1">All time orders</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {completedOrders}
              </div>
              <p className="text-xs text-gray-800 mt-1">
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Processing
              </CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {processingOrders}
              </div>
              <p className="text-xs text-gray-800 mt-1">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Failed
              </CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {failedOrders}
              </div>
              <p className="text-xs text-gray-800 mt-1">Unfortunately Failed</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders && orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary/70 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-800 mb-4">
                  Start browsing our catalog to place your first order
                </p>
                <Button
                  onClick={() => (window.location.href = "/catalog")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  Browse Catalog
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders &&
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">🛒</div>
                          <div>
                            <h3 className="font-medium text-primary">
                              {order.item_name}
                            </h3>
                            <p className="text-sm text-gray-800">
                              Order #{order.id}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-800 mt-1">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {order.date ||
                                  new Date(
                                    order.created_at
                                  ).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-blue-500">
                                <DollarSign className="w-4 h-4 mr-1 text-primary/40" />
                                {order.price}
                              </div>
                              {(order.article ||
                                order.file ||
                                order.message) && (
                                <div className="flex items-center text-green-600">
                                  <FileText className="w-4 h-4 mr-1" />
                                  Details Submitted
                                </div>
                              )}
                              {order.status === "completed" &&
                                (order.completionMessage ||
                                  order.completionLink) && (
                                  <div className="flex items-center text-blue-500">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Completed
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(order.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(order.status)}
                              <span>
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1).replace("-", " ")}
                              </span>
                            </div>
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMesaage(order)}
                            className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                            <MessageCircleMore className="w-4 h-4 mr-1" />
                            {/* View Details */}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
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

        {/* Order Details Modal */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="bg-neutral-300 border-neutral-600 text-primary max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <h3 className="font-semibold text-primary mb-2">
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-800">Order ID:</span> #
                        {selectedOrder.id}
                      </p>
                      <p>
                        <span className="text-gray-800">Item:</span>{" "}
                        {selectedOrder.item_name}
                      </p>
                      <p>
                        <span className="text-gray-800">Price:</span> $
                        {selectedOrder.price}
                      </p>
                      <p>
                        <span className="text-gray-800">Status:</span>
                        <Badge
                          className={`ml-2 ${getStatusColor(
                            selectedOrder.status
                          )}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(selectedOrder.status)}
                            <span>
                              {selectedOrder.status.charAt(0).toUpperCase() +
                                selectedOrder.status.slice(1).replace("-", " ")}
                            </span>
                          </div>
                        </Badge>
                      </p>
                      <p>
                        <span className="text-gray-800">Order Date:</span>{" "}
                        {selectedOrder.orderDate ||
                          new Date(
                            selectedOrder.created_at
                          ).toLocaleDateString()}
                      </p>
                      {selectedOrder.submittedAt && (
                        <p>
                          <span className="text-gray-800">
                            Details Submitted:
                          </span>{" "}
                          {new Date(selectedOrder.submittedAt).toLocaleString()}
                        </p>
                      )}
                      {selectedOrder.completedAt && (
                        <p>
                          <span className="text-gray-800">Completed:</span>{" "}
                          {new Date(selectedOrder.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary mb-2">
                      Item Description
                    </h3>
                    <p className="text-sm text-gray-800">
                      {selectedOrder.description}
                    </p>
                    {selectedOrder.features &&
                      selectedOrder.features.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-600 mb-2">
                            Features:
                          </h4>
                          <ul className="text-sm text-gray-800 space-y-1">
                            {(typeof selectedOrder?.features === "string"
                              ? JSON.parse(selectedOrder.features)
                              : selectedOrder?.features || []
                            ).map((feature: any, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
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
                      <div className="border-t border-primary/30 pt-6">
                        <h3 className="font-semibold text-primary mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                          Order Completion Details
                        </h3>

                        <div className="space-y-4">
                          {selectedOrder.completionMessage && (
                            <div>
                              <h4 className="font-medium text-gray-600 mb-2">
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
                              <h4 className="font-medium text-gray-600 mb-2">
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
                    <div className="border-t border-primary/30 pt-6">
                      <h3 className="font-semibold text-primary mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Your Submitted Details
                      </h3>

                      <div className="space-y-4">
                        {/* Article Content */}
                        {selectedOrder.article && (
                          <div>
                            <h4 className="font-medium text-gray-600 mb-2">
                              Article Content:
                            </h4>
                            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                {selectedOrder.article}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Uploaded File */}
                        {selectedOrder?.file &&
                          typeof selectedOrder.file === "object" && (
                            <div>
                              <h4 className="font-medium text-gray-600 mb-2">
                                Uploaded File:
                              </h4>
                              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                                    <div>
                                      <p className="text-sm font-medium text-primary">
                                        {selectedOrder.file?.name}
                                      </p>
                                      <p className="text-xs text-gray-800">
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
                            <h4 className="font-medium text-gray-600 mb-2 flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Your Message:
                            </h4>
                            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {selectedOrder.message}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-primary/30">
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

        {/* Message Details Modal */}
        <Dialog open={showMessageDetails} onOpenChange={setShowMessageDetails}>
          <DialogContent className="bg-neutral-300 border-neutral-600 text-primary max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Package className="w-6 h-6 mr-2" />
                Message - #{selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Basic Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-800">Order ID:</span> #
                        {selectedOrder.id}
                      </p>
                      <p>
                        <span className="text-gray-800">Item:</span>{" "}
                        {selectedOrder.item_name}
                      </p>
                      <p>
                        <span className="text-gray-800">Price:</span> $
                        {selectedOrder.price}
                      </p>
                      <p>
                        <span className="text-gray-800">Status:</span>
                        <Badge
                          className={`ml-2 ${getStatusColor(
                            selectedOrder.status
                          )}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(selectedOrder.status)}
                            <span>
                              {selectedOrder.status.charAt(0).toUpperCase() +
                                selectedOrder.status.slice(1).replace("-", " ")}
                            </span>
                          </div>
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary mb-2">Message</h3>
                    <form>
                      <Textarea
                        value={selectedOrder?.message}
                        onChange={(e) =>
                          setSelectedOrder({
                            ...selectedOrder,
                            message: e.target.value,
                          })
                        }
                        placeholder="Write Your message here..."
                        className="bg-white border-primary/20 text-primary placeholder-gray-400 resize-none"
                        rows={3}
                      />
                    </form>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-primary/30">
                  <Button
                    onClick={() => setShowOrderDetails(false)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Close
                  </Button>
                </div>
                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-primary/30">
                  <Button
                    type="submit"
                    onClick={() =>
                      handleSendMessage(
                        selectedOrder.id,
                        selectedOrder?.message
                      )
                    }
                    className="bg-white hover:text-primary/10 text-primary active:text-primary hover:bg-white active:bg-white">
                    {processing ? (
                      <p className="w-6 h-6 rounded-full animate-spin bg-transparent border-2 border-primary"></p>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
