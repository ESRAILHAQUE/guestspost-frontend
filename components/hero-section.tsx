import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            <Badge className="mb-6 bg-yellow-500/20 text-yellow-300 border-yellow-500/30 inline-flex">
              <Star className="w-4 h-4 mr-1 fill-current" />
              Real SEO Ranking Results
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Grow Your Traffic. Get Published{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                On Top Sites.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Premium Guest Post Service for Maximum Authority & Reach. Build high-quality backlinks from authoritative
              websites and boost your search rankings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold"
                asChild
              >
                <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                  Book a Call →
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                asChild
              >
                <a href="/catalog">View Catalog</a>
              </Button>
            </div>
          </div>

          {/* Right Column - Dashboard Card */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-6">Performance Results </h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-1">+247%</div>
                  <div className="text-gray-300 text-sm">Organic Traffic</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-1">+156</div>
                  <div className="text-gray-300 text-sm">Keywords Ranked</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Domain Authority</span>
                  <span className="text-white font-semibold">DA 67</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                    style={{ width: "67%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
