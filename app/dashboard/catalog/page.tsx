import { DashboardLayout } from "@/components/dashboard-layout"
import { UnifiedWebsiteCatalog } from "@/components/unified-website-catalog"

export default function DashboardCatalogPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Website Catalog</h1>
          <p className="text-gray-800">Browse and select from our premium website collection.</p>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-1 w-auto">
          <UnifiedWebsiteCatalog showTitle={false} />
        </div>
      </div>
    </DashboardLayout>
  )
}
