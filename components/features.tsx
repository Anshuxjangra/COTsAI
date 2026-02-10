import { Card } from "@/components/ui/card"
import { Zap, Brain, BarChart3, Leaf, Settings, Database, ArrowRight } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Settings,
    title: "Component Type Selection",
    description: "Choose from Motors, Bearings, Gears, Seals, and Fasteners with guided parameter entry for each type.",
  },
  {
    icon: Zap,
    title: "Engineering Calculations",
    description:
      "Automated calculations for motor power ratings, bearing L10 life, gear ratios, seal compatibility, and fastener strength checks.",
  },
  {
    icon: Database,
    title: "Vendor Catalog RAG",
    description:
      "Search across SKF, NTN, Siemens, Festo, Parker, MISUMI and other major vendors using intelligent retrieval-augmented generation.",
  },
  {
    icon: Brain,
    title: "AI Component Ranking",
    description:
      "AI evaluates performance, cost, space constraints, material suitability, availability, and sustainability factors automatically.",
  },
  {
    icon: BarChart3,
    title: "Top 3 Recommendations",
    description:
      "Get detailed specs, performance graphs, safety margins, trade-offs, and alternatives for each recommendation.",
  },
  {
    icon: Leaf,
    title: "Download & Document",
    description:
      "Export final summaries with engineering data and BOM for design documentation and procurement processes.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">Intelligent Component Selection</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From design parameters to optimized component recommendations - a complete engineering workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.title} href="/selector">
                <Card className="p-6 hover:border-primary/50 transition cursor-pointer h-full hover:shadow-lg hover:bg-accent/5">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/selector">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
              Start Selecting Components Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
