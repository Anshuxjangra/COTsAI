"use client"

import { PartSelector } from "@/components/part-selector"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SelectorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <Header />
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Perfect COTS Component</h1>
            <p className="text-lg text-muted-foreground">
              Specify your requirements and let AI recommend the best parts for your project
            </p>
          </div>
          <PartSelector />
        </div>
      </section>
      <Footer />
    </main>
  )
}
