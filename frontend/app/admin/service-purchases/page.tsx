"use client";

import { useEffect, useState } from "react";
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
  Package,
  DollarSign,
  ShoppingCart,
  FileText,
  Star,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ServicePurchases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPurchases, setFilteredPurchases] = useState<any[] | null>(
    null
  );
  const [purchases, setPurchases] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [individualServices, setIndividualServices] = useState<any[]>([]);
  const [comboPackages, setComboPackages] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // console.log(categoryFilter);

  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadPurchasedServices = async () => {
      const res = await fetch(
        "https://guestpostnow.io/guestpost-backend/orders.php",
        {
          method: "GET",
        }
      );
      const data = await res.json();
      const services = data.data;

      setFilteredPurchases(services);
      if (services) {
        setPurchases(services);
        const packages = services.find(
          (service: any) => service.type === "guest-post-package"
        );
        setPackages([packages]);
        const indvidual_services = services.find(
          (service: any) => service.type === "individual-service"
        );
        setIndividualServices([indvidual_services]);
        const combo_package = services.find(
          (service: any) => service.type === "combo-package"
        );
        setComboPackages(combo_package);
        // console.log(services);
      }
    };
    loadPurchasedServices();
  }, []);

  // No demo data - empty array
  // const purchases: any[] = []

  useEffect(() => {
    const filtered_Purchases =
      purchases &&
      purchases.filter((purchase) => {
        // console.log(purchase);

        const matchesSearch =
          // purchase.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.item_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || purchase.type === categoryFilter;
        const matchesStatus =
          statusFilter === "all" || purchase.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      });
    setFilteredPurchases(filtered_Purchases);
    setLoading(false);
  }, [purchases]);
  console.log(filteredPurchases);

  const totalRevenue = purchases
    ? purchases.reduce((sum, purchase) => sum + Math.floor(purchase?.price), 0)
    : 0;
  const packageRevenue = packages
    ? packages.reduce((sum, pkg) => sum + Math.floor(pkg?.price), 0)
    : 0;
  const individualServicesRevenue = individualServices
    ? individualServices.reduce(
        (sum, individualService) => sum + Math.floor(individualService?.price),
        0
      )
    : 0;
  const comboPackageRevenue = comboPackages
    ? comboPackages.reduce(
        (sum, comboPackage) => sum + Math.floor(comboPackage?.price),
        0
      )
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "guest-post-package":
        return "bg-purple-100 text-purple-800";
      case "individual-service":
        return "bg-blue-100 text-blue-800";
      case "combo-package":
        return "bg-orange-100 text-orange-800";
      case "additional-service":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "guest-post-package":
        return "Guest Post Package";
      case "individual-service":
        return "Individual Service";
      case "combo-package":
        return "Combo Package";
      case "additional-service":
        return "Additional Service";
      default:
        return "Service";
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "guest-post-package":
        return "📦";
      case "individual-service":
        return "⚡";
      case "combo-package":
        return "🎯";
      case "additional-service":
        return "🔧";
      default:
        return "📋";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Service Purchases</h1>
            <p className="text-gray-400 mt-2">
              Track and manage all service purchases by category
            </p>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${totalRevenue}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ${totalRevenue} revenue
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Guest Post Packages
              </CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${packageRevenue}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ${packageRevenue} revenue
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Individual Services
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${individualServicesRevenue}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ${individualServicesRevenue} revenue
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Combo Packages
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${comboPackageRevenue}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ${comboPackageRevenue} revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by customer email or service name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-48 bg-white/10 border-white/20 text-white rounded-md px-3 py-2 h-10">
                <option value="all">All Categories</option>
                <option value="guest-post-packages">Guest Post Packages</option>
                <option value="individual-services">Individual Services</option>
                <option value="combo-packages">Combo Packages</option>
                <option value="additional-services">Additional Services</option>
              </select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white/5 border-white/10 text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Purchases Table */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              Service Purchases {filteredPurchases?.length || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                {/* <p className="animate-spin rounded-full h-6 w-6 border-white border mx-auto mb-4"></p> */}
                <p className="text-gray-400 mb-4">Loading Services...</p>
                <p className="text-sm text-gray-400">
                  Users can purchase services from the services page at{" "}
                  <span className="font-mono bg-white/10 px-2 py-1 rounded text-white">
                    /services
                  </span>
                </p>
              </div>
            ) : !filteredPurchases || filteredPurchases.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No service purchases yet
                </h3>
                <p className="text-gray-400 mb-4">
                  Service purchases will appear here when users buy services
                </p>
                <p className="text-sm text-gray-400">
                  Users can purchase services from the services page at{" "}
                  <span className="font-mono bg-white/10 px-2 py-1 rounded text-white">
                    /services
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPurchases.map((order) => (
                  <Card
                    key={order.id}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {getServiceIcon(order.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-white">
                                {order.title || order.item_name}
                              </h3>
                              <Badge
                                className={getServiceTypeColor(order.type)}>
                                {getServiceTypeLabel(order.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">
                              Order #{order.id}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {order.orderDate ||
                                  new Date(
                                    order.created_at
                                  ).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {order.amount || order.price}
                              </div>
                              {order.packageDetails && (
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 mr-1" />
                                  {order.packageDetails.websites} websites
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
                        </div>
                      </div>
                      {order.description && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-sm text-gray-400">
                            {order.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
