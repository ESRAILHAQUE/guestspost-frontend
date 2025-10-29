"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Star, TrendingUp, Target, Zap } from "lucide-react"
import { PurchaseModal } from "@/components/purchase-modal"

export function GrowthStrategySection() {
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  const strategies = [
    {
      type: "individual-service",
      id: "starter",
      name: "Starter Growth Package",
      description: "Perfect for small businesses and startups looking to establish their online presence",
      price: 297,
      originalPrice: 497,
      icon: Target,
      popular: false,
      features: [
        "5 High-Quality Guest Posts",
        "Basic SEO Optimization",
        "Social Media Promotion",
        "Monthly Performance Report",
        "Email Support",
        "Content Calendar Planning",
      ],
      results: "Expected 20-30% increase in organic traffic within 3 months",
    },
    {
      type: "individual-service",
      id: "professional",
      name: "Professional Growth Package",
      description: "Ideal for growing businesses ready to scale their digital marketing efforts",
      price: 697,
      originalPrice: 997,
      icon: TrendingUp,
      popular: true,
      features: [
        "15 Premium Guest Posts",
        "Advanced SEO Strategy",
        "Multi-Platform Social Media",
        "Bi-weekly Strategy Calls",
        "Priority Support",
        "Competitor Analysis",
        "Link Building Campaign",
        "Content Optimization",
      ],
      results: "Expected 50-70% increase in organic traffic within 3 months",
    },
    {
      type: "individual-service",
      id: "enterprise",
      name: "Enterprise Growth Package",
      description: "Comprehensive solution for established businesses seeking maximum growth",
      price: 1497,
      originalPrice: 2497,
      icon: Zap,
      popular: false,
      features: [
        "30 Premium Guest Posts",
        "Custom SEO Strategy",
        "Full Digital Marketing Suite",
        "Weekly Strategy Sessions",
        "Dedicated Account Manager",
        "Advanced Analytics Dashboard",
        "PR & Media Outreach",
        "Conversion Optimization",
        "Brand Authority Building",
      ],
      results: "Expected 100-150% increase in organic traffic within 3 months",
    },
  ]

  const handleBuyNow = (strategy: any) => {
    setSelectedStrategy(strategy)
    setIsPurchaseModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsPurchaseModalOpen(false)
    setSelectedStrategy(null)
  }

  return (
    <section className=" bg-white">
      <div className="w-full h-full py-20 px-4 bg-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-secondary py-1 px-3 text-sm mb-4">
              Choose Your Growth Strategy
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary/90 mb-6">Accelerate Your Business Growth</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
              Select the perfect growth package tailored to your business needs. Each strategy is designed to deliver
              measurable results and sustainable growth for your online presence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {strategies.map((strategy, index) => (
              <Card
                key={index}
                className={`bg-secondary border-primary/10 hover:bg-white/10 transition-all duration-300 relative ${strategy.popular ? "ring-2 ring-blue-500 scale-105" : ""
                  }`}
              >
                {strategy.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-secondary/90 flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <strategy.icon className="w-8 h-8 text-secondary/90" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary/90 mb-2">{strategy.name}</h3>
                    <p className="text-gray-500 mb-4">{strategy.description}</p>
                    <div className="mb-4">
                      <span className="text-gray-400 line-through text-lg mr-2">${strategy.originalPrice}</span>
                      <span className="text-4xl font-bold text-primary/90">${strategy.price}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                      Save ${strategy.originalPrice - strategy.price}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h4 className="text-primary/90 font-semibold">What's Included:</h4>
                    <ul className="space-y-3">
                      {strategy.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                    <p className="text-green-700 text-sm font-medium">{strategy.results}</p>
                  </div>

                  <Button
                    onClick={() => handleBuyNow(strategy)}
                    className={`w-full ${strategy.popular
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      } text-secondary/90`}
                  >
                    Buy Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Stories */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary/90 mb-8">Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">150%</div>
                <p className="text-green-800">Average traffic increase within 90 days</p>
              </div>
              <div className="bg-gradient-to-r from-sky-500/20 to-blue-500/20 border border-sky-400/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
                <p className="text-sky-700">Successful campaigns delivered</p>
              </div>
              <div className="bg-gradient-to-r from-purple-400/20 to-purple-500/20 border border-purple-400/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                <p className="text-purple-800">Client satisfaction rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal isOpen={isPurchaseModalOpen} onClose={handleCloseModal} item={selectedStrategy} />
    </section>
  )
}
