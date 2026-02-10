import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
            <span className="text-xs font-medium text-accent">AI-Powered Design Phase Optimization</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Select the <span className="text-primary">Perfect COTS Parts</span> in Minutes
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Eliminate manual catalog searches and datasheets. Use AI to automatically find, simulate, and recommend
            optimal COTS components based on your exact engineering requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2" asChild>
              <a href="/selector">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
              <a href="/demo">
                <Play className="w-4 h-4" />
                Watch Demo
              </a>
            </Button>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Trusted by engineering teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <span className="font-semibold text-sm">AeroTech</span>
              <span className="font-semibold text-sm">MechSys</span>
              <span className="font-semibold text-sm">EngineerCo</span>
              <span className="font-semibold text-sm">AutoDesign</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent blur-3xl" />
    </section>
  )
}
