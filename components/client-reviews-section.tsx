"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { endpoints } from "@/lib/api/client";

interface Review {
  id?: string;
  name: string;
  company: string;
  rating: number;
  review: string;
  image?: string;
  createdAt: string;
}

interface ClientReviewsSectionProps {
  title?: string;
  description?: string;
}

export function ClientReviewsSection({
  title = "What Our Clients Say",
  description = "Don't just take our word for it - hear from our satisfied clients who have grown their businesses with our guest posting services",
}: ClientReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await endpoints.reviews.getReviews();
      const reviewsData = Array.isArray(response?.data) ? response.data : [];
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="bg-white">
        <section className="py-20 px-4 bg-primary/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="h-8 bg-primary/20 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-primary/20 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-primary/20 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      <section className="bg-primary/5">
        <div className="w-full py-20 px-4 h-auto bg-primary/5">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                {title}
              </h2>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
                {description}
              </p>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <Card
                  key={review.id || `review-${index}`}
                  className="bg-secondary border-primary/20 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="h-8 w-8 text-blue-400" />
                    </div>

                    {/* Review Text */}
                    <p className="text-primary mb-6 leading-relaxed">
                      "{review.review}"
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {renderStars(review.rating)}
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center gap-2">
                      {review.image &&
                      review.image !== "0" &&
                      parseInt(review.image) !== 0 ? (
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <img
                            src="/images/user-avatar.jpg" // Adjusted path; ensure it matches your project
                            alt={`${review.name}'s avatar`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-primary font-semibold">
                          {review.name}
                        </h4>
                        <p className="text-gray-800 text-sm">
                          {review.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
