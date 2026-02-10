import Link from "next/link"
import { Mail, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Standards
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-bold">PartIQ</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">© 2025 PartIQ. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">
                <Mail className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
