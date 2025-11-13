"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, PenTool, Link, Megaphone, Share, FileText, X, ShoppingCart } from "lucide-react"
import { PurchaseModal } from "@/components/purchase-modal"
import { endpoints } from "@/lib/api/client"

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [servicePackages, setServicePackages] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)

  const services = [
    {
      id: "article-writing",
      icon: PenTool,
      title: "Article Writing",
      description:
        "Professional, SEO-optimized articles crafted by expert writers to engage your audience and boost your search rankings.",
      features: [
        "SEO-optimized content",
        "Original, plagiarism-free articles",
        "Industry-specific expertise",
        "Multiple revisions included",
        "Fast turnaround times",
      ],
      pricing: "Starting at $50/article",
    },
    {
      id: "link-insertions",
      icon: Link,
      title: "Link Insertions",
      description:
        "Strategic link insertions into existing high-authority content to build powerful backlinks and improve your domain authority.",
      features: [
        "High DA website placements",
        "Contextual link insertions",
        "Permanent link placement",
        "Detailed reporting",
        "White-hat SEO practices",
      ],
      pricing: "Starting at $97/link",
    },
    {
      id: "hoth-digital-pr",
      icon: Megaphone,
      title: "HOTH Digital PR",
      description:
        "Comprehensive digital PR campaigns to increase brand visibility, build authority, and generate high-quality media coverage.",
      features: [
        "Media outreach campaigns",
        "Brand mention opportunities",
        "Journalist relationship building",
        "Crisis management support",
        "Performance tracking",
      ],
      pricing: "Starting at $497/month",
    },
    {
      id: "content-syndication",
      icon: Share,
      title: "Content Syndication",
      description:
        "Amplify your content reach by distributing your articles across multiple high-authority platforms and networks.",
      features: [
        "Multi-platform distribution",
        "Increased content visibility",
        "Enhanced brand exposure",
        "Traffic generation",
        "Social media amplification",
      ],
      pricing: "Starting at $197/campaign",
    },
    {
      id: "press-releases",
      icon: FileText,
      title: "Press Releases",
      description:
        "Professional press release writing and distribution to major news outlets and industry publications.",
      features: [
        "Professional PR writing",
        "Major news outlet distribution",
        "Industry-specific targeting",
        "SEO-optimized releases",
        "Distribution reporting",
      ],
      pricing: "Starting at $297/release",
    },
  ]

  useEffect(() => {
    const loadServicePackages = async () => {
      try {
        const result = await endpoints.servicePackages.getGroupedServicePackages();
        if (result.data) {
          setServicePackages(result.data);
        }
      } catch (error) {
        console.error("Error loading service packages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServicePackages();
  }, []);

  const defaultServicePackages = {
    "article-writing": [
      {
        type: 'service',
        name: "Starter Package",
        price: 150,
        originalPrice: 200,
        articles: "3 Articles",
        features: [
          "500-800 words per article",
          "Basic SEO optimization",
          "1 revision per article",
          "5-7 day delivery",
          "General topics",
        ],
        popular: false,
        description: "Perfect for small businesses starting their content marketing journey",
      },
      {
        type: 'service',
        name: "Professional Package",
        price: 450,
        originalPrice: 600,
        articles: "10 Articles",
        features: [
          "800-1200 words per article",
          "Advanced SEO optimization",
          "2 revisions per article",
          "3-5 day delivery",
          "Industry-specific content",
          "Meta descriptions included",
        ],
        popular: true,
        description: "Ideal for growing businesses looking to scale their content strategy",
      },
      {
        type: 'service',
        name: "Enterprise Package",
        price: 1200,
        originalPrice: 1600,
        articles: "30 Articles",
        features: [
          "1000-1500 words per article",
          "Premium SEO optimization",
          "Unlimited revisions",
          "24-48 hour delivery",
          "Expert industry writers",
          "Content strategy consultation",
          "Priority support",
        ],
        popular: false,
        description: "Comprehensive solution for established businesses with high content needs",
      },
    ],
    "link-insertions": [
      {
        type: 'service',
        name: "Basic Link Package",
        price: 485,
        originalPrice: 650,
        articles: "5 Link Insertions",
        features: [
          "DA 40-60 websites",
          "Contextual placements",
          "Permanent links",
          "Basic reporting",
          "30-day delivery",
        ],
        popular: false,
        description: "Great starting point for building your backlink profile",
      },
      {
        type: 'service',
        name: "Premium Link Package",
        price: 1455,
        originalPrice: 1940,
        articles: "15 Link Insertions",
        features: [
          "DA 60-80 websites",
          "Strategic anchor text",
          "Detailed link reports",
          "20-day delivery",
          "Niche-relevant sites",
          "Link monitoring included",
        ],
        popular: true,
        description: "Most popular choice for serious link building campaigns",
      },
      {
        type: 'service',
        name: "Authority Link Package",
        price: 3880,
        originalPrice: 5170,
        articles: "40 Link Insertions",
        features: [
          "DA 80+ premium websites",
          "Custom anchor strategies",
          "Comprehensive reporting",
          "15-day delivery",
          "Industry-specific targeting",
          "Dedicated account manager",
          "6-month link monitoring",
        ],
        popular: false,
        description: "Premium solution for maximum authority building",
      },
    ],
    "hoth-digital-pr": [
      {
        type: 'service',
        name: "Startup PR Package",
        price: 497,
        originalPrice: 650,
        articles: "1 Month Campaign",
        features: [
          "5 media outreach attempts",
          "Press release writing",
          "Basic media list",
          "Email campaign management",
          "Monthly reporting",
        ],
        popular: false,
        description: "Perfect introduction to digital PR for new businesses",
      },
      {
        type: 'service',
        name: "Growth PR Package",
        price: 1245,
        originalPrice: 1650,
        articles: "3 Month Campaign",
        features: [
          "15 media outreach attempts",
          "2 press releases included",
          "Targeted media lists",
          "Follow-up campaigns",
          "Social media amplification",
          "Bi-weekly reporting",
        ],
        popular: true,
        description: "Comprehensive PR strategy for growing businesses",
      },
      {
        type: 'service',
        name: "Enterprise PR Package",
        price: 2985,
        originalPrice: 3980,
        articles: "6 Month Campaign",
        features: [
          "Unlimited outreach attempts",
          "4 press releases included",
          "Premium media database",
          "Crisis management support",
          "Influencer outreach",
          "Dedicated PR manager",
          "Weekly strategy calls",
        ],
        popular: false,
        description: "Full-service PR solution for established enterprises",
      },
    ],
    "content-syndication": [
      {
        type: 'service',
        name: "Basic Syndication",
        price: 197,
        originalPrice: 260,
        articles: "5 Platform Distribution",
        features: [
          "5 syndication platforms",
          "Basic content optimization",
          "Standard distribution",
          "Performance tracking",
          "7-day campaign",
        ],
        popular: false,
        description: "Simple content amplification for small businesses",
      },
      {
        type: 'service',
        name: "Premium Syndication",
        price: 485,
        originalPrice: 650,
        articles: "15 Platform Distribution",
        features: [
          "15 premium platforms",
          "Advanced optimization",
          "Priority distribution",
          "Social media boost",
          "Detailed analytics",
          "5-day campaign",
        ],
        popular: true,
        description: "Enhanced reach across multiple premium platforms",
      },
      {
        type: 'service',
        name: "Enterprise Syndication",
        price: 1165,
        originalPrice: 1550,
        articles: "30+ Platform Distribution",
        features: [
          "30+ premium platforms",
          "Custom content adaptation",
          "Immediate distribution",
          "Multi-channel promotion",
          "Real-time analytics",
          "Dedicated campaign manager",
          "3-day campaign",
        ],
        popular: false,
        description: "Maximum exposure across all available channels",
      },
    ],
    "press-releases": [
      {
        type: 'service',
        name: "Standard Release",
        price: 297,
        originalPrice: 400,
        articles: "1 Press Release",
        features: [
          "Professional PR writing",
          "50+ news outlets",
          "Basic distribution",
          "SEO optimization",
          "Distribution report",
        ],
        popular: false,
        description: "Professional press release for announcements",
      },
      {
        type: 'service',
        name: "Premium Release",
        price: 745,
        originalPrice: 1000,
        articles: "3 Press Releases",
        features: [
          "Expert PR copywriting",
          "200+ premium outlets",
          "Targeted distribution",
          "Advanced SEO optimization",
          "Social media amplification",
          "Detailed analytics",
        ],
        popular: true,
        description: "Comprehensive press release campaign",
      },
      {
        type: 'service',
        name: "Enterprise Release",
        price: 1785,
        originalPrice: 2400,
        articles: "8 Press Releases",
        features: [
          "C-suite level writing",
          "500+ major outlets",
          "Priority distribution",
          "Multi-format releases",
          "Influencer outreach",
          "Crisis management support",
          "Dedicated PR specialist",
        ],
        popular: false,
        description: "Enterprise-level press release strategy",
      },
    ],
  }

  const handleBuyClick = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleCloseModal = () => {
    setSelectedService(null)
    setSelectedPackage(null)
    setIsPurchaseModalOpen(false)
  }

  const handlePurchasePackage = (pkg: any) => {
    const currentService = services.find((s) => s.id === selectedService)

    // Create a combined item for the purchase modal
    const purchaseItem = {
      name: `${currentService?.title} - ${pkg.name}`,
      description: pkg.description,
      price: pkg.price,
      features: pkg.features,
      serviceName: currentService?.title,
      packageName: pkg.name,
      articles: pkg.articles,
      type: pkg.type
    }

    setSelectedPackage(purchaseItem)
    setSelectedService(null) // Close service modal
    setIsPurchaseModalOpen(true) // Open purchase modal
  }

  const currentService = services.find((s) => s.id === selectedService)
  const currentPackages = selectedService 
    ? (servicePackages[selectedService] || defaultServicePackages[selectedService as keyof typeof defaultServicePackages] || [])
    : []

  return (
    <div className="min-h-screen bg-primary/5">
      <Header />

      <section className="py-20 px-4 ">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Services</h1>
            <p className="text-gray-800 text-lg max-w-3xl mx-auto leading-relaxed">
              Comprehensive digital marketing services designed to boost your online presence, build authority, and
              drive targeted traffic to your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="bg-white border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg flex-shrink-0">
                      <service.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-primary mb-3">{service.title}</h3>
                      <p className="text-gray-800 leading-relaxed mb-4">{service.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-primary font-semibold mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-primary">{service.pricing}</div>
                    <Button
                      onClick={() => handleBuyClick(service.id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-secondary"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">Ready to Boost Your Online Presence?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Let our team of experts help you choose the right combination of services to achieve your digital
              marketing goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-secondary hover:bg-primary/5 text-primary px-8 py-4"
                asChild
              >
                <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                  Schedule Free Consultation
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary/70 bg-secondary/5 text-secondary hover:bg-white/10  px-8 py-4"
                asChild
              >
                <a href="/contact">Get Custom Quote</a>
              </Button>
            </div>
          </div>

          {/* Why Choose Our Services */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Our Services?</h2>
              <p className="text-gray-800 text-lg max-w-2xl mx-auto">
                We combine expertise, quality, and results to deliver exceptional digital marketing services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center lg:px-10 md:px-5 px-3 bg-white py-6 rounded-xl">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">Proven Results</h3>
                <p className="text-gray-800">
                  Track record of delivering measurable results for over 10,000+ satisfied clients worldwide.
                </p>
              </div>

              <div className="text-center lg:px-10 md:px-5 px-3 bg-white py-6 rounded-xl">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <PenTool className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">Expert Team</h3>
                <p className="text-gray-800">
                  Professional writers, SEO specialists, and digital marketers with years of industry experience.
                </p>
              </div>

              <div className="text-center lg:px-10 md:px-5 px-3 bg-white py-6 rounded-xl">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Megaphone className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">Full Support</h3>
                <p className="text-gray-800">
                  24/7 customer support and dedicated account management to ensure your success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages Modal */}
      <Dialog open={!!selectedService} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-neutral-200">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-primary flex items-center">
                {currentService && <currentService.icon className="w-6 h-6 mr-3 text-blue-400" />}
                {currentService?.title} Packages
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleCloseModal} className="text-gray-800 hover:text-primary bg-white">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {currentPackages.map((pkg, index) => (
              <Card
                key={index}
                className={`bg-white border-primary/20 hover:bg-white/10 transition-all duration-300 relative ${pkg.popular ? "ring-2 ring-blue-500 scale-105" : ""
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-secondary">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-primary mb-2">{pkg.name}</h3>
                    <p className="text-gray-700 text-sm mb-3">{pkg.description}</p>
                    <div className="mb-2">
                      <span className="text-gray-700 line-through text-sm mr-2">${pkg.originalPrice}</span>
                      <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                    </div>
                    <p className="text-blue-400 font-medium">{pkg.articles}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePurchasePackage(pkg)}
                    className={`w-full ${pkg.popular
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      } text-secondary`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm mb-4">
              Need a custom package? Contact our team for personalized solutions.
            </p>
            <Button variant="outline" className="border-white/30 text-primary hover:bg-white/50 bg-white" asChild>
              <a href="/contact">Request Custom Quote</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Purchase Modal */}
      <PurchaseModal isOpen={isPurchaseModalOpen} onClose={handleCloseModal} item={selectedPackage} />

      <Footer />
    </div>
  )
}
