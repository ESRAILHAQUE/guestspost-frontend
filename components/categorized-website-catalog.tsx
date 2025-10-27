"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PurchaseModal } from "@/components/purchase-modal"
import { useBalance } from "@/hooks/use-balance"
import { ExternalLink, Clock, Users, Search, Filter, X, ShoppingCart } from "lucide-react"

// Hardcoded websites (existing data)
const hardcodedWebsites = [
  // Standard Websites
  {
    name: "MSN",
    url: "https://www.msn.com/",
    da: 94,
    traffic: "55.4M",
    doFollowPrice: 220,
    noFollowPrice: 180,
    niche: "General News & Blogs",
    delivery: "12–24 hrs",
    logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
    category: "standard",
    section: "standard",
  },
  {
    name: "AP News",
    url: "https://apnews.com/",
    da: 92,
    traffic: "16.6M",
    doFollowPrice: 265,
    noFollowPrice: 220,
    niche: "General News & Blogs",
    delivery: "12–24 hrs",
    logo: "https://apnews.com/apple-touch-icon.png",
    category: "standard",
    section: "standard",
  },
  {
    name: "Barchart",
    url: "https://www.barchart.com/",
    da: 61,
    traffic: "4.1M",
    doFollowPrice: 295,
    noFollowPrice: 245,
    niche: "Business & Finance",
    delivery: "24–72 hrs",
    logo: "https://www.barchart.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Benzinga",
    url: "https://www.benzinga.com/",
    da: 87,
    traffic: "1.1M",
    doFollowPrice: 180,
    noFollowPrice: 150,
    niche: "Business & Finance",
    delivery: "24–72 hrs",
    logo: "https://www.benzinga.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Digital Journal",
    url: "https://www.digitaljournal.com/",
    da: 89,
    traffic: "200K",
    doFollowPrice: 180,
    noFollowPrice: 150,
    niche: "Technology",
    delivery: "12–24 hrs",
    logo: "https://www.digitaljournal.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Business Insider Markets",
    url: "https://markets.businessinsider.com/",
    da: 94,
    traffic: "41M",
    doFollowPrice: 990,
    noFollowPrice: 820,
    niche: "Business & Finance",
    delivery: "24–72 hrs",
    logo: "https://www.businessinsider.com/public/assets/BI/US/icon/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "NY Weekly",
    url: "https://nyweekly.com/",
    da: 57,
    traffic: "50K",
    doFollowPrice: 155,
    noFollowPrice: 125,
    niche: "Fashion & Beauty",
    delivery: "24–72 hrs",
    logo: "https://nyweekly.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "IPS News",
    url: "https://www.ipsnews.net/",
    da: 82,
    traffic: "80K",
    doFollowPrice: 80,
    noFollowPrice: 65,
    niche: "General News & Blogs",
    delivery: "Instant",
    logo: "https://www.ipsnews.net/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Fintech News",
    url: "https://www.fintechnews.org/",
    da: 61,
    traffic: "15K",
    doFollowPrice: 300,
    noFollowPrice: 250,
    niche: "Business & Finance",
    delivery: "24–72 hrs",
    logo: "https://www.fintechnews.org/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Outlook India",
    url: "https://www.outlookindia.com/",
    da: 89,
    traffic: "26.6M",
    doFollowPrice: 290,
    noFollowPrice: 240,
    niche: "General News & Blogs",
    delivery: "24–72 hrs",
    logo: "https://www.outlookindia.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Health Line",
    url: "https://www.healthline.com/",
    da: 91,
    traffic: "85.2M",
    doFollowPrice: 450,
    noFollowPrice: 380,
    niche: "Health & Wellness",
    delivery: "24–72 hrs",
    logo: "https://www.healthline.com/hlcmsresource/images/frontend-static/health-nav/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Travel Weekly",
    url: "https://www.travelweekly.com/",
    da: 78,
    traffic: "1.2M",
    doFollowPrice: 320,
    noFollowPrice: 270,
    niche: "Travel",
    delivery: "24–72 hrs",
    logo: "https://www.travelweekly.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Marketing Land",
    url: "https://marketingland.com/",
    da: 85,
    traffic: "890K",
    doFollowPrice: 380,
    noFollowPrice: 320,
    niche: "Digital Marketing",
    delivery: "24–72 hrs",
    logo: "https://marketingland.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Education Week",
    url: "https://www.edweek.org/",
    da: 83,
    traffic: "2.1M",
    doFollowPrice: 340,
    noFollowPrice: 290,
    niche: "Education",
    delivery: "24–72 hrs",
    logo: "https://www.edweek.org/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Better Homes & Gardens",
    url: "https://www.bhg.com/",
    da: 88,
    traffic: "45.3M",
    doFollowPrice: 520,
    noFollowPrice: 440,
    niche: "Home & Garden",
    delivery: "24–72 hrs",
    logo: "https://www.bhg.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Entertainment Weekly",
    url: "https://ew.com/",
    da: 86,
    traffic: "12.4M",
    doFollowPrice: 410,
    noFollowPrice: 350,
    niche: "Entertainment",
    delivery: "24–72 hrs",
    logo: "https://ew.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "ESPN",
    url: "https://www.espn.com/",
    da: 95,
    traffic: "98.7M",
    doFollowPrice: 890,
    noFollowPrice: 750,
    niche: "Sports",
    delivery: "24–72 hrs",
    logo: "https://www.espn.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Car and Driver",
    url: "https://www.caranddriver.com/",
    da: 84,
    traffic: "8.9M",
    doFollowPrice: 360,
    noFollowPrice: 310,
    niche: "Automotive",
    delivery: "24–72 hrs",
    logo: "https://www.caranddriver.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Law.com",
    url: "https://www.law.com/",
    da: 82,
    traffic: "1.8M",
    doFollowPrice: 480,
    noFollowPrice: 410,
    niche: "Law & Legal",
    delivery: "24–72 hrs",
    logo: "https://www.law.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Green Tech Media",
    url: "https://www.greentechmedia.com/",
    da: 79,
    traffic: "650K",
    doFollowPrice: 420,
    noFollowPrice: 360,
    niche: "Environment & Green Energy",
    delivery: "24–72 hrs",
    logo: "https://www.greentechmedia.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "RetailMeNot",
    url: "https://www.retailmenot.com/",
    da: 87,
    traffic: "23.4M",
    doFollowPrice: 350,
    noFollowPrice: 300,
    niche: "Shopping & Coupons",
    delivery: "24–72 hrs",
    logo: "https://www.retailmenot.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "PetMD",
    url: "https://www.petmd.com/",
    da: 81,
    traffic: "4.2M",
    doFollowPrice: 290,
    noFollowPrice: 250,
    niche: "Pets & Animals",
    delivery: "24–72 hrs",
    logo: "https://www.petmd.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Food Network",
    url: "https://www.foodnetwork.com/",
    da: 90,
    traffic: "67.8M",
    doFollowPrice: 580,
    noFollowPrice: 490,
    niche: "Food & Recipes",
    delivery: "24–72 hrs",
    logo: "https://www.foodnetwork.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Realtor.com",
    url: "https://www.realtor.com/",
    da: 92,
    traffic: "89.3M",
    doFollowPrice: 650,
    noFollowPrice: 550,
    niche: "Real Estate",
    delivery: "24–72 hrs",
    logo: "https://www.realtor.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  {
    name: "Indeed Career Guide",
    url: "https://www.indeed.com/career-advice",
    da: 94,
    traffic: "156.2M",
    doFollowPrice: 720,
    noFollowPrice: 610,
    niche: "Career & Jobs",
    delivery: "24–72 hrs",
    logo: "https://www.indeed.com/favicon.ico",
    category: "standard",
    section: "standard",
  },
  // Premium Websites
  {
    name: "Forbes",
    url: "https://www.forbes.com/",
    da: 95,
    traffic: "98.4M",
    doFollowPrice: 5000,
    noFollowPrice: 4200,
    niche: "Business & Finance",
    delivery: "3–4 weeks",
    logo: "https://www.forbes.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/",
    da: 93,
    traffic: "2.1M",
    doFollowPrice: 7000,
    noFollowPrice: 5900,
    niche: "Technology",
    delivery: "3–4 weeks",
    logo: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
    category: "premium",
    section: "premium",
  },
  {
    name: "New York Times",
    url: "https://www.nytimes.com/",
    da: 95,
    traffic: "212.7M",
    doFollowPrice: 7000,
    noFollowPrice: 5900,
    niche: "General News & Blogs",
    delivery: "3–4 weeks",
    logo: "https://www.nytimes.com/vi-assets/static-assets/favicon-4bf96cb6a1093748bf5b3c429accb9b4.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "BBC",
    url: "https://www.bbc.com/",
    da: 94,
    traffic: "40.8M",
    doFollowPrice: 2000,
    noFollowPrice: 1700,
    niche: "General News & Blogs",
    delivery: "3–4 weeks",
    logo: "https://www.bbc.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Business Insider",
    url: "https://www.businessinsider.com/",
    da: 94,
    traffic: "20.2M",
    doFollowPrice: 1500,
    noFollowPrice: 1300,
    niche: "Business & Finance",
    delivery: "3–4 weeks",
    logo: "https://www.businessinsider.com/public/assets/BI/US/icon/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Bloomberg",
    url: "https://www.bloomberg.com/",
    da: 94,
    traffic: "10.9M",
    doFollowPrice: 1500,
    noFollowPrice: 1300,
    niche: "Business & Finance",
    delivery: "3–4 weeks",
    logo: "https://www.bloomberg.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Entrepreneur",
    url: "https://www.entrepreneur.com/",
    da: 92,
    traffic: "1.8M",
    doFollowPrice: 2000,
    noFollowPrice: 1700,
    niche: "Business & Finance",
    delivery: "3–4 weeks",
    logo: "https://www.entrepreneur.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/",
    da: 93,
    traffic: "70.9M",
    doFollowPrice: 990,
    noFollowPrice: 850,
    niche: "Business & Finance",
    delivery: "1–2 weeks",
    logo: "https://finance.yahoo.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "CNBC",
    url: "https://cnbc.com/",
    da: 93,
    traffic: "124.4M",
    doFollowPrice: 1500,
    noFollowPrice: 1300,
    niche: "Business & Finance",
    delivery: "3–4 weeks",
    logo: "https://www.cnbc.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "USA Today",
    url: "https://www.usatoday.com/",
    da: 94,
    traffic: "64.7M",
    doFollowPrice: 4000,
    noFollowPrice: 3400,
    niche: "General News & Blogs",
    delivery: "24–72 hrs",
    logo: "https://www.usatoday.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Wired",
    url: "https://www.wired.com/",
    da: 92,
    traffic: "8.4M",
    doFollowPrice: 3500,
    noFollowPrice: 3000,
    niche: "Technology",
    delivery: "3–4 weeks",
    logo: "https://www.wired.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Harvard Health",
    url: "https://www.health.harvard.edu/",
    da: 91,
    traffic: "12.3M",
    doFollowPrice: 2800,
    noFollowPrice: 2400,
    niche: "Health & Wellness",
    delivery: "3–4 weeks",
    logo: "https://www.health.harvard.edu/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Conde Nast Traveler",
    url: "https://www.cntraveler.com/",
    da: 88,
    traffic: "4.2M",
    doFollowPrice: 2200,
    noFollowPrice: 1900,
    niche: "Travel",
    delivery: "3–4 weeks",
    logo: "https://www.cntraveler.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Vogue",
    url: "https://www.vogue.com/",
    da: 91,
    traffic: "15.6M",
    doFollowPrice: 4500,
    noFollowPrice: 3800,
    niche: "Fashion & Beauty",
    delivery: "3–4 weeks",
    logo: "https://www.vogue.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Variety",
    url: "https://variety.com/",
    da: 89,
    traffic: "7.8M",
    doFollowPrice: 2600,
    noFollowPrice: 2200,
    niche: "Entertainment",
    delivery: "3–4 weeks",
    logo: "https://variety.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Sports Illustrated",
    url: "https://www.si.com/",
    da: 88,
    traffic: "9.2M",
    doFollowPrice: 2400,
    noFollowPrice: 2050,
    niche: "Sports",
    delivery: "3–4 weeks",
    logo: "https://www.si.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Motor Trend",
    url: "https://www.motortrend.com/",
    da: 85,
    traffic: "3.1M",
    doFollowPrice: 1800,
    noFollowPrice: 1550,
    niche: "Automotive",
    delivery: "3–4 weeks",
    logo: "https://www.motortrend.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Harvard Law Review",
    url: "https://harvardlawreview.org/",
    da: 87,
    traffic: "890K",
    doFollowPrice: 3200,
    noFollowPrice: 2750,
    niche: "Law & Legal",
    delivery: "3–4 weeks",
    logo: "https://harvardlawreview.org/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "National Geographic",
    url: "https://www.nationalgeographic.com/",
    da: 93,
    traffic: "18.7M",
    doFollowPrice: 3800,
    noFollowPrice: 3250,
    niche: "Environment & Green Energy",
    delivery: "3–4 weeks",
    logo: "https://www.nationalgeographic.com/favicon.ico",
    category: "premium",
    section: "premium",
  },
  {
    name: "Architectural Digest",
    url: "https://www.architecturaldigest.com/",
    da: 87,
    traffic: "6.4M",
    doFollowPrice: 2900,
    noFollowPrice: 2500,
    niche: "Home & Garden",
    delivery: "3–4 weeks",
    logo: "https://www.architecturaldigest.com/favicon.ico",
    category: "premium",
    section: "premium",
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

export function CategorizedWebsiteCatalog() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("all")
  const [daRange, setDaRange] = useState([0, 100])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [adminWebsites, setAdminWebsites] = useState<any[]>([])

  const { balance } = useBalance();
  // console.log("categorized website", balance);
  

  // Load admin websites from localStorage
  useEffect(() => {
    const savedWebsites = localStorage.getItem("admin-websites")
    if (savedWebsites) {
      setAdminWebsites(JSON.parse(savedWebsites))
    }
  }, [])

  // Combine hardcoded websites with admin-added websites
  const allWebsites = [...hardcodedWebsites, ...adminWebsites]

  // Filter websites based on tab and other criteria
  const getFilteredWebsites = (tabCategory: string) => {
    let websites = allWebsites

    // Filter by tab category using section field
    if (tabCategory === "standard") {
      websites = websites.filter((site) => site.section === "standard")
    } else if (tabCategory === "premium") {
      websites = websites.filter((site) => site.section === "premium")
    }

    // Apply other filters
    return websites.filter((website) => {
      const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesNiche = selectedNiche === "all" || website.niche === selectedNiche
      const matchesDA = website.da >= daRange[0] && website.da <= daRange[1]
      // Use doFollowPrice for price filtering (could be made more sophisticated)
      const matchesPrice = website.doFollowPrice >= priceRange[0] && website.doFollowPrice <= priceRange[1]

      return matchesSearch && matchesNiche && matchesDA && matchesPrice
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedNiche("all")
    setDaRange([0, 100])
    setPriceRange([0, 10000])
  }

  const hasActiveFilters =
    searchTerm ||
    selectedNiche !== "all" ||
    daRange[0] !== 0 ||
    daRange[1] !== 100 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000

  const handleBuyClick = (website: any, linkType: "dofollow" | "nofollow" = "dofollow") => {
    const price =
      website.section === "premium"
        ? linkType === "dofollow"
          ? website.doFollowPrice
          : website.noFollowPrice
        : website.doFollowPrice

    setSelectedItem({
      name: `${website.name} Guest Post (${linkType === "dofollow" ? "Do-Follow" : "No-Follow"})`,
      price: price,
      description: `Guest post placement on ${website.name} (DA ${website.da}) with ${website.traffic} monthly traffic`,
      features: [
        `Domain Authority: ${website.da}`,
        `Monthly Traffic: ${website.traffic}`,
        `Category: ${website.niche}`,
        `Delivery: ${website.delivery}`,
        `Link Type: ${linkType === "dofollow" ? "Do-Follow" : "No-Follow"}`,
      ],
    })
    setShowPurchaseModal(true)
  }

  const WebsiteCard = ({ website }: { website: any }) => {
    const [selectedLinkType, setSelectedLinkType] = useState<"dofollow" | "nofollow">("dofollow")

    const currentPrice =
      website.section === "premium"
        ? selectedLinkType === "dofollow"
          ? website.doFollowPrice
          : website.noFollowPrice
        : website.doFollowPrice

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

          {/* Link Type Selection - Only for Premium websites */}
          {website.section === "premium" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Link Type</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedLinkType === "dofollow" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLinkType("dofollow")}
                  className={`text-xs ${
                    selectedLinkType === "dofollow"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                      : "border-white/30 text-white hover:bg-white/10 bg-transparent"
                  }`}
                >
                  Do-Follow
                </Button>
                <Button
                  variant={selectedLinkType === "nofollow" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLinkType("nofollow")}
                  className={`text-xs ${
                    selectedLinkType === "nofollow"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                      : "border-white/30 text-white hover:bg-white/10 bg-transparent"
                  }`}
                >
                  No-Follow
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">${currentPrice.toLocaleString()}</div>
            <Button
              onClick={() => handleBuyClick(website, selectedLinkType)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
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

  const WebsiteSection = ({ tabCategory }: { tabCategory: string }) => {
    const filteredWebsites = getFilteredWebsites(tabCategory)

    return (
      <div>
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {filteredWebsites.length} websites
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>

        {/* Website Grid */}
        {filteredWebsites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((website, index) => (
              <WebsiteCard key={`${tabCategory}-${index}`} website={website} />
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
      </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Tabs for different categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/10">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-500 text-white data-[state=active]:text-white"
            >
              All Sites ({getFilteredWebsites("all").length})
            </TabsTrigger>
            <TabsTrigger
              value="standard"
              className="data-[state=active]:bg-blue-500 text-white data-[state=active]:text-white"
            >
              Standard ({getFilteredWebsites("standard").length})
            </TabsTrigger>
            <TabsTrigger
              value="premium"
              className="data-[state=active]:bg-blue-500 text-white data-[state=active]:text-white"
            >
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

        {/* Purchase Modal */}
        <PurchaseModal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} item={selectedItem} />
      </div>
    </section>
  )
}
