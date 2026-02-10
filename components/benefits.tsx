import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const benefits = [
  {
    title: "Faster Design Cycles",
    items: ["20-30% reduction in design phase time", "Parallel part selection analysis", "Real-time recommendations"],
  },
  {
    title: "Better Decisions",
    items: ["Data-driven recommendations", "Performance simulation insights", "Trade-off analysis with clarity"],
  },
  {
    title: "Cost Optimization",
    items: ["Find cost-effective alternatives", "Reduce procurement complexity", "Minimize design failures"],
  },
  {
    title: "Quality Assurance",
    items: [
      "Standards compliance check (ASTM, DIN, ISO)",
      "Compatibility verification",
      "Material property validation",
    ],
  },
]

export function Benefits() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">Why Choose PartIQ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform how your team selects COTS components with intelligent automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-8">
              <h3 className="text-2xl font-bold mb-6">{benefit.title}</h3>
              <ul className="space-y-4">
                {benefit.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
