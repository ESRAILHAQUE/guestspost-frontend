"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Users, Award, Shield, Zap } from "lucide-react"

const iconMap = {
  CheckCircle,
  Clock,
  Users,
  Award,
  Shield,
  Zap,
}

interface Service {
  id: string
  icon: string
  title: string
  description: string
  createdAt: string
}

export default function ServicePage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServices = () => {
      try {
        const savedServices = localStorage.getItem("admin-services")
        if (savedServices) {
          const parsedServices = JSON.parse(savedServices)
          // console.log("Loading services from admin storage:", parsedServices)
          setServices(parsedServices)
        } else {
          // console.log("No admin services found, initializing with default services")
          // Initialize with the current services displayed on the page
          const defaultServices = [
            {
              id: "1",
              icon: "CheckCircle",
              title: "Article Writing",
              description:
                "Professional content creation with SEO optimization and engaging storytelling for your target audience.",
              createdAt: new Date().toISOString(),
            },
            {
              id: "2",
              icon: "Zap",
              title: "HOTH Link Insertions",
              description:
                "Strategic link placement in existing high-authority content to boost your website's domain authority.",
              createdAt: new Date().toISOString(),
            },
            {
              id: "3",
              icon: "Award",
              title: "HOTH Digital PR",
              description:
                "Comprehensive digital PR campaigns to increase brand visibility and earn high-quality backlinks.",
              createdAt: new Date().toISOString(),
            },
            {
              id: "4",
              icon: "Users",
              title: "Content Syndication",
              description:
                "Distribute your content across multiple high-authority platforms to maximize reach and engagement.",
              createdAt: new Date().toISOString(),
            },
            {
              id: "5",
              icon: "Shield",
              title: "Press Releases",
              description:
                "Professional press release writing and distribution to major news outlets and industry publications.",
              createdAt: new Date().toISOString(),
            },
          ]
          setServices(defaultServices)
          // Save to localStorage so admin can manage them
          localStorage.setItem("admin-services", JSON.stringify(defaultServices))
        }
      } catch (error) {
        console.error("Error loading services:", error)
        setServices([])
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()

    // Listen for storage changes to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "admin-services") {
        // console.log("Services updated in admin panel, reloading...")
        loadServices()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary/10">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-primary">Loading services...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary/10">
      <Header />

      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Services</h1>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
              We provide comprehensive guest post services to help you build authority, increase brand visibility, and
              drive targeted traffic to your website through high-quality backlinks.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon as keyof typeof iconMap] || CheckCircle
                return (
                  <Card
                    key={service.id}
                    className="bg-white border-primary/20 hover:bg-primary/5 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg w-fit mb-4">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-primary mb-3">{service.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center mb-16">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12">
                <h3 className="text-xl font-semibold text-white mb-4">No Services Available</h3>
                <p className="text-gray-300">Services will appear here once added by the administrator.</p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Book a consultation call with our team to discuss your goals and create a custom guest post strategy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary px-8 py-4"
                  asChild
                >
                  <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                    Book a Call
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent px-8 py-4"
                  asChild
                >
                  <a href="/catalog">View Catalog</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
