"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import {
  useWebsites,
  useAddWebsite,
  useUpdateWebsite,
  useDeleteWebsite,
} from "@/hooks/api/useWebsites";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/types/api";

interface Website {
  id: number;
  name: string;
  url: string;
  category: string;
  section: "standard" | "premium";
  da: number;
  dr: number;
  traffic: string;
  language: string;
  country: string;
  status: "active" | "pending" | "inactive";
  standardPrice?: number;
  premiumDoFollowPrice?: number;
  premiumNoFollowPrice?: number;
  description?: string;
  guidelines?: string;
  createdAt: string;
  logo?: string;
  niche: string;
  delivery: string;
  doFollowPrice: number;
  noFollowPrice: number;
}

interface FormData {
  name: string;
  url: string;
  category: string;
  section: "standard" | "premium";
  da: string;
  dr: string;
  traffic: string;
  language: string;
  country: string;
  status: "active" | "pending" | "inactive";
  standardPrice: string;
  premiumDoFollowPrice: string;
  premiumNoFollowPrice: string;
  description: string;
  guidelines: string;
  delivery: string;
}

export default function ManageWebsites() {
  const queryClient = useQueryClient();

  // Use React Query hooks
  const { data: websites = [], isLoading } = useWebsites();
  const addWebsiteMutation = useAddWebsite();
  const updateWebsiteMutation = useUpdateWebsite();
  const deleteWebsiteMutation = useDeleteWebsite();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    category: "",
    section: "standard",
    da: "",
    dr: "",
    traffic: "",
    language: "",
    country: "",
    status: "active",
    standardPrice: "",
    premiumDoFollowPrice: "",
    premiumNoFollowPrice: "",
    description: "",
    guidelines: "",
    delivery: "24–72 hrs",
  });

  const categories = [
    "Technology",
    "Business & Finance",
    "Health & Wellness",
    "Lifestyle",
    "Travel",
    "Food & Recipes",
    "Fashion & Beauty",
    "Sports",
    "Entertainment",
    "Education",
    "Real Estate",
    "Automotive",
    "Gaming",
    "Digital Marketing",
    "General News & Blogs",
    "Law & Legal",
    "Environment & Green Energy",
    "Shopping & Coupons",
    "Pets & Animals",
    "Career & Jobs",
    "Home & Garden",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Dutch",
    "Other",
  ];
  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Other",
  ];

  // Removed - now using React Query hooks

  const filteredWebsites = websites
    .filter((website) => {
      const matchesSearch =
        website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || website.category === categoryFilter;
      const matchesSection =
        sectionFilter === "all" || website.section === sectionFilter;
      const matchesStatus =
        statusFilter === "all" || website.status === statusFilter;
      return (
        matchesSearch && matchesCategory && matchesSection && matchesStatus
      );
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalItems = websites.length;

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      category: "",
      section: "standard",
      da: "",
      dr: "",
      traffic: "",
      language: "",
      country: "",
      status: "active",
      standardPrice: "",
      premiumDoFollowPrice: "",
      premiumNoFollowPrice: "",
      description: "",
      guidelines: "",
      delivery: "24–72 hrs",
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "url",
      "category",
      "da",
      "dr",
      "traffic",
      "language",
      "country",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    const da = Number.parseInt(formData.da);
    const dr = Number.parseInt(formData.dr);
    if (da < 1 || da > 100 || dr < 1 || dr > 100) {
      toast.error("DA and DR must be between 1 and 100");
      return false;
    }

    if (formData.section === "standard" && !formData.standardPrice) {
      toast.error("Please enter a price for standard section");
      return false;
    }

    if (
      formData.section === "premium" &&
      (!formData.premiumDoFollowPrice || !formData.premiumNoFollowPrice)
    ) {
      toast.error(
        "Please enter both do-follow and no-follow prices for premium section"
      );
      return false;
    }

    return true;
  };

  const generateLogo = (websiteName: string) => {
    return `/placeholder.svg?height=32&width=32&text=${websiteName.charAt(0)}`;
  };

  const handleAddWebsite = async () => {
    if (!validateForm()) return;

    const newWebsite: Website = {
      id: Date.now(),
      name: formData.name,
      url: formData.url,
      category: formData.category,
      section: formData.section,
      da: Number.parseInt(formData.da),
      dr: Number.parseInt(formData.dr),
      traffic: formData.traffic,
      language: formData.language,
      country: formData.country,
      status: formData.status,
      description: formData.description,
      guidelines: formData.guidelines,
      createdAt: new Date().toISOString().split("T")[0],
      logo: generateLogo(formData.name),
      niche: formData.category,
      delivery: formData.delivery,
      doFollowPrice: 0,
      noFollowPrice: 0,
    };

    if (formData.section === "standard") {
      newWebsite.standardPrice = Number.parseFloat(formData.standardPrice);
      newWebsite.doFollowPrice = Number.parseFloat(formData.standardPrice);
      newWebsite.noFollowPrice = Number.parseFloat(formData.standardPrice);
    } else {
      newWebsite.premiumDoFollowPrice = Number.parseFloat(
        formData.premiumDoFollowPrice
      );
      newWebsite.premiumNoFollowPrice = Number.parseFloat(
        formData.premiumNoFollowPrice
      );
      newWebsite.doFollowPrice = Number.parseFloat(
        formData.premiumDoFollowPrice
      );
      newWebsite.noFollowPrice = Number.parseFloat(
        formData.premiumNoFollowPrice
      );
    }

    try {
      await addWebsiteMutation.mutateAsync(newWebsite);

      setIsAddDialogOpen(false);
      resetForm();
      toast.success(
        "Website added successfully! It will now appear in the catalog."
      );
    } catch (error) {
      toast.error(`Failed to Add Website: ${error}`);
    }
  };

  const handleEditWebsite = (website: Website) => {
    setEditingWebsite(website);
    setFormData({
      name: website.name,
      url: website.url,
      category: website.category,
      section: website.section,
      da: website.da.toString(),
      dr: website.dr.toString(),
      traffic: website.traffic,
      language: website.language,
      country: website.country,
      status: website.status,
      standardPrice: website.standardPrice?.toString() || "",
      premiumDoFollowPrice: website.premiumDoFollowPrice?.toString() || "",
      premiumNoFollowPrice: website.premiumNoFollowPrice?.toString() || "",
      description: website.description || "",
      guidelines: website.guidelines || "",
      delivery: website.delivery || "24–72 hrs",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateWebsite = async () => {
    if (!validateForm() || !editingWebsite) return;

    const updatedWebsite: Website = {
      ...editingWebsite,
      name: formData.name,
      url: formData.url,
      category: formData.category,
      section: formData.section,
      da: Number.parseInt(formData.da),
      dr: Number.parseInt(formData.dr),
      traffic: formData.traffic,
      language: formData.language,
      country: formData.country,
      status: formData.status,
      description: formData.description,
      guidelines: formData.guidelines,
      niche: formData.category,
      delivery: formData.delivery,
    };

    if (formData.section === "standard") {
      updatedWebsite.standardPrice = Number.parseFloat(formData.standardPrice);
      updatedWebsite.doFollowPrice = Number.parseFloat(formData.standardPrice);
      updatedWebsite.noFollowPrice = Number.parseFloat(formData.standardPrice);
      delete updatedWebsite.premiumDoFollowPrice;
      delete updatedWebsite.premiumNoFollowPrice;
    } else {
      updatedWebsite.premiumDoFollowPrice = Number.parseFloat(
        formData.premiumDoFollowPrice
      );
      updatedWebsite.premiumNoFollowPrice = Number.parseFloat(
        formData.premiumNoFollowPrice
      );
      updatedWebsite.doFollowPrice = Number.parseFloat(
        formData.premiumDoFollowPrice
      );
      updatedWebsite.noFollowPrice = Number.parseFloat(
        formData.premiumNoFollowPrice
      );
      delete updatedWebsite.standardPrice;
    }
    try {
      await updateWebsiteMutation.mutateAsync(updatedWebsite);

      setIsEditDialogOpen(false);
      setEditingWebsite(null);
      resetForm();
      toast.success("Website updated successfully!");
    } catch (error) {
      toast.error(`Failed to Update ${error}`);
    }
  };

  const handleDeleteWebsite = async (id: number) => {
    if (confirm("Are you sure you want to delete this website?")) {
      try {
        await deleteWebsiteMutation.mutateAsync(id);
        toast.success("Website deleted successfully!");
      } catch (error) {
        toast.error(`Failed to delete website: ${error}`);
      }
    }
  };

  const totalWebsites = websites.length;
  const activeWebsites = websites.filter((w) => w.status === "active").length;
  const standardWebsites = websites.filter(
    (w) => w.section === "standard"
  ).length;
  const premiumWebsites = websites.filter(
    (w) => w.section === "premium"
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Websites</h1>
            <p className="text-gray-400 mt-2">
              Add, edit, and manage websites in your catalog
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Website
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Websites
              </CardTitle>
              <Globe className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalWebsites}
              </div>
              <p className="text-xs text-gray-400 mt-1">All websites</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Active
              </CardTitle>
              <Eye className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {activeWebsites}
              </div>
              <p className="text-xs text-gray-400 mt-1">Live websites</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Standard
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {standardWebsites}
              </div>
              <p className="text-xs text-gray-400 mt-1">Standard section</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Premium
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {premiumWebsites}
              </div>
              <p className="text-xs text-gray-400 mt-1">Premium section</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search websites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-40 bg-white/10 border-white/20 text-white rounded-md px-3 py-2 h-10"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select 
                value={sectionFilter} 
                onChange={(e) => setSectionFilter(e.target.value)}
                className="w-40 bg-white/10 border-white/20 text-white rounded-md px-3 py-2 h-10"
              >
                <option value="all">All Sections</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40 bg-white/10 border-white/20 text-white rounded-md px-3 py-2 h-10"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setSectionFilter("all");
                  setStatusFilter("all");
                }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Websites Table */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              Websites ({filteredWebsites.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {filteredWebsites.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {websites.length === 0
                    ? "No websites added yet"
                    : "No websites match your filters"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {websites.length === 0
                    ? "Start by adding your first website to the catalog"
                    : "Try adjusting your search criteria"}
                </p>
                {websites.length === 0 && (
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Website
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto min-w-[1300px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-400">
                        Website
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">
                        Section
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">
                        DA/DR
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">
                        Traffic
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">
                        Pricing
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWebsites.map((website) => (
                      <tr
                        key={website.id}
                        className="border-b border-gray-100 hover:bg-gray-800">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-white">
                              {website.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {website.url}
                            </p>
                            <p className="text-xs text-gray-500">
                              {website.language} • {website.country}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white">{website.category}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              website.section === "premium"
                                ? "default"
                                : "secondary"
                            }>
                            {website.section}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white">
                            DA: {website.da} • DR: {website.dr}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white">{website.traffic}</span>
                        </td>
                        <td className="py-4 px-4">
                          {website.section === "standard" ? (
                            <span className="font-medium text-secondary">
                              ${website.standardPrice}
                            </span>
                          ) : (
                            <div className="text-sm text-white">
                              <div>
                                Do-follow: ${website.premiumDoFollowPrice}
                              </div>
                              <div>
                                No-follow: ${website.premiumNoFollowPrice}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              website.status === "active"
                                ? "default"
                                : website.status === "pending"
                                ? "secondary"
                                : "outline"
                            }>
                            {website.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditWebsite(website)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteWebsite(website.id)}
                              className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredWebsites.length > 0 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="bg-blue-600 hover:bg-blue-700 text-white">
                      Previous
                    </Button>
                    <div className="flex gap-2">
                      {Array.from(
                        { length: Math.ceil(totalItems / itemsPerPage) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          className={`${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          }`}>
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={
                        currentPage >= Math.ceil(totalItems / itemsPerPage)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white">
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Website Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/5 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Website</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300" htmlFor="name">
                    Website Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., TechCrunch"
                  />
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="url">
                    Website URL *
                  </Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300" htmlFor="category">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="section">
                    Section *
                  </Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value: "standard" | "premium") =>
                      setFormData({ ...formData, section: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300" htmlFor="da">
                    Domain Authority (1-100) *
                  </Label>
                  <Input
                    id="da"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.da}
                    onChange={(e) =>
                      setFormData({ ...formData, da: e.target.value })
                    }
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="dr">
                    Domain Rating (1-100) *
                  </Label>
                  <Input
                    id="dr"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.dr}
                    onChange={(e) =>
                      setFormData({ ...formData, dr: e.target.value })
                    }
                    placeholder="45"
                  />
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="traffic">
                    Monthly Traffic *
                  </Label>
                  <Input
                    id="traffic"
                    value={formData.traffic}
                    onChange={(e) =>
                      setFormData({ ...formData, traffic: e.target.value })
                    }
                    placeholder="100K+"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-primary">
                  <Label className="text-gray-300" htmlFor="language">
                    Language *
                  </Label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    className="w-full bg-white/10 border-white/20 text-white rounded-md px-3 py-2 h-10">
                    {languages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="country">
                    Country *
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="delivery">
                    Delivery Time *
                  </Label>
                  <Select
                    value={formData.delivery}
                    onValueChange={(value) =>
                      setFormData({ ...formData, delivery: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instant">Instant</SelectItem>
                      <SelectItem value="12–24 hrs">12–24 hrs</SelectItem>
                      <SelectItem value="24–72 hrs">24–72 hrs</SelectItem>
                      <SelectItem value="1–2 weeks">1–2 weeks</SelectItem>
                      <SelectItem value="3–4 weeks">3–4 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="status">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "pending" | "inactive") =>
                      setFormData({ ...formData, status: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4 text-white">Pricing</h3>
                {formData.section === "standard" ? (
                  <div>
                    <Label className="text-gray-300" htmlFor="standardPrice">
                      Price ($) *
                    </Label>
                    <Input
                      id="standardPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.standardPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          standardPrice: e.target.value,
                        })
                      }
                      placeholder="299.00"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        className="text-gray-300"
                        htmlFor="premiumDoFollowPrice">
                        Do-Follow Price ($) *
                      </Label>
                      <Input
                        id="premiumDoFollowPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.premiumDoFollowPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            premiumDoFollowPrice: e.target.value,
                          })
                        }
                        placeholder="499.00"
                      />
                    </div>
                    <div>
                      <Label
                        className="text-gray-300"
                        htmlFor="premiumNoFollowPrice">
                        No-Follow Price ($) *
                      </Label>
                      <Input
                        id="premiumNoFollowPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.premiumNoFollowPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            premiumNoFollowPrice: e.target.value,
                          })
                        }
                        placeholder="299.00"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-300" htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the website..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-gray-300" htmlFor="guidelines">
                  Guidelines
                </Label>
                <Textarea
                  id="guidelines"
                  value={formData.guidelines}
                  onChange={(e) =>
                    setFormData({ ...formData, guidelines: e.target.value })
                  }
                  placeholder="Content guidelines and requirements..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 text-primary">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddWebsite}
                  className="bg-blue-600 hover:bg-blue-700">
                  Add Website
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Website Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/5 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Website</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300" htmlFor="edit-name">
                    Website Name *
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., TechCrunch"
                  />
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="edit-url">
                    Website URL *
                  </Label>
                  <Input
                    id="edit-url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300" htmlFor="edit-category">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="edit-section">
                    Section *
                  </Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value: "standard" | "premium") =>
                      setFormData({ ...formData, section: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300" htmlFor="edit-da">
                    Domain Authority (1-100) *
                  </Label>
                  <Input
                    id="edit-da"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.da}
                    onChange={(e) =>
                      setFormData({ ...formData, da: e.target.value })
                    }
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="edit-dr">
                    Domain Rating (1-100) *
                  </Label>
                  <Input
                    id="edit-dr"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.dr}
                    onChange={(e) =>
                      setFormData({ ...formData, dr: e.target.value })
                    }
                    placeholder="45"
                  />
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="edit-traffic">
                    Monthly Traffic *
                  </Label>
                  <Input
                    id="edit-traffic"
                    value={formData.traffic}
                    onChange={(e) =>
                      setFormData({ ...formData, traffic: e.target.value })
                    }
                    placeholder="100K+"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-300" htmlFor="edit-language">
                    Language *
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      setFormData({ ...formData, language: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="edit-country">
                    Country *
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="edit-delivery">
                    Delivery Time *
                  </Label>
                  <Select
                    value={formData.delivery}
                    onValueChange={(value) =>
                      setFormData({ ...formData, delivery: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instant">Instant</SelectItem>
                      <SelectItem value="12–24 hrs">12–24 hrs</SelectItem>
                      <SelectItem value="24–72 hrs">24–72 hrs</SelectItem>
                      <SelectItem value="1–2 weeks">1–2 weeks</SelectItem>
                      <SelectItem value="3–4 weeks">3–4 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300" htmlFor="edit-status">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "pending" | "inactive") =>
                      setFormData({ ...formData, status: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4 text-white">Pricing</h3>
                {formData.section === "standard" ? (
                  <div>
                    <Label
                      className="text-gray-300"
                      htmlFor="edit-standardPrice">
                      Price ($) *
                    </Label>
                    <Input
                      id="edit-standardPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.standardPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          standardPrice: e.target.value,
                        })
                      }
                      placeholder="299.00"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        className="text-gray-300"
                        htmlFor="edit-premiumDoFollowPrice">
                        Do-Follow Price ($) *
                      </Label>
                      <Input
                        id="edit-premiumDoFollowPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.premiumDoFollowPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            premiumDoFollowPrice: e.target.value,
                          })
                        }
                        placeholder="499.00"
                      />
                    </div>
                    <div>
                      <Label
                        className="text-gray-300"
                        htmlFor="edit-premiumNoFollowPrice">
                        No-Follow Price ($) *
                      </Label>
                      <Input
                        id="edit-premiumNoFollowPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.premiumNoFollowPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            premiumNoFollowPrice: e.target.value,
                          })
                        }
                        placeholder="299.00"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-300" htmlFor="edit-description">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the website..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-gray-300" htmlFor="edit-guidelines">
                  Guidelines
                </Label>
                <Textarea
                  id="edit-guidelines"
                  value={formData.guidelines}
                  onChange={(e) =>
                    setFormData({ ...formData, guidelines: e.target.value })
                  }
                  placeholder="Content guidelines and requirements..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 text-primary">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingWebsite(null);
                    resetForm();
                  }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateWebsite}
                  className="bg-blue-600 hover:bg-blue-700">
                  Update Website
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
