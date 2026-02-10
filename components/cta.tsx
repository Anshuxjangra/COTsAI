import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 p-12 sm:p-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Automate Component Selection?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join engineering teams using PartIQ to reduce design time and make smarter component choices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <a href="/selector">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/demo">Schedule Demo</a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-8">No credit card required. 14-day free trial.</p>
        </div>
      </div>
    </section>
  )
}
