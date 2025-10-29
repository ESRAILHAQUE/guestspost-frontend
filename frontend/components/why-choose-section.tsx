import { Shield, Zap, Target, Award, Clock, Users } from "lucide-react"

export function WhyChooseSection() {
  const features = [
    {
      icon: Shield,
      title: "100% White Hat SEO",
      description: "All our guest posts follow Google's guidelines and best practices for sustainable rankings.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Get your guest posts published within 24-72 hours on most premium websites.",
    },
    {
      icon: Target,
      title: "Targeted Audience Reach",
      description: "Reach your ideal customers through high-authority websites in your niche.",
    },
    {
      icon: Award,
      title: "Premium Quality Content",
      description: "Professional writers create engaging, SEO-optimized content that drives results.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock to assist you.",
    },
    {
      icon: Users,
      title: "Trusted by 10,000+ Brands",
      description: "Join thousands of successful businesses that trust our guest post services.",
    },
  ]

  return (
    <section className="py-20 px-4 backdrop-blur-sm bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary/90 mb-4">Why Choose GuestPostNow?</h2>
          <p className="text-primary/90 text-lg max-w-2xl mx-auto">
            We're not just another guest post service. We're your strategic partner in building lasting online
            authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-primary/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg mr-4">
                  <feature.icon className="w-6 h-6 text-secondary/90" />
                </div>
                <h3 className="text-xl font-semibold text-primary/90">{feature.title}</h3>
              </div>
              <p className="text-primary/90 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
