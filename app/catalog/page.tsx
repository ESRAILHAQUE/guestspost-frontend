import { Header } from "@/components/header"
import { UnifiedWebsiteCatalog } from "@/components/unified-website-catalog"
import { Footer } from "@/components/footer"

export default function CatalogPage() {
  return (
    <div className="min-h-screen ">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Website Catalog</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Browse our complete collection of premium guest post opportunities across high-authority websites
            </p>
          </div>
        </div>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-1 w-auto">
            <UnifiedWebsiteCatalog showTitle={false} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
