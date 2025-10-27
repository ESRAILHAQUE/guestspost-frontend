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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  usePackages,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  PackageType,
} from "@/hooks/api/usePackages";

export default function PackageManagement() {
  const { data: packages = [], isLoading, refetch } = usePackages();
  const createPackageMutation = useCreatePackage();
  const updatePackageMutation = useUpdatePackage();
  const deletePackageMutation = useDeletePackage();

  const [editingPackage, setEditingPackage] = useState<PackageType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    features: "",
    popular: false,
    offer: false,
    status: "active" as "active" | "inactive",
  });

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.description.trim() ||
      !formData.features.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const featuresArray = formData.features
      .split("\n")
      .filter((f) => f.trim())
      .map((f) => f.trim());

    const packageData: Partial<PackageType> = {
      name: formData.name.trim(),
      price: Number.parseFloat(formData.price),
      description: formData.description.trim(),
      features: featuresArray,
      popular: formData.popular,
      offer: formData.offer,
      status: formData.status,
    };

    try {
      if (editingPackage) {
        await updatePackageMutation.mutateAsync({
          id: editingPackage._id || editingPackage.id,
          packageData,
        });
        toast.success("Package updated successfully");
      } else {
        await createPackageMutation.mutateAsync(packageData);
        toast.success("Package created successfully");
      }

      setIsDialogOpen(false);
      setFormData({
        name: "",
        price: "",
        description: "",
        features: "",
        popular: false,
        offer: false,
        status: "active",
      });
      setEditingPackage(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save package");
    }
  };

  const handleEdit = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      description: pkg.description,
      features: pkg.features.join("\n"),
      popular: pkg.popular || false,
      offer: pkg.offer || false,
      status: pkg.status || "active",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (pkg: PackageType) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackageMutation.mutateAsync(pkg._id || pkg.id);
        toast.success("Package deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete package");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      features: "",
      popular: false,
      offer: false,
      status: "active",
    });
    setEditingPackage(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading packages...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Package Management
            </h1>
            <p className="text-gray-300 mt-2">
              Manage packages displayed on the Guest Post Package page
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPackage(null);
                  setFormData({
                    name: "",
                    price: "",
                    description: "",
                    features: "",
                    popular: false,
                    offer: false,
                    status: "active",
                  });
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPackage ? "Edit Package" : "Add New Package"}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {editingPackage
                    ? "Update the package information"
                    : "Create a new package for the Guest Post Package page"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="features">Features (one per line) *</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) =>
                      setFormData({ ...formData, features: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={5}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          popular: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="popular">Mark as Popular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offer"
                      checked={formData.offer}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, offer: checked as boolean })
                      }
                    />
                    <Label htmlFor="offer">Mark as Offer</Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={
                      createPackageMutation.isPending ||
                      updatePackageMutation.isPending
                    }
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    {createPackageMutation.isPending ||
                    updatePackageMutation.isPending
                      ? "Saving..."
                      : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg._id || pkg.id}
              className="bg-gray-800 border-gray-700">
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">
                      {pkg.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">
                        ${pkg.price}
                      </span>
                    </div>
                  </div>
                  {pkg.popular && (
                    <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Popular
                    </div>
                  )}
                </div>
                <CardDescription className="text-gray-300 mt-3">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {pkg.features
                    .slice(0, 5)
                    .map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(pkg)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(pkg)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-900">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {packages.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No packages found</p>
            <p className="text-gray-500 text-sm">
              Get started by creating your first package
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
