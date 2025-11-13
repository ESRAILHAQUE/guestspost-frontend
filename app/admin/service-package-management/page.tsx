"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, DollarSign, Star, Package } from "lucide-react";
import { toast } from "sonner";
import { endpoints } from "@/lib/api/client";
import { Badge } from "@/components/ui/badge";

export default function ServicePackageManagement() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: "",
    name: "",
    price: "",
    originalPrice: "",
    articles: "",
    features: "",
    popular: false,
    description: "",
    status: "active" as "active" | "inactive",
    order: 0,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const result = await endpoints.servicePackages.getServicePackages();
      setPackages(result.data || []);
    } catch (error) {
      console.error("Error loading service packages:", error);
      toast.error("Failed to load service packages");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (
      !formData.serviceId.trim() ||
      !formData.name.trim() ||
      !formData.price ||
      !formData.originalPrice ||
      !formData.articles.trim() ||
      !formData.features.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const featuresArray = formData.features
      .split("\n")
      .filter((f) => f.trim())
      .map((f) => f.trim());

    const packageData = {
      serviceId: formData.serviceId.trim(),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      articles: formData.articles.trim(),
      features: featuresArray,
      popular: formData.popular,
      description: formData.description.trim(),
      status: formData.status,
      order: formData.order,
    };

    try {
      if (editingPackage) {
        await endpoints.servicePackages.updateServicePackage(
          editingPackage._id || editingPackage.id,
          packageData
        );
        toast.success("Service package updated successfully");
      } else {
        await endpoints.servicePackages.createServicePackage(packageData);
        toast.success("Service package created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      loadPackages();
    } catch (error: any) {
      console.error("Error saving service package:", error);
      toast.error(error.response?.data?.message || "Failed to save service package");
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setFormData({
      serviceId: pkg.serviceId,
      name: pkg.name,
      price: pkg.price.toString(),
      originalPrice: pkg.originalPrice.toString(),
      articles: pkg.articles,
      features: Array.isArray(pkg.features) ? pkg.features.join("\n") : "",
      popular: pkg.popular || false,
      description: pkg.description,
      status: pkg.status || "active",
      order: pkg.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service package?")) return;

    try {
      await endpoints.servicePackages.deleteServicePackage(id);
      toast.success("Service package deleted successfully");
      loadPackages();
    } catch (error: any) {
      console.error("Error deleting service package:", error);
      toast.error(error.response?.data?.message || "Failed to delete service package");
    }
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      serviceId: "",
      name: "",
      price: "",
      originalPrice: "",
      articles: "",
      features: "",
      popular: false,
      description: "",
      status: "active",
      order: 0,
    });
  };

  // Group packages by serviceId
  const groupedPackages = packages.reduce((acc, pkg) => {
    if (!acc[pkg.serviceId]) {
      acc[pkg.serviceId] = [];
    }
    acc[pkg.serviceId].push(pkg);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-primary">Loading service packages...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Service Package Management</h1>
            <p className="text-gray-800">Manage service packages displayed on /services page</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  {editingPackage ? "Edit Service Package" : "Add New Service Package"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serviceId" className="text-primary">Service ID * (e.g., article-writing)</Label>
                    <Input
                      id="serviceId"
                      value={formData.serviceId}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceId: e.target.value })
                      }
                      placeholder="article-writing"
                      required
                      className="bg-white text-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-primary">Package Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Starter Package"
                      required
                      className="bg-white text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-primary">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="150"
                      required
                      className="bg-white text-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="originalPrice" className="text-primary">Original Price *</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, originalPrice: e.target.value })
                      }
                      placeholder="200"
                      required
                      className="bg-white text-primary"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="articles" className="text-primary">Articles/Quantity *</Label>
                  <Input
                    id="articles"
                    value={formData.articles}
                    onChange={(e) =>
                      setFormData({ ...formData, articles: e.target.value })
                    }
                    placeholder="3 Articles"
                    required
                    className="bg-white text-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-primary">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Package description..."
                    rows={3}
                    required
                    className="bg-white text-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="features" className="text-primary">Features * (one per line)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) =>
                      setFormData({ ...formData, features: e.target.value })
                    }
                    placeholder="500-800 words per article&#10;Basic SEO optimization&#10;1 revision per article"
                    rows={5}
                    required
                    className="bg-white text-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, popular: checked as boolean })
                      }
                    />
                    <Label htmlFor="popular" className="text-primary">Popular</Label>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-primary">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="bg-white text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="order" className="text-primary">Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                      }
                      className="bg-white text-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    className="text-primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  >
                    {editingPackage ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {Object.keys(groupedPackages).length > 0 ? (
          Object.entries(groupedPackages).map(([serviceId, pkgs]) => (
            <div key={serviceId} className="space-y-4">
              <h2 className="text-2xl font-bold text-primary capitalize">
                {serviceId.replace(/-/g, " ")} Packages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pkgs.map((pkg) => (
                  <Card
                    key={pkg._id || pkg.id}
                    className={`bg-white border-primary/20 ${
                      pkg.popular ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-primary">{pkg.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{pkg.articles}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          pkg.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {pkg.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                          <span className="text-sm text-gray-500 line-through">
                            ${pkg.originalPrice}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3">{pkg.description}</p>
                      
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-primary mb-2">Features:</p>
                        <ul className="space-y-1">
                          {Array.isArray(pkg.features) && pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-600">• {feature}</li>
                          ))}
                          {Array.isArray(pkg.features) && pkg.features.length > 3 && (
                            <li className="text-xs text-gray-500">+ {pkg.features.length - 3} more</li>
                          )}
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(pkg)}
                          size="sm"
                          variant="outline"
                          className="flex-1 text-primary border-primary/30"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(pkg._id || pkg.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card className="bg-white border-primary/20">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No Service Packages</h3>
              <p className="text-gray-600 mb-4">
                Click "Add Package" to create your first service package
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

