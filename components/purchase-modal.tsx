"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  X,
  ShoppingCart,
  CreditCard,
  Upload,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useBalance } from "@/hooks/use-balance";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/api/useUsers";
import { useCreateOrder } from "@/hooks/api/useOrders";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { QueryKeys } from "@/types/api";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export function PurchaseModal({ isOpen, onClose, item }: PurchaseModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    article: "",
    file: null as File | null,
    message: "",
  });

  // Use React Query hooks
  const { data: user } = useCurrentUser();
  const { balance, deductBalance } = useBalance();
  const createOrderMutation = useCreateOrder();

  const userBalance = user ? Math.abs(user.balance || 0) : 0;

  const handlePurchase = async () => {
    setIsPurchasing(true);

    try {
      if (!user || !user.user_email) {
        toast.error("Please log in to make a purchase");
        onClose();
        return;
      }

      if (Math.abs(balance) < parseInt(item.price)) {
        const confirmAddFunds = confirm(
          `Insufficient balance. You need $${parseInt(
            item.price
          )} but have $${Math.abs(balance)}. Would you like to add funds?`
        );
        if (confirmAddFunds) {
          router.push("/dashboard/funds");
        }
        onClose();
        return;
      }

      // Simulate purchase delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate item.price
      if (
        typeof parseInt(item.price) !== "number" ||
        isNaN(item.price) ||
        item.price < 0
      ) {
        toast.error(
          "Invalid or missing item price. Please provide a valid price."
        );
        setIsPurchasing(false);
        return;
      }

      // Deduct balance
      const success = deductBalance(Math.floor(parseInt(item.price)));
      if (!success) {
        toast.error("Failed to process payment. Please try again.");
        setIsPurchasing(false);
        return;
      }

      setPurchaseComplete(true);
      setShowOrderDetails(true);
      toast.success("Purchase completed successfully");
    } catch (error) {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF, DOC, DOCX, or TXT file");
        return;
      }

      setOrderDetails((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmitOrder = async () => {
    try {
      setProcessing(true);

      // Convert file to base64
      let fileData = null;
      if (orderDetails.file) {
        const reader = new FileReader();
        fileData = await new Promise((resolve) => {
          reader.onload = () =>
            resolve({
              name: orderDetails.file!.name,
              type: orderDetails.file!.type,
              size: orderDetails.file!.size,
              data: reader.result,
            });
          reader.readAsDataURL(orderDetails.file!);
        });
      }

      const order = {
        id: Date.now().toString(),
        userId: user?.user_email,
        userName: user?.user_nicename || user?.user_email?.split("@")[0],
        itemName: item.name,
        price: parseInt(item.price),
        status: "processing",
        date: new Date().toISOString(),
        orderDate: new Date().toLocaleDateString(),
        description: item.description,
        features: item.features || [],
        type: item.type || "website",
        article: orderDetails.article || "",
        file: fileData || null,
        message: orderDetails.message || "",
        message_time: orderDetails.message ? new Date().toISOString() : null,
        submittedAt: new Date().toISOString(),
      };

      // Use React Query mutation
      await createOrderMutation.mutateAsync(order);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.orders() });
      if (user?.user_email) {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.orders(user.user_email),
        });
        queryClient.invalidateQueries({
          queryKey: QueryKeys.balance(user.user_email),
        });
      }

      setProcessing(false);
      toast.success("Order placed and email sent successfully");
      onClose();

      // Navigate to orders page
      router.push("/dashboard/orders");
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to submit order. Please try again.");
    }
  };

  const continueShopping = () => {
    onClose();
    // Refresh catalog data instead of full reload
    queryClient.invalidateQueries({ queryKey: QueryKeys.websites });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-300 border-primary/20 text-primary max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {purchaseComplete && showOrderDetails ? (
            <DialogTitle className="flex items-center text-green-500">
              <CheckCircle className="w-6 h-6 mr-2" />
              Purchase Successful! Complete Your Order
            </DialogTitle>
          ) : purchaseComplete ? (
            <DialogTitle className="flex items-center text-green-500">
              <CheckCircle className="w-6 h-6 mr-2" />
              Purchase Successful!
            </DialogTitle>
          ) : (
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Purchase Details
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-800 hover:text-gray-600">
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {purchaseComplete && showOrderDetails ? (
            <>
              <p className="text-gray-700">
                Your payment has been processed. Please provide the following
                details to complete your order:
              </p>

              {/* Article Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="article"
                  className="text-primary flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Article Content (Optional)
                </Label>
                <Textarea
                  id="article"
                  placeholder="Paste your article content here or leave blank if uploading a file..."
                  value={orderDetails.article}
                  onChange={(e) =>
                    setOrderDetails((prev) => ({
                      ...prev,
                      article: e.target.value,
                    }))
                  }
                  className="min-h-[120px] bg-primary/10 border-primary/20 text-primary placeholder-gray-500"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label
                  htmlFor="file"
                  className="text-primary flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File (Optional)
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="bg-primary/10 border-primary/20 text-primary file:bg-blue-500 file:text-primary file:border-0 file:rounded file:px-3 file:py-1"
                />
                {orderDetails.file && (
                  <p className="text-sm text-green-500">
                    ✓ File uploaded: {orderDetails.file.name} (
                    {(orderDetails.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="text-xs text-gray-800">
                  Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                </p>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-primary flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Additional Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Any special instructions or requirements..."
                  value={orderDetails.message}
                  onChange={(e) =>
                    setOrderDetails((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="bg-primary/10 border-primary/20 text-primary placeholder-gray-500"
                />
              </div>

              <Separator className="bg-primary/30" />

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  disabled={processing}
                  onClick={handleSubmitOrder}
                  className="flex-1 border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                  Skip & Continue
                </Button>
                <Button
                  onClick={handleSubmitOrder}
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  {processing ? "Submitting..." : "Submit Order Details"}
                </Button>
              </div>
            </>
          ) : purchaseComplete ? (
            <div className="text-center py-6">
              <p className="text-gray-700 mb-4">
                Your order has been placed successfully. You will receive an
                email confirmation shortly.
              </p>
              <Button
                onClick={continueShopping}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {item && (
                <>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-700 mb-4">{item.description}</p>

                    {item.features && item.features.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-600">
                          Included Features:
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {item.features.map(
                            (feature: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                {feature}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-primary/30" />

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Your Balance:</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-500">
                        ${Math.abs(balance) || Math.abs(userBalance)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Total Amount:</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-500">
                        ${item.price || 0}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-400 mt-1">
                        One-time payment
                      </Badge>
                    </div>
                  </div>

                  <Separator className="bg-primary/30" />

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 border-bg-primary/20 text-primary hover:bg-primary/10 bg-transparent">
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePurchase}
                      disabled={
                        isPurchasing || Math.abs(balance) < parseInt(item.price)
                      }
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      {isPurchasing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : Math.abs(balance) < parseInt(item.price) ? (
                        "Insufficient Balance"
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Complete Purchase
                        </>
                      )}
                    </Button>
                  </div>
                  {Math.abs(userBalance) < parseInt(item.price) && (
                    <div className="text-center">
                      <p className="text-red-500 text-sm mb-2">
                        You need ${parseInt(item.price) - Math.abs(balance)}{" "}
                        more to complete this purchase.
                      </p>
                      <Button
                        onClick={() => router.push("/dashboard/funds")}
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500/10">
                        Add Funds
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
