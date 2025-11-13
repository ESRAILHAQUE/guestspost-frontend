"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PurchaseModal } from "@/components/purchase-modal";
import { useBalance } from "@/hooks/use-balance";
import { CheckCircle, Star, ShoppingCart, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { endpoints } from "@/lib/api/client";
import { useCurrentUser } from "@/hooks/api/useUsers";

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  offer?: boolean;
  createdAt: string;
}

export function PricingSection() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { balance } = useBalance();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await endpoints.packages.getPackages({
          status: "active",
        });
        const savedPackages = response.data;
        if (Array.isArray(savedPackages) && savedPackages.length > 0) {
          const sortedPackages = savedPackages.sort((a: any, b: any) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          setPackages(sortedPackages);
        } else {
          // Default packages if none exist
          const defaultPackages = [
            {
              id: "1",
              name: "Starter Package",
              price: 299,
              description:
                "Perfect for small businesses looking to establish their online presence",
              features: [
                "5 High-Quality Guest Posts",
                "DA 30+ Websites",
                "Content Writing Included",
                "Basic SEO Optimization",
                "Monthly Report",
              ],
              createdAt: new Date().toISOString(),
            },
            {
              id: "2",
              name: "Professional Package",
              price: 599,
              description:
                "Ideal for growing businesses that need comprehensive link building",
              features: [
                "10 High-Quality Guest Posts",
                "DA 40+ Websites",
                "Premium Content Writing",
                "Advanced SEO Optimization",
                "Bi-weekly Reports",
                "Social Media Promotion",
              ],
              popular: true,
              createdAt: new Date().toISOString(),
            },
            {
              id: "3",
              name: "Enterprise Package",
              price: 1199,
              description:
                "For established businesses requiring maximum authority and reach",
              features: [
                "20 High-Quality Guest Posts",
                "DA 50+ Websites",
                "Expert Content Writing",
                "Full SEO Strategy",
                "Weekly Reports",
                "Social Media Campaign",
                "Dedicated Account Manager",
              ],
              createdAt: new Date().toISOString(),
            },
          ];
          setPackages(defaultPackages);
        }
      } catch (error) {
        console.error("Error loading packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPackages();
  }, []);

  const handleBuyClick = (pkg: Package) => {
    // Check if user is logged in using the correct localStorage keys
    let isLoggedIn = false;
    let userEmail = null;
    if (user) {
      isLoggedIn = true;
      userEmail = user.user_email;
    }

    // console.log("Buy click - Login check:", { isLoggedIn, userEmail })

    if (!isLoggedIn || !userEmail) {
      alert("Please log in to make a purchase");
      window.location.href = "/login";
      return;
    }

    setSelectedItem({
      name: `${pkg.name} - Guest Post Package`,
      price: pkg.price,
      type: "guest-post-package",
      description: pkg.description,
      features: pkg.features,
    });
    setShowPurchaseModal(true);
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center text-primary">Loading packages...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`${
                Boolean(pkg.popular)
                  ? "mt-5 bg-gradient-to-b from-purple-200/80 from-10% via-secondary via-30% to-secondary to-60%"
                  : "bg-secondary"
              } border-primary/20 hover:bg-primary/5 transition-all duration-300 relative ${
                Boolean(pkg.popular)
                  ? "ring-2 ring-purple-500/50 scale-105"
                  : "scale-95"
              }  ${
                Boolean(pkg.offer)
                  ? "ring-2 ring-emerald-500/50 scale-110"
                  : "scale-95"
              } ${
                Boolean(pkg.offer)
                  ? "mt-5 bg-gradient-to-b from-emerald-200/80 from-10% via-secondary via-30% to-secondary to-60%"
                  : "bg-secondary"
              }`}>
              {Boolean(pkg.popular) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              {Boolean(pkg.offer) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Best Offer
                  </div>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-primary mb-2">
                  {pkg.name}
                </CardTitle>
                <div className="text-4xl font-bold text-primary mb-4">
                  ${pkg.price}
                  <span className="text-lg font-normal text-gray-900">
                    /package
                  </span>
                </div>
                <CardDescription className="text-gray-800 text-base">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {Array.isArray(pkg.features) && pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleBuyClick(pkg)}
                  className={`w-full py-3 text-lg font-semibold ${
                    pkg.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  }`}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-primary mb-4">Need a custom solution?</p>
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent">
            Contact Sales
          </Button>
        </div>

        {/* Purchase Modal */}
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          item={selectedItem}
        />
      </div>
    </section>
  );
}
