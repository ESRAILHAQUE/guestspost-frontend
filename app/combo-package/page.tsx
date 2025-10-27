import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

export default function ComboPackagePage() {
  const comboPackages = [
    {
      type: "combo-package",
      name: "Authority Builder Combo",
      originalPrice: "$1,200",
      comboPrice: "$899",
      savings: "$301",
      description: "Perfect combination for establishing strong online authority",
      includes: [
        "5 High DA Guest Posts (DA 70+)",
        "3 Premium Press Releases",
        "Social Media Amplification",
        "SEO Content Optimization",
        "Monthly Performance Report",
      ],
      popular: false,
    },
    {
      type: "combo-package",
      name: "Growth Accelerator Combo",
      originalPrice: "$2,500",
      comboPrice: "$1,799",
      savings: "$701",
      description: "Comprehensive package for rapid business growth",
      includes: [
        "10 Premium Guest Posts (DA 80+)",
        "5 Press Release Distributions",
        "Content Strategy Consultation",
        "Competitor Analysis Report",
        "Link Building Campaign",
        "24/7 Priority Support",
      ],
      popular: true,
    },
    {
      type: "combo-package",
      name: "Enterprise Domination Combo",
      originalPrice: "$5,000",
      comboPrice: "$3,499",
      savings: "$1,501",
      description: "Ultimate package for market leadership",
      includes: [
        "20 Premium Guest Posts (DA 90+)",
        "10 Press Release Distributions",
        "Custom Content Strategy",
        "Dedicated Account Manager",
        "White-label Reporting",
        "API Access",
        "Quarterly Strategy Reviews",
      ],
      popular: false,
    },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Combo Packages</h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Save big with our combo packages that combine guest posts, press releases, and additional marketing
              services for maximum impact and value.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {comboPackages.map((pkg, index) => (
              <Card
                key={index}
                className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 relative ${pkg.popular ? "ring-2 ring-purple-500 scale-105" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-white">{pkg.name}</CardTitle>
                  <p className="text-gray-300 mt-2">{pkg.description}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-gray-400 line-through text-lg">{pkg.originalPrice}</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        Save {pkg.savings}
                      </Badge>
                    </div>
                    <div className="text-4xl font-bold text-white">{pkg.comboPrice}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {pkg.includes.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${pkg.popular ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" : "bg-white/10 hover:bg-white/20"} text-white`}
                  >
                    Get This Combo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Need Help Choosing?</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Our experts can help you select the perfect combo package based on your specific goals and requirements.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4"
                asChild
              >
                <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                  Schedule Consultation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
