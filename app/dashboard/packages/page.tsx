import { DashboardLayout } from "@/components/dashboard-layout"
import { PricingSection } from "@/components/pricing-section"

export default function PackagesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Guest Post Packages</h1>
          <p className="text-gray-800">Choose the perfect package for your business needs.</p>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex flex-col gap-6">
         <div className="text-center my-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Choose Your Package</h2>
          <p className="text-gray-800 text-lg max-w-2xl mx-auto">
            Select the perfect guest post package that fits your business needs and budget
          </p>
        </div>
          <PricingSection />
        </div>
      </div>
    </DashboardLayout>
  )
}
