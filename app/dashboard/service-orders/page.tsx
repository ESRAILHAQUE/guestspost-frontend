"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Search, Package, Calendar, DollarSign, ExternalLink, Star } from "lucide-react"
import Link from "next/link"

interface ServiceOrder {
  id: string
  type: "guest-post-package" | "individual-service" | "combo-package" | "additional-service"
  title: string
  item_name : string
  amount: number
  price: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  orderDate: string
  created_at: string
  deliveryDate?: string
  description?: string
  packageDetails?: {
    websites: number
    drRange: string
    features: string[]
  }
}

export default function ServiceOrdersPage() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<ServiceOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    // Load service orders from localStorage
    const loadServiceOrders = async () => {
      try {
        const user_id = localStorage.getItem('user_id')
        // const savedOrders = localStorage.getItem("userServiceOrders")
        const res = await fetch("https://guestpostnow.io/guestpost-backend/orders.php", {
          method: "GET",
        });
        const data = await res.json();
        const allOrders = data?.data;

        // Find the order matching the specified id
        let savedOrders: any = []
        allOrders.filter((order: any) => {
          if (order.user_id === user_id) {
            savedOrders.push(order)
          }
        });
        // setOrders(userOrders); // Ensure setOrders receives an array
        // console.log(userOrders);
        
        if (savedOrders) {
          const orderData = savedOrders
          setFilteredOrders(orderData)
          setServiceOrders(orderData)
        } else {
          setServiceOrders([])
          setFilteredOrders([])
        }
      } catch (error) {
        console.error("Error loading service orders:", error)
        setServiceOrders([])
        setFilteredOrders([])
      }
    }

    loadServiceOrders()

    // Set up interval to refresh service orders every 3 seconds
    const interval = setInterval(loadServiceOrders, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Filter orders based on search, status, and type
    let filtered = serviceOrders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.item_name.toLowerCase().includes(searchTerm.toLowerCase()) 
        // || order.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus)
    }

    if (filterType !== "all") {
      filtered = filtered.filter((order) => order.type === filterType)
    }

    setFilteredOrders(filtered)
  }, [serviceOrders, searchTerm, filterStatus, filterType])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/30 bg-green-100 text-green-800"
      case "processing":
        return "bg-primary/30 bg-blue-100 text-blue-800"
      case "pending":
        return "bg-primary/30 bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-primary/30 bg-red-100 text-red-800"
      default:
        return "bg-primary/30 bg-gray-100 text-gray-800"
    }
  }

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "guest-post-package":
        return "bg-purple-200 text-purple-800"
      case "individual-service":
        return "bg-blue-200 text-blue-800"
      case "combo-package":
        return "bg-orange-200 text-orange-800"
      case "additional-service":
        return "bg-green-200 text-green-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "guest-post-package":
        return "Guest Post Package"
      case "individual-service":
        return "Individual Service"
      case "combo-package":
        return "Combo Package"
      case "additional-service":
        return "Additional Service"
      default:
        return "Service"
    }
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "guest-post-package":
        return "📦"
      case "individual-service":
        return "⚡"
      case "combo-package":
        return "🎯"
      case "additional-service":
        return "🔧"
      default:
        return "📋"
    }
  }

  if (serviceOrders.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Service Orders</h1>
            <p className="text-gray-800">Track your guest post packages and service orders</p>
          </div>

          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-800" />
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">No service orders yet</h3>
            <p className="text-gray-800 mb-6">Start by browsing our guest post packages and services</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/packages">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-secondary">
                  Browse Packages
                  <Package className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-primary/10">
                  View Services
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Service Orders</h1>
          <p className="text-gray-800">Track your guest post packages and service orders</p>
        </div>

        {/* Filters */}
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                  <Input
                    placeholder="Search service orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48 bg-primary/10 border-primary/20 text-primary">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="guest-post-package">Guest Post Package</SelectItem>
                  <SelectItem value="individual-service">Individual Service</SelectItem>
                  <SelectItem value="combo-package">Combo Package</SelectItem>
                  <SelectItem value="additional-service">Additional Service</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-primary/10 border-primary/20 text-primary">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Service Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getServiceIcon(order.type)}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-primary">{order.title || order.item_name}</h3>
                        <Badge className={getServiceTypeColor(order.type)}>
                          {getServiceTypeLabel(order.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-800">Order #{order.id}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-800 mt-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {order.orderDate || new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-blue-500">
                          <DollarSign className="w-4 h-4 mr-1 text-primary/40" />{order.amount || order.price}
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
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("-", " ")}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                {order.description && (
                  <div className="mt-3 pt-3 border-t border-primary/10">
                    <p className="text-sm text-gray-800">{order.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && serviceOrders.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-800">No service orders match your search criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterStatus("all")
                setFilterType("all")
              }}
              className="mt-2 border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
