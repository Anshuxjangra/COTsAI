import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <Header />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">See PartIQ in Action</h1>
            <p className="text-lg text-muted-foreground">
              Watch how engineers find the perfect COTS components in minutes, not days
            </p>
          </div>

          {/* Demo Video Placeholder */}
          <div className="mb-12 rounded-xl overflow-hidden bg-accent/10 border border-primary/20">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">Video Demo: Component Selection Workflow</p>
              </div>
            </div>
          </div>

          {/* Demo Workflow Steps */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-foreground">How It Works:</h2>

            <div className="grid gap-4">
              {[
                {
                  step: "1",
                  title: "Define Your Requirements",
                  desc: "Enter component type, power ratings, environmental conditions, and design constraints",
                },
                {
                  step: "2",
                  title: "AI Analyzes Requirements",
                  desc: "Our AI performs engineering calculations and evaluates compatibility across vendor catalogs",
                },
                {
                  step: "3",
                  title: "Get Ranked Recommendations",
                  desc: "Receive top 3 components with detailed specs, performance graphs, and trade-off analysis",
                },
                {
                  step: "4",
                  title: "Export & Collaborate",
                  desc: "Download recommendations with BOM data for design documentation and procurement",
                },
              ].map((item) => (
                <Card key={item.step} className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary text-lg">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Try It Yourself?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get started with our free trial and see how much time you can save on component selection
            </p>
            <Button size="lg" className="gap-2" asChild>
              <a href="/selector">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
