"use client"

import { useState } from "react"
import { Search, Filter, ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { plantsData } from "@/data/plants"
import { PlantDetails } from "@/components/plant-details"
import { CheckoutModal } from "@/components/checkout-modal"
import Image from "next/image"
import { FloatingCart } from "@/components/floating-cart"
import { useToast } from "@/components/ui/use-toast"

type SortOption = "name" | "price-low" | "price-high" | "size"
type FilterOption = "all" | "fruit" | "berry" | "vine" | "tree"

export function PlantCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const { toast } = useToast()

  // Filter plants based on search term and category
  const filteredPlants = plantsData.filter((plant) => {
    const matchesSearch =
      plant.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.commonName.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterBy === "all") return matchesSearch

    const categoryMap: Record<FilterOption, string[]> = {
      all: [],
      fruit: ["Apple", "Peach", "Plum", "Nectarine", "Persimmon", "Dragon Fruit", "Guava"],
      berry: ["Blueberry", "Raspberry"],
      vine: ["Grape", "Kiwi", "Passion Fruit"],
      tree: ["Olive", "Pomegranate", "Almond", "Cherry"],
    }

    return (
      matchesSearch &&
      categoryMap[filterBy].some(
        (category) =>
          plant.commonName.toLowerCase().includes(category.toLowerCase()) ||
          plant.displayName.toLowerCase().includes(category.toLowerCase()),
      )
    )
  })

  // Sort plants based on selected option
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.displayName.localeCompare(b.displayName)
      case "price-low":
        return a.retailPrice - b.retailPrice
      case "price-high":
        return b.retailPrice - a.retailPrice
      case "size":
        return a.containerSize.localeCompare(b.containerSize)
      default:
        return 0
    }
  })

  // Cart functions
  const addToCart = (id: string) => {
    const plant = plantsData.find((p) => p.id === id)
    if (!plant) return

    const existingItem = cart.find((item) => item.id === id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { id, quantity: 1 }])
    }

    // Show toast notification
    toast({
      variant: "success",
      title: "Added to cart",
      description: `${plant.commonName} has been added to your cart`,
      duration: 2000,
    })
  }

  const removeFromCart = (id: string) => {
    const existingItem = cart.find((item) => item.id === id)
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)))
    } else {
      setCart(cart.filter((item) => item.id !== id))
    }
  }

  const cartTotal = cart.reduce((total, item) => {
    const plant = plantsData.find((p) => p.id === item.id)
    return total + (plant ? plant.retailPrice * item.quantity : 0)
  }, 0)

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false)
    setCart([])
  }

  return (
    <div className="bg-[#f8f9f6] py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Our Plant Selection</h2>

          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsCartOpen(!isCartOpen)}>
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cartItemCount})</span>
            </Button>

            {isCartOpen && cart.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
                <div className="p-4 max-h-96 overflow-y-auto">
                  <h3 className="font-bold mb-3">Your Cart</h3>
                  {cart.map((item) => {
                    const plant = plantsData.find((p) => p.id === item.id)
                    if (!plant) return null
                    return (
                      <div key={item.id} className="flex justify-between items-center mb-3 pb-3 border-b">
                        <div>
                          <p className="font-medium">{plant.commonName}</p>
                          <p className="text-sm text-gray-600">${plant.retailPrice.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => addToCart(item.id)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full mt-4 bg-green-700 hover:bg-green-800" onClick={handleCheckout}>
                    Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search plants..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" />
            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plants</SelectItem>
                <SelectItem value="fruit">Fruit</SelectItem>
                <SelectItem value="berry">Berries</SelectItem>
                <SelectItem value="vine">Vines</SelectItem>
                <SelectItem value="tree">Trees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500">Sort by:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="size">Container Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlants.map((plant) => (
            <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={
                    plant.image || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(plant.commonName)}`
                  }
                  alt={plant.commonName}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{plant.commonName}</h3>
                    <p className="text-sm text-gray-500">{plant.displayName}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    {plant.containerSize}
                  </Badge>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-lg font-bold">${plant.retailPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Available: {plant.available}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedPlant(plant.id)}>
                      Details
                    </Button>
                    <Button size="sm" className="bg-green-700 hover:bg-green-800" onClick={() => addToCart(plant.id)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedPlants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No plants found matching your search criteria.</p>
          </div>
        )}
      </div>

      {selectedPlant && (
        <PlantDetails
          plantId={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onAddToCart={() => {
            addToCart(selectedPlant)
          }}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setIsCheckoutOpen(false)}
          onCheckoutComplete={handleCheckoutComplete}
        />
      )}

      <FloatingCart cart={cart} onCartOpen={() => setIsCartOpen(true)} />
    </div>
  )
}

