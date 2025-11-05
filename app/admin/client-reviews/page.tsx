"use client";

import type React from "react";

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Star, Quote } from "lucide-react";
import { toast } from "sonner";
import {
  useReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  ReviewType,
} from "@/hooks/api/useReviews";

interface Review {
  id: string;
  name: string;
  company: string;
  rating: number;
  review: string;
  image?: string;
  createdAt: string;
}

export default function ClientReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    rating: 5,
    review: "",
    image: "",
  });

  // Use new API hooks
  const { data: reviewsData = [], isLoading, refetch } = useReviews();
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  useEffect(() => {
    // Map the new API data format to the old format
    if (reviewsData && reviewsData.length > 0) {
      const mappedReviews = reviewsData.map((review: ReviewType) => ({
        id: review._id || "",
        name: review.name,
        company: review.company,
        rating: review.rating,
        review: review.review,
        image: review.image,
        createdAt: review.createdAt || new Date().toISOString(),
      }));
      setReviews(mappedReviews);
    } else {
      setReviews([]);
    }
  }, [reviewsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.company || !formData.review) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editingReview) {
        // Update existing review
        await updateReviewMutation.mutateAsync({
          id: editingReview.id,
          reviewData: {
            name: formData.name,
            company: formData.company,
            rating: formData.rating,
            review: formData.review,
            image: formData.image || undefined,
          },
        });
        toast.success("Review Updated Successfully");
      } else {
        // Create new review
        await createReviewMutation.mutateAsync({
          name: formData.name,
          company: formData.company,
          rating: formData.rating,
          review: formData.review,
          image: formData.image || undefined,
        });
        toast.success("Review Added Successfully");
      }
      resetForm();
      setIsDialogOpen(false);
      refetch(); // Refresh the list
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      company: review.company,
      rating: review.rating,
      review: review.review,
      image: review.image || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReviewMutation.mutateAsync(id);
        toast.success("Review Deleted Successfully");
        refetch(); // Refresh the list
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      rating: 5,
      review: "",
      image: "",
    });
    setEditingReview(null);
  };

  const renderStars = (rating: number) => {
    if (typeof rating !== 'number' || rating < 0) return null;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Client Reviews Management
            </h1>
            <p className="text-gray-300 mt-2">
              Manage client testimonials and reviews
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingReview ? "Edit Review" : "Add New Review"}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingReview
                    ? "Update the client review details"
                    : "Add a new client testimonial"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">
                      Client Name *
                    </Label>
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
                    <Label htmlFor="company" className="text-gray-300">
                      Company *
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="rating" className="text-gray-300">
                    Rating
                  </Label>
                  <Select
                    value={Math.floor(formData.rating).toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        rating: Number.parseInt(value),
                      })
                    }>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem
                          key={rating}
                          value={rating.toString()}
                          className="text-white">
                          {rating} Star{rating !== 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="review" className="text-gray-300">
                    Review Text *
                  </Label>
                  <Textarea
                    id="review"
                    value={formData.review}
                    onChange={(e) =>
                      setFormData({ ...formData, review: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    placeholder="Enter the client's review..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image" className="text-gray-300">
                    Client Image URL (Optional)
                  </Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    {editingReview ? "Update Review" : "Add Review"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Reviews
              </CardTitle>
              <Quote className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {reviews.length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {reviews.length > 0
                  ? (
                      reviews.reduce(
                        (sum, review) => sum + Math.floor(review.rating),
                        0
                      ) / reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                5-Star Reviews
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {
                  reviews.filter((review) => Math.floor(review.rating) === 5)
                    .length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">All Reviews</CardTitle>
            <CardDescription className="text-gray-300">
              Manage all client testimonials and reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">
                  No reviews added yet. Add your first client review!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-white font-semibold mr-2">
                            {review.name}
                          </h3>
                          <span className="text-gray-400 text-sm">
                            from {review.company}
                          </span>
                          <div className="flex items-center ml-4">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-300 mb-2">"{review.review}"</p>
                        <p className="text-gray-500 text-xs">
                          Added on{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(review)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(review.id)}
                          className="border-red-600 text-red-400 hover:bg-red-900/20">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
