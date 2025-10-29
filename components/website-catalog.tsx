"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBalance } from "@/hooks/use-balance";
import { PurchaseModal } from "@/components/purchase-modal";
import { ExternalLink, Clock, Users, ShoppingCart } from "lucide-react";
import { useCurrentUser } from "@/hooks/api/useUsers";

const standardWebsites = [
  {
    id: 1,
    name: "MSN",
    url: "https://www.msn.com/",
    da: 94,
    traffic: "55.4M",
    doFollowPrice: 220,
    noFollowPrice: 180,
    niche: "All Niches",
    delivery: "12–24 hrs",
    logo: "https://www.msn.com/favicon.ico",
    section: "standard",
  },
  {
    id: 2,
    name: "AP News",
    url: "https://apnews.com/",
    da: 92,
    traffic: "16.6M",
    doFollowPrice: 265,
    noFollowPrice: 220,
    niche: "All Niches",
    delivery: "12–24 hrs",
    logo: "https://apnews.com/favicon.ico",
    section: "standard",
  },
  {
    id: 3,
    name: "Barchart",
    url: "https://www.barchart.com/",
    da: 61,
    traffic: "4.1M",
    doFollowPrice: 295,
    noFollowPrice: 250,
    niche: "All Niches",
    delivery: "24–72 hrs",
    logo: "https://www.barchart.com/favicon.ico",
    section: "standard",
  },
  {
    id: 4,
    name: "Benzinga",
    url: "https://www.benzinga.com/",
    da: 87,
    traffic: "1.1M",
    doFollowPrice: 180,
    noFollowPrice: 150,
    niche: "All Niches",
    delivery: "24–72 hrs",
    logo: "https://www.benzinga.com/favicon.ico",
    section: "standard",
  },
  {
    id: 5,
    name: "Digital Journal",
    url: "https://www.digitaljournal.com/",
    da: 89,
    traffic: "200K",
    doFollowPrice: 180,
    noFollowPrice: 150,
    niche: "All Niches",
    delivery: "12–24 hrs",
    logo: "https://www.digitaljournal.com/favicon.ico",
    section: "standard",
  },
  {
    id: 6,
    name: "Business Insider Markets",
    url: "https://markets.businessinsider.com/",
    da: 94,
    traffic: "41M",
    doFollowPrice: 990,
    noFollowPrice: 800,
    niche: "All Niches",
    delivery: "24–72 hrs",
    logo: "https://www.businessinsider.com/public/assets/BI/US/icon/favicon.ico",
    section: "standard",
  },
];

const premiumWebsites = [
  {
    id: 7,
    name: "Forbes",
    url: "https://www.forbes.com/",
    da: 95,
    traffic: "98.4M",
    doFollowPrice: 5000,
    noFollowPrice: 4200,
    niche: "All Niches",
    delivery: "3–4 weeks",
    logo: "https://www.forbes.com/favicon.ico",
    section: "premium",
  },
  {
    id: 8,
    name: "TechCrunch",
    url: "https://techcrunch.com/",
    da: 93,
    traffic: "2.1M",
    doFollowPrice: 7000,
    noFollowPrice: 6000,
    niche: "All Niches",
    delivery: "3–4 weeks",
    logo: "https://techcrunch.com/favicon.ico",
    section: "premium",
  },
  {
    id: 9,
    name: "New York Times",
    url: "https://www.nytimes.com/",
    da: 95,
    traffic: "212.7M",
    doFollowPrice: 7000,
    noFollowPrice: 6000,
    niche: "All Niches",
    delivery: "3–4 weeks",
    logo: "https://www.nytimes.com/favicon.ico",
    section: "premium",
  },
  {
    id: 10,
    name: "BBC",
    url: "https://www.bbc.com/",
    da: 94,
    traffic: "40.8M",
    doFollowPrice: 2000,
    noFollowPrice: 1700,
    niche: "All Niches",
    delivery: "3–4 weeks",
    logo: "https://www.bbc.com/favicon.ico",
    section: "premium",
  },
  {
    id: 11,
    name: "Business Insider",
    url: "https://www.businessinsider.com/",
    da: 94,
    traffic: "20.2M",
    doFollowPrice: 1500,
    noFollowPrice: 1200,
    niche: "All Niches",
    delivery: "3–4 weeks",
    logo: "https://www.businessinsider.com/favicon.ico",
    section: "premium",
  },
  {
    id: 12,
    name: "Bloomberg",
    url: "https://www.bloomberg.com/",
    da: 94,
    traffic: "10.9M",
    doFollowPrice: 1500,
    noFollowPrice: 1200,
    niche: "All Niches",
    delivery: "3–4 weeks",
    logo: "https://www.bloomberg.com/favicon.ico",
    section: "premium",
  },
];

export function WebsiteCatalog() {
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { balance } = useBalance();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  const handleBuyClick = (
    website: any,
    linkType: "dofollow" | "nofollow" = "dofollow",
    isPremium = false
  ) => {
    const price =
      linkType === "dofollow" ? website.doFollowPrice : website.noFollowPrice;

    setSelectedItem({
      name: `${website.name} Guest Post (${
        linkType === "dofollow" ? "Do-Follow" : "No-Follow"
      })`,
      price: price,
      description: `Guest post placement on ${website.name} (DA ${website.da}) with ${website.traffic} monthly traffic`,
      features: [
        `Domain Authority: ${website.da}`,
        `Monthly Traffic: ${website.traffic}`,
        `Category: ${website.niche}`,
        `Delivery: ${website.delivery}`,
        `Link Type: ${linkType === "dofollow" ? "Do-Follow" : "No-Follow"}`,
      ],
    });
    setShowPurchaseModal(true);
  };

  const WebsiteCard = ({
    website,
    isPremium = false,
  }: {
    website: any;
    isPremium?: boolean;
  }) => {
    const [selectedLinkType, setSelectedLinkType] = useState<
      "dofollow" | "nofollow"
    >("dofollow");

    const currentPrice =
      selectedLinkType === "dofollow"
        ? website.doFollowPrice
        : website.noFollowPrice;

    return (
      <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
        <CardContent className="p-6">
          {/* Header with logo, name, URL and external link */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <img
                src={
                  website.logo ||
                  "/placeholder.svg?height=32&width=32&text=" +
                    website.name.charAt(0)
                }
                alt={`${website.name} logo`}
                className="h-8 w-8 object-contain rounded flex-shrink-0 mt-1"
                onError={(e) => {
                  e.currentTarget.src =
                    "/placeholder.svg?height=32&width=32&text=" +
                    website.name.charAt(0);
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg leading-tight mb-1">
                  {website.name}
                </h3>
                <p className="text-gray-400 text-sm truncate">{website.url}</p>
              </div>
            </div>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">Domain Authority</span>
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-300">
                DA {website.da}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white flex items-center">
                <Users className="w-3 h-3 mr-1" />
                Traffic
              </span>
              <span className="text-white font-medium">{website.traffic}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white">Niche</span>
              <span className="text-white">{website.niche}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Delivery
              </span>
              <span className="text-white">{website.delivery}</span>
            </div>
          </div>

          {/* Link Type Selection - Only for Premium websites */}
          {isPremium && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Link Type
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedLinkType("dofollow")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedLinkType === "dofollow"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}>
                  Do-Follow
                </button>
                <button
                  onClick={() => setSelectedLinkType("nofollow")}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedLinkType === "nofollow"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}>
                  No-Follow
                </button>
              </div>
            </div>
          )}

          {/* Price and Buy Button */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white">
                ${currentPrice}
              </span>
              <span className="text-gray-400 text-sm ml-1">USD</span>
            </div>
            <Button
              onClick={() =>
                handleBuyClick(
                  website,
                  isPremium ? selectedLinkType : "dofollow",
                  isPremium
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              disabled={Math.abs(balance) < currentPrice}>
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Now</span>
            </Button>
          </div>

          {Math.abs(balance) < currentPrice && (
            <p className="text-red-400 text-xs mt-2">
              Insufficient balance. Add funds to purchase.
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const allWebsites = [...standardWebsites, ...premiumWebsites];
  const filteredWebsites =
    activeTab === "all"
      ? allWebsites
      : activeTab === "standard"
      ? standardWebsites
      : premiumWebsites;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Website Catalog
          </h1>
          <p className="text-gray-300 text-lg">
            Choose from our premium selection of high-authority websites
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-lg p-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "all"
                  ? "bg-white text-gray-900 font-medium"
                  : "text-white hover:bg-white/10"
              }`}>
              All Websites
            </button>
            <button
              onClick={() => setActiveTab("standard")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "standard"
                  ? "bg-white text-gray-900 font-medium"
                  : "text-white hover:bg-white/10"
              }`}>
              Standard
            </button>
            <button
              onClick={() => setActiveTab("premium")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "premium"
                  ? "bg-white text-gray-900 font-medium"
                  : "text-white hover:bg-white/10"
              }`}>
              Premium
            </button>
          </div>
        </div>

        {/* Website Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              isPremium={website.section === "premium"}
            />
          ))}
        </div>

        {filteredWebsites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No websites found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedItem && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          item={selectedItem}
        />
      )}
    </div>
  );
}
