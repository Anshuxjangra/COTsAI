import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Select Component Type",
    description: "Choose the COTS component you need: Motor, Bearing, Gear, Seal, or Fastener.",
  },
  {
    number: "02",
    title: "Input Design Parameters",
    description: "Provide torque, speed, load, temperature, shaft size, budget, and environment requirements.",
  },
  {
    number: "03",
    title: "Engineering Analysis",
    description:
      "Platform calculates motor power, bearing L10 life, gear ratios, seal compatibility, and fastener strength checks.",
  },
  {
    number: "04",
    title: "Vendor Catalog Search",
    description: "RAG system searches multiple vendor databases to retrieve matching components from major suppliers.",
  },
  {
    number: "05",
    title: "AI Evaluation & Ranking",
    description:
      "AI ranks components by performance, cost, availability, material suitability, and sustainability factors.",
  },
  {
    number: "06",
    title: "View Top 3 Results",
    description: "Get detailed specs, performance graphs, safety margins, trade-offs, and alternative options.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six intelligent steps to find your optimal COTS components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card className="p-6 h-full">
                <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Card>
              {index < steps.length - 1 && index % 3 !== 2 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
