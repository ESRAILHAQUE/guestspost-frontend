import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Users, CheckCircle } from "lucide-react"

export default function BookCallPage() {
  const benefits = [
    "Free 30-minute consultation",
    "Custom guest post strategy",
    "Website recommendations",
    "Pricing discussion",
    "Timeline planning",
    "Q&A session",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Book a Strategy Call</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Schedule a free consultation with our guest post experts to discuss your goals and create a custom
              strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calendly Embed */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Schedule Your Call</h2>
                  <p className="text-gray-300">Choose a time that works best for you</p>
                </div>

                {/* Calendly Button */}
                <div className="text-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 mb-4"
                    asChild
                  >
                    <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Your Free Call
                    </a>
                  </Button>
                  <p className="text-gray-400 text-sm">Click above to open our scheduling calendar</p>
                </div>

                {/* Call Details */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-blue-400" />
                    <span>30 minutes duration</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="w-5 h-5 mr-3 text-blue-400" />
                    <span>One-on-one consultation</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-blue-400" />
                    <span>Available Monday - Friday</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">What You'll Get</h2>
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Ready to Get Started?</h3>
                  <p className="text-gray-300 mb-4">
                    Our team has helped over 10,000 businesses build authority through strategic guest post placements.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    asChild
                  >
                    <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                      Schedule Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
