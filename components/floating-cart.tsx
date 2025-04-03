"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { plantsData } from "@/data/plants"

interface FloatingCartProps {
  cart: { id: string; quantity: number }[]
  onCartOpen: () => void
}

export function FloatingCart({ cart, onCartOpen }: FloatingCartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => {
    const plant = plantsData.find((p) => p.id === item.id)
    return total + (plant ? plant.retailPrice * item.quantity : 0)
  }, 0)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Show cart icon if there are items in cart or if user has scrolled
  useEffect(() => {
    setIsVisible(cartItemCount > 0 || hasScrolled)
  }, [cartItemCount, hasScrolled])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <Button
        onClick={onCartOpen}
        size="lg"
        className="bg-green-700 hover:bg-green-800 shadow-lg rounded-full h-16 w-16 flex flex-col items-center justify-center p-0 group"
      >
        <ShoppingCart className="h-6 w-6 mb-1" />
        <span className="text-xs font-bold">{cartItemCount}</span>

        {/* Expanding tooltip showing total on hover */}
        <div
          className="absolute right-full mr-2 bg-white text-green-800 px-3 py-1 rounded-md shadow-md 
                       pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ${cartTotal.toFixed(2)}
        </div>
      </Button>
    </div>
  )
}

