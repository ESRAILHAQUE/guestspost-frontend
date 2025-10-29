import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { number: "10,000+", label: "Happy Clients" },
    { number: "50,000+", label: "Guest Posts Published" },
    { number: "98%", label: "Success Rate" },
    { number: "5 Years", label: "Industry Experience" },
  ]

  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "We focus on delivering measurable results that impact your bottom line and business growth.",
    },
    {
      icon: Award,
      title: "Quality First",
      description: "Every website in our network is carefully vetted for quality, authority, and editorial standards.",
    },
    {
      icon: Users,
      title: "Client Success",
      description: "Your success is our success. We're committed to helping you achieve your marketing goals.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We stay ahead of industry trends and continuously improve our services and technology.",
    },
  ]

  return (
    <div className="min-h-screen bg-primary/5">
      <Header />

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">About GuestPostNow.io</h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              We're the leading guest post marketplace, connecting businesses with premium publications to build
              authority, increase visibility, and drive growth through strategic content placement.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-primary/5 border border-primary/20 py-6 rounded-lg">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  Founded in 2019, GuestPostNow.io was born from a simple observation: businesses were struggling to
                  build meaningful online authority in an increasingly competitive digital landscape.
                </p>
                <p>
                  We saw the gap between high-quality content creators and premium publications, and decided to bridge
                  that divide with a platform that ensures quality, transparency, and results.
                </p>
                <p>
                  Today, we've helped over 10,000 businesses establish their authority through strategic guest post
                  placements on the world's most respected websites.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  To democratize access to premium publications and help businesses of all sizes build lasting online
                  authority through strategic content placement.
                </p>
                <p>
                  We believe that every business deserves the opportunity to share their expertise and reach their
                  target audience through trusted, high-authority platforms.
                </p>
                <p>
                  Our commitment is to maintain the highest standards of quality while making the guest post process
                  simple, transparent, and effective for our clients.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-3">{value.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Ready to Work With Us?</h2>
              <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of successful businesses that trust GuestPostNow.io for their guest post needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4"
                  asChild
                >
                  <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                    Get Started Today
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent px-8 py-4"
                  asChild
                >
                  <a href="/catalog">Browse Websites</a>
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
