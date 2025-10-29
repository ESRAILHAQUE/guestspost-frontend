import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"
import { Button } from "@/components/ui/button"

export default function GuestPostPackagePage() {
  return (
    <div className="min-h-screen bg-neutral-200 ">
      <Header />

      <section className="pt-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Choose Your Package</h2>
            <p className="text-gray-800 text-lg max-w-2xl mx-auto">
              Select the perfect guest post package that fits your business needs and budget
            </p>
          </div>
        </div>
      </section>

      <PricingSection />

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">Need a Custom Package?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              We can create a tailored solution that perfectly fits your business goals and requirements.
            </p>
            <Button
              size="lg"
              className="bg-white hover:bg-secondary/5 hover:border border-white text-primary px-8 py-4"
              asChild
            >
              <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                Discuss Custom Package
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
