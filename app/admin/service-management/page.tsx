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
import { Plus, Edit, Trash2, CheckCircle, Clock, Users, Award, Shield, Zap } from "lucide-react";
import { toast } from "sonner";
import { endpoints } from "@/lib/api/client";

const iconMap = {
  CheckCircle,
  Clock,
  Users,
  Award,
  Shield,
  Zap,
};

export default function ServiceManagement() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "CheckCircle",
    status: "active" as "active" | "inactive",
    order: 0,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const result = await endpoints.services.getServices();
      setServices(result.data || []);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingService) {
        await endpoints.services.updateService(editingService._id || editingService.id, formData);
        toast.success("Service updated successfully");
      } else {
        await endpoints.services.createService(formData);
        toast.success("Service created successfully");
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadServices();
    } catch (error: any) {
      console.error("Error saving service:", error);
      toast.error(error.response?.data?.message || "Failed to save service");
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || "CheckCircle",
      status: service.status || "active",
      order: service.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await endpoints.services.deleteService(id);
      toast.success("Service deleted successfully");
      loadServices();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error(error.response?.data?.message || "Failed to delete service");
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      icon: "CheckCircle",
      status: "active",
      order: 0,
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-primary">Loading services...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Service Management</h1>
            <p className="text-gray-800">Manage services displayed on the website</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  {editingService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-primary">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Article Writing"
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
                    placeholder="Describe the service..."
                    rows={4}
                    required
                    className="bg-white text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon" className="text-primary">Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) =>
                        setFormData({ ...formData, icon: value })
                      }
                    >
                      <SelectTrigger className="bg-white text-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="CheckCircle">CheckCircle</SelectItem>
                        <SelectItem value="Zap">Zap</SelectItem>
                        <SelectItem value="Award">Award</SelectItem>
                        <SelectItem value="Users">Users</SelectItem>
                        <SelectItem value="Shield">Shield</SelectItem>
                        <SelectItem value="Clock">Clock</SelectItem>
                      </SelectContent>
                    </Select>
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
                </div>

                <div>
                  <Label htmlFor="order" className="text-primary">Display Order</Label>
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
                    {editingService ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || CheckCircle;
            return (
              <Card key={service._id || service.id} className="bg-white border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-primary">{service.title}</CardTitle>
                        <p className="text-sm text-gray-600">Order: {service.order}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      service.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {service.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4">{service.description}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(service)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-primary border-primary/30"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(service._id || service.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {services.length === 0 && (
          <Card className="bg-white border-primary/20">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-primary mb-2">No Services</h3>
              <p className="text-gray-600 mb-4">Click "Add Service" to create your first service</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

