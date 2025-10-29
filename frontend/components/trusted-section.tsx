export function TrustedSection() {
  const brands = [
    "Forbes",
    "TechCrunch",
    "Bloomberg",
    "Business Insider",
    "Entrepreneur",
    "Yahoo Finance",
    "USA Today",
    "CNBC",
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Trusted by Leading Brands</h2>
        <p className="text-white mb-12 max-w-2xl mx-auto">
          Join thousands of businesses that have boosted their authority with our premium guest post service
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={`/placeholder.svg?height=40&width=120&text=${brand}`}
                alt={brand}
                className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
