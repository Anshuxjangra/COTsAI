const comparisonData = [
  {
    category: "Manual Selection",
    traditional: true,
    partiq: false,
    features: [
      { label: "Time Required", traditional: "20-40 hours", partiq: "1-2 hours" },
      { label: "Data Sources", traditional: "Limited", partiq: "Comprehensive" },
      { label: "Performance Simulation", traditional: "No", partiq: "Yes" },
      { label: "Alternative Options", traditional: "Few", partiq: "Many" },
      { label: "Consistency", traditional: "Variable", partiq: "Standardized" },
      { label: "Cost Optimization", traditional: "Manual", partiq: "Automated" },
    ],
  },
]

export function Comparison() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">PartIQ vs Traditional Methods</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how automation transforms component selection
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Traditional</th>
                <th className="text-center py-4 px-4 font-semibold text-primary">PartIQ</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData[0].features.map((feature) => (
                <tr key={feature.label} className="border-b border-border hover:bg-accent/5">
                  <td className="py-4 px-4 font-medium">{feature.label}</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">{feature.traditional}</td>
                  <td className="text-center py-4 px-4 text-primary font-medium">{feature.partiq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
