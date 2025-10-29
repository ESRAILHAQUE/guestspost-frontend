"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PurchaseModal } from "@/components/purchase-modal"
import { useBalance } from "@/hooks/use-balance"
import { ExternalLink, Clock, Users, Search, Filter, X, ShoppingCart } from "lucide-react"

const allWebsites = [
  // Standard Websites
  {
    name: "MSN",
    url: "https://www.msn.com/",
    da: 94,
    traffic: "55.4M",
    price: 220,
    niche: "General News & Blogs",
    delivery: "12–24 hrs",
    logo: "https://www.msn.com/favicon.ico",
    category: "standard",
  },
  {
    name: "AP News",
    url: "https://apnews.com/",
    da: 92,
    traffic: "16.6M",
    price: 265,
    niche: "General News & Blogs",
    delivery: "12–24 hrs",
    logo: "https://apnews.com/favicon.ico",
    category: "standard",
  },
  {
    name: "Barchart",
    url: "https://www.barchart.com/",
    da: 61,
    traffic: "4.1M",
    price: 295,
    niche: "Business & Finance",
    delivery: "24–72 hrs",
    logo: "https://www.barchart.com/favicon.ico",
    category: "standard",
  },
  {
    name: "Benzinga",
    url: "https://www.benzinga.com/",
    da: 87,
    traffic: "1.1M",
    price: 180,
    niche: "Business & Finance",
    delivery: "24–72 hrs",
    logo: "https://www.benzinga.com/favicon.ico",
    category: "standard",
  },
  {
    name: "Digital Journal",
    url: "https://www.digitaljournal.com/",
    da: 89,
    traffic: "200K",
    price: 180,
    niche: "Technology",
    delivery: "12–24 hrs",
    logo: "https://www.digitaljournal.com/favicon.ico",
    category: "standard",
  },
  {
    name: "Business Insider Markets",
    url: "https://markets.businessinsider.com/",
    da: 94,
    traffic: "41M",
    price: 990,
    niche: "Business & Finance",
    delivery: "24–72 hrs",
    logo: "https://www.businessinsider.com/public/assets/BI/US/icon/favicon.ico",
    category: "standard",
  },
  // Premium Websites
  {
    name: "Forbes",
    url: "https://www.forbes.com/",
    da: 95,
    traffic: "98.4M",
    price: 5000,
    niche: "Business & Finance",
    delivery: "3–4 weeks",
    logo: "https://www.forbes.com/favicon.ico",
    category: "premium",
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/",
    da: 93,
    traffic: "2.1M",
    price: 7000,
    niche: "Technology",
    delivery: "3–4 weeks",
    logo: "https://techcrunch.com/favicon.ico",
    category: "premium",
  },
  {
    name: "New York Times",
    url: "https://www.nytimes.com/",
    da: 95,
    traffic: "212.7M",
    price: 7000,
    niche: "General News & Blogs",
    delivery: "3–4 weeks",
    logo: "https://www.nytimes.com/favicon.ico",
    category: "premium",
  },
  {
    name: "BBC",
    url: "https://www.bbc.com/",
    da: 94,
    traffic: "40.8M",
    price: 2000,
    niche: "General News & Blogs",
    delivery: "3–4 weeks",
    logo: "https://www.bbc.com/favicon.ico",
    category: "premium",
  },
]

// Complete list of categories as provided
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
]

export function FilterableWebsiteCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedNiche, setSelectedNiche] = useState("all")
  const [daRange, setDaRange] = useState([0, 100])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const { balance } = useBalance();
  // console.log("filterable website", balance);
  

  // Filter websites based on all criteria
  const filteredWebsites = useMemo(() => {
    return allWebsites.filter((website) => {
      const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || website.category === selectedCategory
      const matchesNiche = selectedNiche === "all" || website.niche === selectedNiche
      const matchesDA = website.da >= daRange[0] && website.da <= daRange[1]
      const matchesPrice = website.price >= priceRange[0] && website.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesNiche && matchesDA && matchesPrice
    })
  }, [searchTerm, selectedCategory, selectedNiche, daRange, priceRange])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedNiche("all")
    setDaRange([0, 100])
    setPriceRange([0, 10000])
  }

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "all" ||
    selectedNiche !== "all" ||
    daRange[0] !== 0 ||
    daRange[1] !== 100 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000

  const handleBuyClick = (website: any) => {
    setSelectedItem({
      name: `${website.name} Guest Post`,
      price: website.price,
      description: `Guest post placement on ${website.name} (DA ${website.da}) with ${website.traffic} monthly traffic`,
      features: [
        `Domain Authority: ${website.da}`,
        `Monthly Traffic: ${website.traffic}`,
        `Category: ${website.niche}`,
        `Delivery: ${website.delivery}`,
      ],
    })
    setShowPurchaseModal(true)
  }

  const WebsiteCard = ({ website }: { website: any }) => {
    const hasEnoughBalance = Math.abs(balance) >= website.price

    return (
      <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
        <CardContent className="p-6">
          {/* Header with logo, name, URL and external link */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <img
                src={website.logo || "/placeholder.svg?height=32&width=32&text=" + website.name.charAt(0)}
                alt={`${website.name} logo`}
                className="h-8 w-8 object-contain rounded flex-shrink-0 mt-1"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=" + website.name.charAt(0)
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg leading-tight mb-1">{website.name}</h3>
                <p className="text-gray-400 text-sm truncate">{website.url}</p>
              </div>
            </div>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Domain Authority</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                DA {website.da}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center">
                <Users className="w-3 h-3 mr-1" />
                Traffic
              </span>
              <span className="text-white font-medium">{website.traffic}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Category</span>
              <span className="text-white text-xs">{website.niche}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Delivery
              </span>
              <span className="text-white">{website.delivery}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">${website.price.toLocaleString()}</div>
            <Button
              onClick={() => handleBuyClick(website)}
              className={`${
                hasEnoughBalance
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              } text-white`}
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Search and Filter Controls */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search websites by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters && <Badge className="ml-2 bg-blue-500 text-white">Active</Badge>}
            </Button>

            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="ghost" className="text-gray-400 hover:text-white">
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card className="bg-white/5 border-white/10 mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Website Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website Type</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="standard">Standard Sites</SelectItem>
                        <SelectItem value="premium">Premium Sites</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20 max-h-60">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* DA Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Domain Authority: {daRange[0]} - {daRange[1]}
                    </label>
                    <Slider value={daRange} onValueChange={setDaRange} max={100} min={0} step={1} className="mt-2" />
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {filteredWebsites.length} of {allWebsites.length} websites
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>

        {/* Website Grid */}
        {filteredWebsites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((website, index) => (
              <WebsiteCard key={index} website={website} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No websites found matching your criteria</div>
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Purchase Modal */}
        <PurchaseModal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} item={selectedItem} />
      </div>
    </section>
  )
}
