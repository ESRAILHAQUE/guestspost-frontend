"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseModal } from "@/components/purchase-modal";
import { useBalance } from "@/hooks/use-balance";
import { Clock, Search, Filter, X, ShoppingCart, Globe } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { useWebsites } from "@/hooks/api/useWebsites";
import { useCurrentUser } from "@/hooks/api/useUsers";
import { Website } from "@/types/api";

const categories = [
  "Business & Finance",
  "Technology",
  "Health & Wellness",
  "Lifestyle",
  "Travel",
  "Digital Marketing",
  "Education",
  "Home & Garden",
  "Entertainment",
  "Sports",
  "Automotive",
  "Law & Legal",
  "Environment & Green Energy",
  "Shopping & Coupons",
  "Pets & Animals",
  "Food & Recipes",
  "Real Estate",
  "Fashion & Beauty",
  "Career & Jobs",
  "General News & Blogs",
  "General",
];

interface UnifiedWebsiteCatalogProps {
  showTitle?: boolean;
  title?: string;
  description?: string;
  maxItems?: number;
  showViewAllButton?: boolean;
}

export function UnifiedWebsiteCatalog({
  showTitle = true,
  title = "Website Catalog",
  description = "Browse and select from our premium website collection.",
  maxItems,
  showViewAllButton = false,
}: UnifiedWebsiteCatalogProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [daRange, setDaRange] = useState([0, 100]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [trafficRange, setTrafficRange] = useState([0, 2000000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Use React Query hooks
  const { data: websites = [], isLoading: websitesLoading } = useWebsites();
  const { data: user } = useCurrentUser();
  const { balance, isLoading: balanceLoading } = useBalance();

  const isLoggedIn = !!user;

  const parseTraffic = (traffic: any) => {
    if (!traffic || typeof traffic !== "string") return 0;

    const cleanTraffic = traffic.toLowerCase().replace(/[^0-9km.]/g, "");
    const multiplier = cleanTraffic.endsWith("m")
      ? 1000000
      : cleanTraffic.endsWith("k")
      ? 1000
      : 1;
    const number = parseFloat(cleanTraffic.replace(/[km]/g, ""));
    return isNaN(number) ? 0 : number * multiplier;
  };

  const formatTraffic = (value: any) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const getFilteredWebsites = (tabCategory: string) => {
    if (!Array.isArray(websites)) return [];

    let filteredWebsites = [...websites];

    // Filter by tab category
    if (tabCategory === "standard") {
      filteredWebsites = filteredWebsites.filter(
        (site) => site.section === "standard"
      );
    } else if (tabCategory === "premium") {
      filteredWebsites = filteredWebsites.filter(
        (site) => site.section === "premium"
      );
    }

    // Apply other filters
    filteredWebsites = filteredWebsites.filter((website) => {
      const traffic = parseTraffic(website.traffic);
      const matchesSearch =
        website.name &&
        website.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNiche =
        selectedNiche === "all" ||
        website.niche === selectedNiche ||
        website.category === selectedNiche;
      const matchesDA = website.da >= daRange[0] && website.da <= daRange[1];
      const matchesPrice =
        website.doFollowPrice >= priceRange[0] &&
        website.doFollowPrice <= priceRange[1];
      const matchesTraffic =
        traffic >= trafficRange[0] && traffic <= trafficRange[1];

      return (
        matchesSearch &&
        matchesNiche &&
        matchesDA &&
        matchesPrice &&
        matchesTraffic
      );
    });

    // Client-side pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedWebsites = filteredWebsites.slice(startIndex, endIndex);

    // Limit items if maxItems specified
    if (maxItems && paginatedWebsites.length > 0) {
      return paginatedWebsites.slice(0, maxItems);
    }

    return paginatedWebsites;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedNiche("all");
    setDaRange([0, 100]);
    setPriceRange([0, 10000]);
    setTrafficRange([0, 10000000]);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedNiche !== "all" ||
    daRange[0] !== 0 ||
    daRange[1] !== 100 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000 ||
    trafficRange[0] !== 0 ||
    trafficRange[1] !== 10000000;

  const handleBuyClick = (
    website: any,
    linkType: "dofollow" | "nofollow" = "dofollow"
  ) => {
    if (!isLoggedIn || !user) {
      window.location.href = "/signup";
      return;
    }

    const price =
      website.section === "premium"
        ? linkType === "dofollow"
          ? website.premiumDoFollowPrice || website.doFollowPrice
          : website.premiumNoFollowPrice || website.noFollowPrice
        : website.standardPrice || website.doFollowPrice;

    setSelectedItem({
      name: `${website.name} Guest Post (${
        linkType === "dofollow" ? "Do-Follow" : "No-Follow"
      })`,
      price: price,
      description: `Guest post placement on ${website.name} (DA ${website.da}) with ${website.traffic} monthly traffic`,
      features: [
        `Domain Authority: ${website.da}`,
        `Monthly Traffic: ${website.traffic}`,
        `Category: ${website.niche || website.category}`,
        `Delivery: ${website.delivery}`,
        `Link Type: ${linkType === "dofollow" ? "Do-Follow" : "No-Follow"}`,
      ],
    });
    setShowPurchaseModal(true);
  };

  const WebsiteCard = ({ website }: { website: Website }) => {
    const [selectedLinkType, setSelectedLinkType] = useState<
      "dofollow" | "nofollow"
    >("dofollow");

    const currentPrice =
      website.section === "premium"
        ? selectedLinkType === "dofollow"
          ? website.premiumDoFollowPrice || website.doFollowPrice
          : website.premiumNoFollowPrice || website.noFollowPrice
        : website.standardPrice || website.doFollowPrice;

    return (
      <TableBody className="border-b border-primary/10">
        <TableRow>
          <TableCell className="font-medium">
            <div className="flex flex-col gap-1">
              <h3 className="text-primary font-semibold text-sm leading-tight mb-1">
                {website.name || "Website"}
              </h3>

              <a
                href={website.url || "#"}
                target="_blank"
                rel="noopener noreferrer">
                <p className="text-blue-500 text-sm hover:text-blue-400 truncate">
                  {website.url.length > 20
                    ? website.url.slice(0, 19) + "..."
                    : website.url || ""}
                </p>
              </a>
              <p className="text-gray-700 flex gap-1 hover:text-primary transition-colors flex-shrink-0 mt-2">
                {selectedLinkType === "dofollow" ? "Do Follow" : "No Follow"}
              </p>
            </div>
          </TableCell>
          <TableCell className="text-center">
            <p className="text-secondary bg-blue-500 mx-auto w-fit px-3 py-1 rounded-xl text-xs">
              {website.niche || website.category || "General"}
            </p>
          </TableCell>
          <TableCell className="text-center space-x-2 text-primary">
            <div className="flex justify-center gap-1 items-center">
              <Image
                src={"/images/da_logo.png"}
                alt="da_logo"
                width={24}
                height={24}
              />{" "}
              {website.da || 0}
            </div>
          </TableCell>
          <TableCell className="text-center text-primary">
            <div className="flex justify-center gap-2">
              <Image
                src={"/images/dr_logo.jpeg"}
                alt="dr_logo"
                width={24}
                height={24}
              />
              {website.dr || 0}
            </div>
          </TableCell>
          <TableCell className="text-center">
            <span className="text-primary font-medium">
              Traffic: {website.traffic || "N/A"}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-1 items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Delivery
              </span>
              <span className="text-primary">
                {website.delivery || "3-5 days"}
              </span>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <div className="text-base font-bold text-blue-500">
              ${(Math.floor(currentPrice) || 0).toLocaleString()}
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Button
              onClick={() => handleBuyClick(website, selectedLinkType)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  };

  const WebsiteSection = ({ tabCategory }: { tabCategory: string }) => {
    const filteredWebsites = getFilteredWebsites(tabCategory);
    const totalPages = Math.ceil((Array.isArray(websites) ? websites.length : 0) / itemsPerPage);

    return (
      <div className="bg-white">
        <div className="mb-6">
          <p className="text-gray-800">
            Showing {filteredWebsites.length} websites
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>

        {filteredWebsites.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="min-w-max">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Websites</TableHead>
                    <TableHead className="text-center">Category</TableHead>
                    <TableHead className="text-center">
                      Domain Authority
                    </TableHead>
                    <TableHead className="text-center">Domain Rating</TableHead>
                    <TableHead className="text-center">Traffic</TableHead>
                    <TableHead className="w-[150px]">Delivery Time</TableHead>
                    <TableHead className="text-right w-[100px]">
                      Price
                    </TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {filteredWebsites.map((website, index) => (
                  <WebsiteCard
                    key={`${tabCategory}-${website.id || index}`}
                    website={website}
                  />
                ))}
              </Table>
            </div>
            {Array.isArray(filteredWebsites) && filteredWebsites.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  Previous
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages || 0 }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                        }`}>
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage >= (totalPages || 0)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            {websitesLoading ? (
              <>
                <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="h-4 w-4 rounded-full border border-primary animate-spin mx-auto"></div>
                <p className="text-gray-500 mb-6">Loading Websites</p>
              </>
            ) : (
              <>
                <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-400 text-lg mb-4">
                  {!websites || websites.length === 0
                    ? "No websites available yet"
                    : "No websites found matching your criteria"}
                </div>
                <p className="text-gray-500 mb-6">
                  {!websites || websites.length === 0
                    ? "Websites will appear here once they are added by the admin."
                    : "Try adjusting your search criteria or clearing the filters."}
                </p>
                {hasActiveFilters && websites && websites.length > 0 && (
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    Clear Filters
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // Don't show full screen loading - let hero section show
  // Loading state will be handled in the catalog section itself

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">{title}</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        )}

        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
            <Input
              placeholder="Search websites by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-primary/10 border-primary/20 text-primary/80 placeholder-gray-400 h-12 text-lg"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-blue-500/30 text-white hover:bg-blue-500/90 hover:text-secondary bg-blue-500">
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters && (
                <Badge className="ml-2 bg-secondary hover:text-secondary text-primary">
                  Active
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                className="text-secondary hover:bg-blue-500/80 bg-blue-500 hover:text-white">
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="bg-primary/10 text-primary/70 border-white/10 mb-6 rounded-lg p-6 flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger className="bg-white border-white/20 text-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-400 border-white/20 text-secondary/90 max-h-60">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Domain Authority: {daRange[0]} - {daRange[1]}
                  </label>
                  <Slider
                    value={daRange}
                    onValueChange={setDaRange}
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000}
                    min={0}
                    step={50}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Traffic: {formatTraffic(trafficRange[0])} -{" "}
                    {formatTraffic(trafficRange[1])}
                  </label>
                  <Slider
                    value={trafficRange}
                    onValueChange={setTrafficRange}
                    max={10000000}
                    min={0}
                    step={1000}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 gap-3 mb-8 bg-white/10">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-500 text-primary/70 bg-primary/10 hover:bg-primary/20 hover:text-primary data-[state=active]:text-white">
              All Sites ({getFilteredWebsites("all").length})
            </TabsTrigger>
            <TabsTrigger
              value="standard"
              className="data-[state=active]:bg-blue-500 text-primary/70 bg-primary/10 hover:bg-primary/20 hover:text-primary data-[state=active]:text-white">
              Standard ({getFilteredWebsites("standard").length})
            </TabsTrigger>
            <TabsTrigger
              value="premium"
              className="data-[state=active]:bg-blue-500 text-primary/70 bg-primary/10 hover:bg-primary/20 hover:text-primary data-[state=active]:text-white">
              Premium ({getFilteredWebsites("premium").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <WebsiteSection tabCategory="all" />
          </TabsContent>

          <TabsContent value="standard">
            <WebsiteSection tabCategory="standard" />
          </TabsContent>

          <TabsContent value="premium">
            <WebsiteSection tabCategory="premium" />
          </TabsContent>
        </Tabs>

        {showViewAllButton && websites && websites.length > 0 && (
          <div className="text-center mt-12">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg">
              <a href="/catalog">View All Websites</a>
            </Button>
            <p className="text-gray-400 mt-4">
              Browse our complete website catalog
            </p>
          </div>
        )}

        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          item={selectedItem}
        />
      </div>
    </section>
  );
}
