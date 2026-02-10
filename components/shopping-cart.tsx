"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingBag, ExternalLink } from "lucide-react"

interface CartItem {
  id: string
  name: string
  manufacturer: string
  price: string
  quantity: number
  vendorUrl?: string
  componentType: string
}

interface ShoppingCartProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShoppingCart({ open, onOpenChange }: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number.parseFloat(item.price.replace(/[^0-9.]/g, ""))
      return total + price * item.quantity
    }, 0)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="sticky top-0 bg-background border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Shopping Cart
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.manufacturer}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{item.price}</Badge>
                      <Badge variant="outline">{item.componentType}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Estimated Total:</span>
                  <span className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
                </div>

                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>

                {cartItems.some((item) => item.vendorUrl) && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Quick Links to Vendors:</p>
                    {cartItems
                      .filter((item) => item.vendorUrl)
                      .map((item) => (
                        <a
                          key={item.id}
                          href={item.vendorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 text-sm text-primary hover:underline border rounded"
                        >
                          {item.name} on Vendor Site
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { useShoppingCart }

function useShoppingCart() {
  const [cartOpen, setCartOpen] = useState(false)

  return { cartOpen, setCartOpen }
}
