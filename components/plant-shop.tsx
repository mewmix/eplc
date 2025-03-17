"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ShoppingCart, Leaf } from "lucide-react"
import { plantData } from "@/lib/plant-data"
import { PlantCard } from "@/components/plant-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { CheckoutForm } from "@/components/checkout-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PlantShop() {
  const [plants, setPlants] = useState(plantData)
  const [filteredPlants, setFilteredPlants] = useState(plantData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")

  // Get unique plant categories
  const getPlantCategories = () => {
    const categories = new Set()

    plants.forEach((plant) => {
      const name = plant.commonName.toLowerCase()

      if (name.includes("avocado")) categories.add("avocado")
      else if (
        name.includes("citrus") ||
        name.includes("lemon") ||
        name.includes("lime") ||
        name.includes("orange") ||
        name.includes("mandarin") ||
        name.includes("kumquat") ||
        name.includes("tangelo") ||
        name.includes("pummelo")
      )
        categories.add("citrus")
      else if (name.includes("berry") || name.includes("raspberry") || name.includes("blueberry"))
        categories.add("berries")
      else if (
        name.includes("stone fruit") ||
        name.includes("peach") ||
        name.includes("plum") ||
        name.includes("nectarine") ||
        name.includes("cherry")
      )
        categories.add("stone-fruit")
      else categories.add("other")
    })

    return ["all", ...Array.from(categories)]
  }

  const categories = getPlantCategories()

  // Filter and sort plants
  useEffect(() => {
    let result = [...plants]

    // Apply category filter
    if (activeCategory !== "all") {
      result = result.filter((plant) => {
        const name = plant.commonName.toLowerCase()

        if (activeCategory === "avocado" && name.includes("avocado")) return true
        if (
          activeCategory === "citrus" &&
          (name.includes("citrus") ||
            name.includes("lemon") ||
            name.includes("lime") ||
            name.includes("orange") ||
            name.includes("mandarin") ||
            name.includes("kumquat") ||
            name.includes("tangelo") ||
            name.includes("pummelo"))
        )
          return true
        if (
          activeCategory === "berries" &&
          (name.includes("berry") || name.includes("raspberry") || name.includes("blueberry"))
        )
          return true
        if (
          activeCategory === "stone-fruit" &&
          (name.includes("stone fruit") ||
            name.includes("peach") ||
            name.includes("plum") ||
            name.includes("nectarine") ||
            name.includes("cherry"))
        )
          return true
        if (
          activeCategory === "other" &&
          !(
            name.includes("avocado") ||
            name.includes("citrus") ||
            name.includes("lemon") ||
            name.includes("lime") ||
            name.includes("orange") ||
            name.includes("mandarin") ||
            name.includes("kumquat") ||
            name.includes("tangelo") ||
            name.includes("pummelo") ||
            name.includes("berry") ||
            name.includes("raspberry") ||
            name.includes("blueberry") ||
            name.includes("stone fruit") ||
            name.includes("peach") ||
            name.includes("plum") ||
            name.includes("nectarine") ||
            name.includes("cherry")
          )
        )
          return true

        return false
      })
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (plant) => plant.botanicalName.toLowerCase().includes(query) || plant.commonName.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter((plant) => plant.commonName.toLowerCase().includes(filterType.toLowerCase()))
    }

    // Apply sorting
    if (sortBy === "name") {
      result.sort((a, b) => a.commonName.localeCompare(b.commonName))
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.retailPrice - b.retailPrice)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.retailPrice - a.retailPrice)
    }

    setFilteredPlants(result)
  }, [plants, searchQuery, filterType, sortBy, activeCategory])

  // Add plant to cart
  const addToCart = (plant) => {
    if (plant.availability === 0) return

    const existingItem = cart.find((item) => item.id === plant.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...plant, quantity: 1 }])
    }
  }

  // Remove plant from cart
  const removeFromCart = (plantId) => {
    setCart(cart.filter((item) => item.id !== plantId))
  }

  // Update quantity in cart
  const updateQuantity = (plantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(plantId)
      return
    }

    setCart(cart.map((item) => (item.id === plantId ? { ...item, quantity: newQuantity } : item)))
  }

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Get unique plant types for filter
  const plantTypes = [
    "all",
    ...new Set(
      plants.map((plant) => {
        const nameParts = plant.commonName.split(" ")
        return nameParts[nameParts.length - 1]
      }),
    ),
  ]

  // Handle checkout
  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  // Handle form submission
  const handleFormSubmit = (formData) => {
    // In a real app, this would send the data to a server
    console.log("Form submitted:", formData)
    console.log("Cart items:", cart)

    // Show confirmation
    alert("Thank you! We've received your order and will contact you shortly with a quote.")

    // Reset cart and close checkout
    setCart([])
    setIsCheckoutOpen(false)
  }

  // Get category display name
  const getCategoryDisplayName = (category) => {
    switch (category) {
      case "all":
        return "All Plants"
      case "avocado":
        return "Avocados"
      case "citrus":
        return "Citrus"
      case "berries":
        return "Berries"
      case "stone-fruit":
        return "Stone Fruits"
      case "other":
        return "Other Plants"
      default:
        return category.charAt(0).toUpperCase() + category.slice(1)
    }
  }

  return (
    <div className="relative">
      {/* Category tabs */}
      <div className="mb-6">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start sm:justify-center">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                <Leaf size={16} />
                {getCategoryDisplayName(category)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Filters and search */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search plants..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center">
            <Filter size={18} className="text-gray-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {plantTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="flex items-center gap-2 ml-auto" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={18} />
            <span>Cart ({totalItems})</span>
          </Button>
        </div>
      </div>

      {/* Plant listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} onAddToCart={() => addToCart(plant)} />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No plants found matching your criteria.</p>
        </div>
      )}

      {/* Cart sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout form */}
      {isCheckoutOpen && (
        <CheckoutForm cart={cart} onClose={() => setIsCheckoutOpen(false)} onSubmit={handleFormSubmit} />
      )}
    </div>
  )
}

