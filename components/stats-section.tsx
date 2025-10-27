export function StatsSection() {
  const stats = [
    { number: "500+", label: "Premium Sites" },
    { number: "98%", label: "Success Rate" },
    { number: "24-72h", label: "Fast Delivery" },
    { number: "24/7", label: "Support" },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-white text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
