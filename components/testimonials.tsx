import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Lead Mechanical Engineer",
    company: "AeroTech Solutions",
    content:
      "PartIQ reduced our component selection time from weeks to days. The performance simulations alone save us countless prototyping iterations.",
  },
  {
    name: "Sarah Chen",
    role: "Design Director",
    company: "MechSys Inc",
    content:
      "The multi-criteria ranking helped us balance performance, cost, and sustainability in ways we never could manually. It is a game changer.",
  },
  {
    name: "Michael Petrov",
    role: "Engineering Manager",
    company: "AutoDesign Labs",
    content:
      "Our team now uses PartIQ for every project. The alternative options and trade-off analysis make decision-making faster and more informed.",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">What Engineers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Trusted by engineering teams worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-8 flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 flex-grow">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-primary">{testimonial.company}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
