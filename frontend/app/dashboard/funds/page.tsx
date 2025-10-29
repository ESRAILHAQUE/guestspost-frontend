"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useBalance } from "@/hooks/use-balance";
import {
  DollarSign,
  Plus,
  History,
  Gift,
  FileText,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/api/useUsers";
import {
  useFundRequests,
  useCreateFundRequest,
} from "@/hooks/api/useFundRequests";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/types/api";
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface FundRequest {
  id: string;
  amount: number;
  paypalEmail?: string;
  // stripePaymentMethodId?: string;
  // paymentMethod: 'paypal' | 'stripe';
  status: "pending" | "invoice-sent" | "paid" | "rejected";
  requestDate: string;
  notes?: string;
  adminNotes?: string;
  processedDate?: string;
  processedBy?: string;
}

export default function FundsPage() {
  const queryClient = useQueryClient();
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  // Use React Query hooks
  const { balance } = useBalance();
  const { data: user } = useCurrentUser();
  const { data: fundRequests = [] } = useFundRequests(userEmail || undefined);
  const createFundRequestMutation = useCreateFundRequest();

  const [requestAmount, setRequestAmount] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "stripe">(
    "paypal"
  );
  const [requestNotes, setRequestNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("add-funds");

  const predefinedAmounts = [
    50, 100, 250, 500, 1000, 2500, 5000, 10000, 15000, 20000,
  ];
  // console.log('funds', balance);
  // const stripe = useStripe();
  // const elements = useElements();

  // Removed - now using React Query hooks

  const calculateBonus = (amount: number) => {
    if (amount >= 50 && amount <= 9999) {
      return Math.floor(amount * 0.05); // 5% bonus
    } else if (amount >= 10000 && amount <= 20000) {
      return Math.floor(amount * 0.1); // 10% bonus
    }
    return 0;
  };

  const handleAmountClick = (amount: number) => {
    // Set the amount and switch to Request Fund tab
    setRequestAmount(amount.toString());
    setActiveTab("request-funds");
  };

  // Paypal Payment
  const handleSubmitFundRequest = async () => {
    // console.log('start');

    const amount = Number.parseFloat(requestAmount);
    // console.log(amount, 'start');

    if (!amount || amount < 50 || amount > 20000) {
      alert("Please enter a valid amount between $50 and $20,000");
      return;
    }

    if (paymentMethod === "paypal" && !paypalEmail.trim()) {
      alert("Please enter your PayPal email address");
      return;
    }

    if (paymentMethod === "paypal" && !/\S+@\S+\.\S+/.test(paypalEmail)) {
      alert("Please enter a valid PayPal email address");
      return;
    }

    // if (paymentMethod === 'stripe' && !stripe || !elements) {
    //   alert('Stripe is not loaded');
    //   return;
    // }

    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error("User not found");
        return;
      }

        // Handle Stripe payment
        // if (paymentMethod === 'stripe') {
        //   const cardElement = elements.getElement(CardElement);
        //   if (!cardElement) {
        //     alert('Card input not found');
        //     setIsSubmitting(false);
        //     return;
        //   }
        //   const { error, paymentMethod } = await stripe?.createPaymentMethod({
        //     type: 'card',
        //     card: cardElement,
        //   });
        //   if (error) {
        //     alert(error.message);
        //     setIsSubmitting(false);
        //     return;
        //   }
        //   stripePaymentMethodId = paymentMethod.id;
        // }

      const requestId = `req_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const currentDate = new Date().toLocaleDateString();

                const adminRequest = {
                  id: requestId,
                  userId: user.ID,
                  userName: user.user_nicename,
                  userEmail: user.user_email,
                  amount,
        paypalEmail:
          paymentMethod === "paypal" ? paypalEmail.trim() : undefined,
        status: "pending",
                  requestDate: currentDate,
                  notes: requestNotes.trim() || undefined,
                  userDetails: {
                    name: user.user_nicename,
                    email: user.user_email,
                  },
                };

      try {
        await createFundRequestMutation.mutateAsync(adminRequest);

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: QueryKeys.fundRequests() });
        if (user.user_email) {
          queryClient.invalidateQueries({
            queryKey: QueryKeys.fundRequests(user.user_email),
          });
        }
            
            // Reset form
        setRequestAmount("");
        setPaypalEmail("");
        setRequestNotes("");

        toast.success(
          "Your fund request has been submitted successfully! You will receive a PayPal invoice within 30 minutes."
        );
          } catch (error) {
            toast.error("Error in Submitting Fund Request");
      }
    } catch (error) {
      toast.error(`Error submitting fund request: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stripe Payment
  // const handleStripePayment = async (orderId: string, amount: number) => {
  //   const stripe = await stripePromise;
  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: 'card',
  //     card: /* Your card element */,
  //   });
  //   if (!error && paymentMethod) {
  //     const res = await fetch('/guestpost-backend/stripe-charge.php', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ payment_method_id: paymentMethod.id, amount }),
  //     });
  //     const result = await res.json();
  //     if (result.success) {
  //       // Success: Update order in CRUD via another fetch
  //       await fetch(`/guestpost-backend/update-order.php?id=${orderId}&status=paid`);
  //       router.push('/success');
  //     } else {
  //       alert(result.error);
  //     }
  //   }
  // };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "invoice-sent":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "invoice-sent":
        return "bg-blue-200 text-blue-800";
      case "paid":
        return "bg-green-200 text-green-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "invoice-sent":
        return "Invoice Sent";
      case "paid":
        return "Paid";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Account Funds</h1>
          <p className="text-gray-800">
            Add funds to your account via PayPal invoice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Balance */}
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Current Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ${Math.abs(balance)}.00
              </div>
              <p className="text-xs text-gray-800 mt-2">Available for orders</p>
            </CardContent>
          </Card>

          {/* Bonus Info */}
          <Card className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-500">
                Bonus Structure
              </CardTitle>
              <Gift className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-purple-500">
                  $50 - $9,999: <span className="font-bold">5% Bonus</span>
                </div>
                <div className="text-sm text-purple-500">
                  $10,000 - $20,000:{" "}
                  <span className="font-bold">10% Bonus</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-primary/10">
            <TabsTrigger
              value="add-funds"
              className="data-[state=active]:bg-blue-500 text-primary hover:text-primary/50">
              Select Amount
            </TabsTrigger>
            <TabsTrigger
              value="request-funds"
              className="data-[state=active]:bg-blue-500 text-primary hover:text-primary/50">
              Request Funds
            </TabsTrigger>
            <TabsTrigger
              value="pending-requests"
              className="data-[state=active]:bg-blue-500 text-primary hover:text-primary/50">
              My Requests
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-blue-500 text-primary hover:text-primary/50">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-funds">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Select Amount
                </CardTitle>
                <p className="text-gray-800 text-sm">
                  Select an amount to proceed with your fund request.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => handleAmountClick(amount)}
                        className="h-12 border-primary/30 text-primary hover:bg-primary/10 bg-transparent shadow-md">
                        ${amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* 
          <TabsContent value="request-funds">
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Request Funds via PayPal Invoice
                </CardTitle>
                <p className="text-gray-800 text-sm">Submit a fund request and receive a PayPal invoice for payment.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="request-amount" className="text-gray-700">
                      Amount ($)
                    </Label>
                    <Input
                      id="request-amount"
                      type="number"
                      placeholder="Enter amount (50-20000)"
                      value={requestAmount}
                      onChange={(e) => setRequestAmount(e.target.value)}
                      min="50"
                      max="20000"
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-800 mt-1">Minimum: $50, Maximum: $20,000</p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Estimated Bonus</Label>
                    <div className="h-10 flex items-center px-3 bg-primary/10 border border-primary/20 rounded-md">
                      <span className="text-sm font-medium text-green-500">
                        +${calculateBonus(Number.parseFloat(requestAmount) || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="paypal-email" className="text-gray-700">
                    PayPal Email Address
                  </Label>
                  <Input
                    id="paypal-email"
                    type="email"
                    placeholder="Enter your PayPal email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-800 mt-1">We'll send the invoice to this email address</p>
                </div>

                <div>
                  <Label htmlFor="request-notes" className="text-gray-700">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="request-notes"
                    placeholder="Add any special instructions or notes..."
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    rows={3}
                    className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400 resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmitFundRequest}
                  disabled={!requestAmount || !paypalEmail || isSubmitting}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary"
                >
                  {isSubmitting ? "Submitting..." : "Submit Fund Request"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* <Elements stripe={stripePromise}> */}
          <TabsContent value="request-funds">
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Request Funds
                </CardTitle>
                <p className="text-gray-800 text-sm">
                  Choose PayPal (invoice) or Stripe (card payment).
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* <div>
                    <Label className="text-gray-700">Payment Method</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="mr-2"
                        />
                        PayPal
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="stripe"
                          checked={paymentMethod === 'stripe'}
                          onChange={() => setPaymentMethod('stripe')}
                          className="mr-2"
                        />
                        Stripe (Card)
                      </label>
                    </div>
                  </div> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="request-amount" className="text-gray-700">
                      Amount ($)
                    </Label>
                    <Input
                      id="request-amount"
                      type="number"
                      placeholder="Enter amount (50-20000)"
                      value={requestAmount}
                      onChange={(e) => setRequestAmount(e.target.value)}
                      min="50"
                      max="20000"
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-800 mt-1">
                      Minimum: $50, Maximum: $20,000
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Estimated Bonus</Label>
                    <div className="h-10 flex items-center px-3 bg-primary/10 border border-primary/20 rounded-md">
                      <span className="text-sm font-medium text-green-500">
                        +$
                        {calculateBonus(Number.parseFloat(requestAmount) || 0)}
                      </span>
                    </div>
                  </div>
                </div>
                {paymentMethod === "paypal" && (
                  <div>
                    <Label htmlFor="paypal-email" className="text-gray-700">
                      PayPal Email Address
                    </Label>
                    <Input
                      id="paypal-email"
                      type="email"
                      placeholder="Enter your PayPal email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-800 mt-1">
                      We'll send the invoice to this email address
                    </p>
                  </div>
                )}
                {/* {paymentMethod === 'stripe' && (
                    <div>
                      <Label className="text-gray-700">Card Details</Label>
                      <CardElement
                        className="p-3 bg-primary/10 border border-primary/20 rounded-md"
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#1a1a1a',
                              '::placeholder': { color: '#a0aec0' },
                            },
                          },
                        }}
                      />
                      <p className="text-xs text-gray-800 mt-1">Securely enter your card details</p>
                    </div>
                  )} */}
                <div>
                  <Label htmlFor="request-notes" className="text-gray-700">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="request-notes"
                    placeholder="Add any special instructions or notes..."
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    rows={3}
                    className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400 resize-none"
                  />
                </div>
                <Button
                  onClick={handleSubmitFundRequest}
                  disabled={
                    !requestAmount ||
                    (paymentMethod === "paypal" && !paypalEmail) ||
                    isSubmitting
                  }
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary">
                  {isSubmitting
                    ? "Submitting..."
                    : `Submit via ${
                        paymentMethod === "paypal" ? "PayPal" : "Stripe"
                      }`}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          {/* </Elements> */}

          <TabsContent value="pending-requests">
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  My Fund Requests ({fundRequests && fundRequests?.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fundRequests && fundRequests?.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                    <p className="text-gray-800">
                      No fund requests submitted yet
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Your fund requests will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fundRequests &&
                      fundRequests
                        .sort(
                          (a, b) =>
                            new Date(b.requestDate).getTime() -
                            new Date(a.requestDate).getTime()
                        )
                      .map((request) => (
                          <div
                            key={request?.id}
                            className="border border-primary/10 rounded-lg p-4 bg-primary/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(request?.status)}
                                <span className="font-medium text-primary">
                                  ${request?.amount?.toLocaleString()}
                                </span>
                                <Badge
                                  className={getStatusColor(request?.status)}>
                                  {getStatusText(request?.status)}
                                </Badge>
                            </div>
                              <span className="text-sm text-gray-800">
                                {request?.requestDate}
                              </span>
                          </div>
                            <p className="text-sm text-gray-700 mb-2">
                              PayPal: {request?.paypalEmail}
                            </p>
                            {request?.notes && (
                              <p className="text-sm text-gray-700 mb-2">
                                Notes: {request?.notes}
                              </p>
                            )}
                          {request?.adminNotes && (
                              <p className="text-sm text-blue-500">
                                Admin Notes: {request?.adminNotes}
                              </p>
                          )}
                          {request?.processedDate && (
                            <p className="text-xs text-gray-500 mt-2">
                                Processed on {request?.processedDate} by{" "}
                                {request?.processedBy}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Complete Fund Request History
                </CardTitle>
                <p className="text-gray-800 text-sm">
                  All your fund requests are permanently saved here
                </p>
              </CardHeader>
              <CardContent>
                {fundRequests && fundRequests?.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                    <p className="text-gray-800">No fund request history yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Your complete fund request history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fundRequests &&
                      fundRequests
                        .sort(
                          (a, b) =>
                            new Date(b.requestDate).getTime() -
                            new Date(a.requestDate).getTime()
                        )
                      .map((request) => (
                          <div
                            key={request?.id}
                            className="border border-primary/10 rounded-lg p-4 bg-primary/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(request?.status)}
                                <span className="font-medium text-primary">
                                  ${request?.amount?.toLocaleString()}
                                </span>
                                <Badge
                                  className={getStatusColor(request?.status)}>
                                  {getStatusText(request?.status)}
                                </Badge>
                            </div>
                              <span className="text-sm text-gray-800">
                                {request?.requestDate}
                              </span>
                          </div>
                            <p className="text-sm text-gray-700 mb-2">
                              PayPal: {request?.paypalEmail}
                            </p>
                            {request?.notes && (
                              <p className="text-sm text-gray-700 mb-2">
                                Notes: {request?.notes}
                              </p>
                            )}
                          {request?.adminNotes && (
                              <p className="text-sm text-blue-500 mb-2">
                                Admin Notes: {request?.adminNotes}
                              </p>
                          )}
                          {request?.processedDate && (
                            <p className="text-xs text-gray-500">
                                Processed on {request?.processedDate} by{" "}
                                {request?.processedBy}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { DashboardLayout } from "@/components/dashboard-layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { useBalance } from "@/hooks/use-balance";
// import { DollarSign, Plus, History, Gift, FileText, Send, Clock, CheckCircle, XCircle, Mail } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// interface FundRequest {
//   id: string;
//   amount: number;
//   paypalEmail?: string;
//   stripePaymentMethodId?: string;
//   stripePaymentId?: string;
//   paymentMethod: 'paypal' | 'stripe';
//   status: 'pending' | 'invoice-sent' | 'paid' | 'rejected';
//   requestDate: string;
//   notes?: string;
//   adminNotes?: string;
//   processedDate?: string;
//   processedBy?: string;
// }

// export default function FundsPage() {
//   const router = useRouter();
//   const { balance } = useBalance();
//   const [requestAmount, setRequestAmount] = useState("");
//   const [user, setUser] = useState<any>(null);
//   const [userBalance, setUserBalance] = useState(0);
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const [paypalEmail, setPaypalEmail] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');
//   const [requestNotes, setRequestNotes] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fundRequests, setFundRequests] = useState<FundRequest[]>([]);
//   const [activeTab, setActiveTab] = useState("add-funds");
//   const [stripeLoading, setStripeLoading] = useState(true);

//   const stripe = useStripe();
//   const elements = useElements();

//   const predefinedAmounts = [50, 100, 250, 500, 1000, 2500, 5000, 10000, 15000, 20000];

//   useEffect(() => {
//     if (stripe && elements) {
//       setStripeLoading(false);
//     }
//   }, [stripe, elements]);

//   // Load User
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("https://guestpostnow.io/guestpost-backend/users.php", {
//           method: "GET",
//           credentials: "include",
//         });
//         const userData = await response.json();
//         if (userData) {
//           const user_id = localStorage.getItem('user_id');
//           const user = userData.find((user: any) => user.user_email === user_id);
//           if (user) {
//             setUser(user);
//             setUserBalance(user.balance);
//             setUserEmail(user.user_email);
//           }
//         }
//       } catch (error) {
//         toast.error("Error fetching user data");
//       }
//     };
//     fetchUser();
//   }, []);

//   // Load existing fund requests
//   useEffect(() => {
//     const loadFundRequests = async () => {
//       try {
//         const res = await fetch('https://guestpostnow.io/guestpost-backend/admin-funds-request.php', {
//           method: 'GET',
//           credentials: 'include',
//         });
//         const data = await res.json();
//         const savedRequests = data.data;
//         if (savedRequests) {
//           const user_id = localStorage.getItem('user_id');
//           const requests = savedRequests.filter((req: any) => req.userEmail === user_id);
//           setFundRequests(requests);
//         } else {
//           setFundRequests([]);
//         }
//       } catch (error) {
//         console.error("Error loading fund requests:", error);
//         setFundRequests([]);
//       }
//     };
//     loadFundRequests();
//   }, []);

//   const calculateBonus = (amount: number) => {
//     if (amount >= 50 && amount <= 9999) {
//       return (amount * 0.05).toFixed(2); // 5% bonus
//     } else if (amount >= 10000 && amount <= 20000) {
//       return (amount * 0.1).toFixed(2); // 10% bonus
//     }
//     return "0.00";
//   };

//   const handleAmountClick = (amount: number) => {
//     setRequestAmount(amount.toString());
//     setActiveTab("request-funds");
//   };

//   const handleSubmitFundRequest = async () => {
//     const amount = Number.parseFloat(requestAmount);
//     if (!amount || amount < 50 || amount > 20000) {
//       toast.error("Please enter a valid amount between $50 and $20,000");
//       return;
//     }

//     if (paymentMethod === 'paypal' && !paypalEmail.trim()) {
//       toast.error("Please enter your PayPal email address");
//       return;
//     }

//     if (paymentMethod === 'paypal' && !/\S+@\S+\.\S+/.test(paypalEmail)) {
//       toast.error("Please enter a valid PayPal email address");
//       return;
//     }

//     if (paymentMethod === 'stripe' && (!stripe || !elements || stripeLoading)) {
//       toast.error("Stripe is not loaded. Please try again.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       let stripePaymentMethodId: string | undefined;

//       // Handle Stripe payment
//       if (paymentMethod === 'stripe') {
//         const cardElement = elements && elements.getElement(CardElement);
//         if (!cardElement) {
//           toast.error("Card input not found");
//           setIsSubmitting(false);
//           return;
//         }
//         if(stripe) {
//           const { error, paymentMethod } = await stripe.createPaymentMethod({
//             type: 'card',
//             card: cardElement,
//           });
//           if (error) {
//             toast.error(error.message);
//             setIsSubmitting(false);
//             return;
//           }
//           stripePaymentMethodId = paymentMethod.id;
//         }
//       }

//       // Create fund request
//       const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//       const currentDate = new Date().toLocaleDateString();

//       const newRequest: FundRequest = {
//         id: requestId,
//         amount,
//         paypalEmail: paymentMethod === 'paypal' ? paypalEmail.trim() : undefined,
//         stripePaymentMethodId: paymentMethod === 'stripe' ? stripePaymentMethodId : undefined,
//         paymentMethod,
//         status: paymentMethod === 'stripe' ? 'pending' : 'pending', // Backend sets 'paid' after success
//         requestDate: currentDate,
//         notes: requestNotes.trim() || undefined,
//       };

//       const res = await fetch('https://guestpostnow.io/guestpost-backend/fund-request-add.php', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newRequest),
//         credentials: 'include',
//       });

//       const data = await res.json();

//       if (res.ok && data.status === 'success') {
//         // Handle 3D Secure for Stripe
//         if (paymentMethod === 'stripe' && data.status === 'requires_action' && stripe) {
//           const { error } = await stripe.confirmCardPayment(data.client_secret);
//           if (error) {
//             toast.error(error.message);
//             setIsSubmitting(false);
//             return;
//           }
//           // Re-fetch to confirm payment status
//           const confirmRes = await fetch('https://guestpostnow.io/guestpost-backend/fund-request-add.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               id: requestId,
//               amount,
//               paymentMethod: 'stripe',
//               stripePaymentMethodId,
//               status: 'paid',
//               requestDate: currentDate,
//             }),
//             credentials: 'include',
//           });
//           const confirmData = await confirmRes.json();
//           if (!confirmRes.ok || confirmData.status !== 'success') {
//             toast.error("Failed to confirm payment");
//             setIsSubmitting(false);
//             return;
//           }
//         }

//         // Update admin fund request
//         if (user) {
//           const adminRequest = {
//             id: requestId,
//             userId: user.ID,
//             userName: user.user_nicename,
//             userEmail: user.user_email,
//             amount,
//             paypalEmail: paymentMethod === 'paypal' ? paypalEmail.trim() : undefined,
//             stripePaymentMethodId: paymentMethod === 'stripe' ? stripePaymentMethodId : undefined,
//             paymentMethod,
//             status: paymentMethod === 'stripe' ? 'paid' : 'pending',
//             requestDate: currentDate,
//             notes: requestNotes.trim() || undefined,
//             userDetails: {
//               name: user.user_nicename,
//               email: user.user_email,
//             },
//           };

//           await fetch('https://guestpostnow.io/guestpost-backend/admin-funds-request-add.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(adminRequest),
//             credentials: 'include',
//           });
//         }

//         // Reset form
//         setRequestAmount("");
//         setPaypalEmail("");
//         setRequestNotes("");
//         setPaymentMethod('paypal');
//         toast.success(`Fund request submitted successfully via ${paymentMethod}! ${paymentMethod === 'paypal' ? 'You will receive a PayPal invoice within 30 minutes.' : 'Payment completed.'}`);
//         window.location.reload();
//       } else {
//         toast.error(data.message || 'Error submitting fund request');
//       }
//     } catch (error) {
//       toast.error(`Error: ${error}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
//       case "invoice-sent": return <Mail className="h-4 w-4 text-blue-500" />;
//       case "paid": return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
//       default: return <Clock className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending": return "bg-yellow-200 text-yellow-800";
//       case "invoice-sent": return "bg-blue-200 text-blue-800";
//       case "paid": return "bg-green-200 text-green-800";
//       case "rejected": return "bg-red-200 text-red-800";
//       default: return "bg-gray-200 text-gray-800";
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "pending": return "Pending";
//       case "invoice-sent": return "Invoice Sent";
//       case "paid": return "Paid";
//       case "rejected": return "Rejected";
//       default: return "Unknown";
//     }
//   };

//   return (
//     <Elements stripe={stripePromise}>
//       <DashboardLayout>
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-3xl font-bold text-primary">Account Funds</h1>
//             <p className="text-gray-800">Add funds to your account via PayPal invoice or Stripe card payment.</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card className="bg-primary/5 border-primary/10">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-800">Current Balance</CardTitle>
//                 <DollarSign className="h-4 w-4 text-green-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-primary">${Math.abs(balance || userBalance).toFixed(2)}</div>
//                 <p className="text-xs text-gray-800 mt-2">Available for orders</p>
//               </CardContent>
//             </Card>
//             <Card className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-purple-500">Bonus Structure</CardTitle>
//                 <Gift className="h-4 w-4 text-purple-600" />
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="text-sm text-purple-500">$50 - $9,999: <span className="font-bold">5% Bonus</span></div>
//                   <div className="text-sm text-purple-500">$10,000 - $20,000: <span className="font-bold">10% Bonus</span></div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-4 bg-primary/10">
//               <TabsTrigger value="add-funds" className="data-[state=active]:bg-blue-500 text-primary hover:text-primary/50">Select Amount</TabsTrigger>
//               <TabsTrigger value="request-funds" className="data-[state=active]:bg-blue-500 text-primary hover:text-primary/50">Request Funds</TabsTrigger>
//               <TabsTrigger value="pending-requests" className="data-[state=active]:bg-blue-500 text-primary hover:text-primary/50">My Requests</TabsTrigger>
//               <TabsTrigger value="history" className="data-[state=active]:bg-blue-500 text-primary hover:text-primary/50">History</TabsTrigger>
//             </TabsList>

//             <TabsContent value="add-funds">
//               <Card className="bg-primary/5 border-primary/20">
//                 <CardHeader>
//                   <CardTitle className="text-primary flex items-center">
//                     <Plus className="w-5 h-5 mr-2" />
//                     Select Amount
//                   </CardTitle>
//                   <p className="text-gray-800 text-sm">Select an amount to proceed with your fund request.</p>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount</label>
//                     <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
//                       {predefinedAmounts.map((amount) => (
//                         <Button
//                           key={amount}
//                           variant="outline"
//                           onClick={() => handleAmountClick(amount)}
//                           className="h-12 border-primary/30 text-primary hover:bg-primary/10 bg-transparent shadow-md"
//                         >
//                           ${amount.toLocaleString()}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="request-funds">
//               <Card className="bg-primary/5 border-primary/10">
//                 <CardHeader>
//                   <CardTitle className="text-primary flex items-center">
//                     <Send className="w-5 h-5 mr-2" />
//                     Request Funds
//                   </CardTitle>
//                   <p className="text-gray-800 text-sm">Choose PayPal (invoice) or Stripe (card payment).</p>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div>
//                     <Label className="text-gray-700">Payment Method</Label>
//                     <div className="flex space-x-4">
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           value="paypal"
//                           checked={paymentMethod === 'paypal'}
//                           onChange={() => setPaymentMethod('paypal')}
//                           className="mr-2"
//                         />
//                         PayPal
//                       </label>
//                       <label className="flex items-center">
//                         <input
//                           type="radio"
//                           value="stripe"
//                           checked={paymentMethod === 'stripe'}
//                           onChange={() => setPaymentMethod('stripe')}
//                           className="mr-2"
//                         />
//                         Stripe (Card)
//                       </label>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="request-amount" className="text-gray-700">Amount ($)</Label>
//                       <Input
//                         id="request-amount"
//                         type="number"
//                         placeholder="Enter amount (50-20000)"
//                         value={requestAmount}
//                         onChange={(e) => setRequestAmount(e.target.value)}
//                         min="50"
//                         max="20000"
//                         className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
//                         disabled={isSubmitting}
//                       />
//                       <p className="text-xs text-gray-800 mt-1">Minimum: $50, Maximum: $20,000</p>
//                     </div>
//                     <div>
//                       <Label className="text-gray-700">Estimated Bonus</Label>
//                       <div className="h-10 flex items-center px-3 bg-primary/10 border border-primary/20 rounded-md">
//                         <span className="text-sm font-medium text-green-500">
//                           +${calculateBonus(Number.parseFloat(requestAmount) || 0)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   {paymentMethod === 'paypal' && (
//                     <div>
//                       <Label htmlFor="paypal-email" className="text-gray-700">PayPal Email Address</Label>
//                       <Input
//                         id="paypal-email"
//                         type="email"
//                         placeholder="Enter your PayPal email"
//                         value={paypalEmail}
//                         onChange={(e) => setPaypalEmail(e.target.value)}
//                         className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
//                         disabled={isSubmitting}
//                       />
//                       <p className="text-xs text-gray-800 mt-1">We'll send the invoice to this email address</p>
//                     </div>
//                   )}
//                   {paymentMethod === 'stripe' && (
//                     <div>
//                       <Label className="text-gray-700">Card Details</Label>
//                       <CardElement
//                         className="p-3 bg-primary/10 border border-primary/20 rounded-md"
//                         options={{
//                           style: {
//                             base: {
//                               fontSize: '16px',
//                               color: '#1a1a1a',
//                               '::placeholder': { color: '#a0aec0' },
//                             },
//                           },
//                         }}
//                       />
//                       <p className="text-xs text-gray-800 mt-1">Securely enter your card details</p>
//                     </div>
//                   )}
//                   <div>
//                     <Label htmlFor="request-notes" className="text-gray-700">Notes (Optional)</Label>
//                     <Textarea
//                       id="request-notes"
//                       placeholder="Add any special instructions or notes..."
//                       value={requestNotes}
//                       onChange={(e) => setRequestNotes(e.target.value)}
//                       rows={3}
//                       className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400 resize-none"
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   <Button
//                     onClick={handleSubmitFundRequest}
//                     disabled={!requestAmount || (paymentMethod === 'paypal' && !paypalEmail) || isSubmitting || stripeLoading}
//                     className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary"
//                   >
//                     {isSubmitting ? 'Submitting...' : `Submit via ${paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}`}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="pending-requests">
//               <Card className="bg-primary/5 border-primary/10">
//                 <CardHeader>
//                   <CardTitle className="text-primary flex items-center">
//                     <FileText className="w-5 h-5 mr-2" />
//                     My Fund Requests ({fundRequests.length})
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {fundRequests.length === 0 ? (
//                     <div className="text-center py-8">
//                       <FileText className="h-12 w-12 text-gray-800 mx-auto mb-4" />
//                       <p className="text-gray-800">No fund requests submitted yet</p>
//                       <p className="text-sm text-gray-500 mt-2">Your fund requests will appear here</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {fundRequests
//                         .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
//                         .map((request) => (
//                           <div key={request.id} className="border border-primary/10 rounded-lg p-4 bg-primary/5">
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center space-x-2">
//                                 {getStatusIcon(request.status)}
//                                 <span className="font-medium text-primary">${request.amount.toLocaleString()}</span>
//                                 <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
//                                 <Badge className="bg-gray-200 text-gray-800">{request.paymentMethod}</Badge>
//                               </div>
//                               <span className="text-sm text-gray-800">{request.requestDate}</span>
//                             </div>
//                             {request.paymentMethod === 'paypal' && (
//                               <p className="text-sm text-gray-700 mb-2">PayPal: {request.paypalEmail || 'N/A'}</p>
//                             )}
//                             {request.paymentMethod === 'stripe' && (
//                               <p className="text-sm text-gray-700 mb-2">Stripe Payment ID: {request.stripePaymentId || 'N/A'}</p>
//                             )}
//                             {request.notes && <p className="text-sm text-gray-700 mb-2">Notes: {request.notes}</p>}
//                             {request.adminNotes && (
//                               <p className="text-sm text-blue-500 mb-2">Admin Notes: {request.adminNotes}</p>
//                             )}
//                             {request.processedDate && (
//                               <p className="text-xs text-gray-500">
//                                 Processed on {request.processedDate} by {request.processedBy}
//                               </p>
//                             )}
//                           </div>
//                         ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="history">
//               <Card className="bg-primary/5 border-primary/10">
//                 <CardHeader>
//                   <CardTitle className="text-primary flex items-center">
//                     <History className="w-5 h-5 mr-2" />
//                     Complete Fund Request History
//                   </CardTitle>
//                   <p className="text-gray-800 text-sm">All your fund requests are permanently saved here</p>
//                 </CardHeader>
//                 <CardContent>
//                   {fundRequests.length === 0 ? (
//                     <div className="text-center py-8">
//                       <History className="h-12 w-12 text-gray-800 mx-auto mb-4" />
//                       <p className="text-gray-800">No fund request history yet</p>
//                       <p className="text-sm text-gray-500 mt-2">Your complete fund request history will appear here</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {fundRequests
//                         .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
//                         .map((request) => (
//                           <div key={request.id} className="border border-primary/10 rounded-lg p-4 bg-primary/5">
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center space-x-2">
//                                 {getStatusIcon(request.status)}
//                                 <span className="font-medium text-primary">${request.amount.toLocaleString()}</span>
//                                 <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
//                                 <Badge className="bg-gray-200 text-gray-800">{request.paymentMethod}</Badge>
//                               </div>
//                               <span className="text-sm text-gray-800">{request.requestDate}</span>
//                             </div>
//                             {request.paymentMethod === 'paypal' && (
//                               <p className="text-sm text-gray-700 mb-2">PayPal: {request.paypalEmail || 'N/A'}</p>
//                             )}
//                             {request.paymentMethod === 'stripe' && (
//                               <p className="text-sm text-gray-700 mb-2">Stripe Payment ID: {request.stripePaymentId || 'N/A'}</p>
//                             )}
//                             {request.notes && <p className="text-sm text-gray-700 mb-2">Notes: {request.notes}</p>}
//                             {request.adminNotes && (
//                               <p className="text-sm text-blue-500 mb-2">Admin Notes: {request.adminNotes}</p>
//                             )}
//                             {request.processedDate && (
//                               <p className="text-xs text-gray-500">
//                                 Processed on {request.processedDate} by {request.processedBy}
//                               </p>
//                             )}
//                           </div>
//                         ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </DashboardLayout>
//     </Elements>
//   );
// }
