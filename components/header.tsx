"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">P</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">PartIQ</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm hover:text-primary transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm hover:text-primary transition">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm hover:text-primary transition">
              Pricing
            </Link>
            <Link href="#docs" className="text-sm hover:text-primary transition">
              Docs
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="#features" className="block text-sm hover:text-primary transition py-2">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-sm hover:text-primary transition py-2">
              How It Works
            </Link>
            <Link href="#pricing" className="block text-sm hover:text-primary transition py-2">
              Pricing
            </Link>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Sign In
              </Button>
              <Button size="sm" className="flex-1">
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
