import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Benefits } from "@/components/benefits"
import { HowItWorks } from "@/components/how-it-works"
import { Comparison } from "@/components/comparison"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <Header />
      <Hero />
      <Features />
      <Benefits />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Find Your Perfect Component?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Try our AI-powered COTS selector and get personalized recommendations in minutes
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href="/selector">Start Selecting Components</a>
          </Button>
        </div>
      </section>
      <CTA />
      <Footer />
    </main>
  )
}
