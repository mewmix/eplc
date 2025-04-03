// Filename: components/plant-catalog.tsx (or plant-shop.tsx)
"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PlantDetails } from "@/components/plant-details"
import { CheckoutModal } from "@/components/checkout-modal"
import Image from "next/image"
import { FloatingCart } from "@/components/floating-cart"
import { useToast } from "@/components/ui/use-toast"
import { getPlantImageUrl } from "@/lib/image-utils"
import { CartSidebar } from "@/components/cart-sidebar"; // <-- **ADDED IMPORT**

// ... (rest of the type definitions: Plant, CartItem, SortOption, FilterOption) ...
type Plant = {
  id: string
  displayName: string
  commonName: string
  botanicalName?: string
  containerSize: string
  basePrice: number
  retailPrice: number
  available: number
  image?: string
}

type CartItem = Plant & { quantity: number }

type SortOption = "name" | "price-low" | "price-high" | "size"
type FilterOption = "all" | "fruit" | "berry" | "vine" | "tree"

export function PlantCatalog() {
  const [allPlants, setAllPlants] = useState<Plant[]>([])
  const [filteredAndSortedPlants, setFilteredAndSortedPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const { toast } = useToast()

  // --- Fetch Data ---
  useEffect(() => {
    setIsLoading(true)
    fetch('/plant-data.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json()
      })
      .then((data: Omit<Plant, 'retailPrice'>[]) => {
        const plantsWithRetailPrice = data.map(plant => ({
          ...plant,
          retailPrice: plant.basePrice * 1.75,
        }))
        setAllPlants(plantsWithRetailPrice)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching plant data:", error)
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load plant data. Please try again later.",
        })
        setIsLoading(false)
      })
  }, [toast])

  // --- Filter and Sort Logic ---
  useEffect(() => {
    let result = [...allPlants]

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(plant =>
        plant.displayName.toLowerCase().includes(lowerSearchTerm) ||
        plant.commonName.toLowerCase().includes(lowerSearchTerm) ||
        (plant.botanicalName && plant.botanicalName.toLowerCase().includes(lowerSearchTerm))
      )
    }

     // Filter by category
    if (filterBy !== "all") {
       const categoryMap: Record<FilterOption, string[]> = {
         all: [],
         fruit: ["apple", "peach", "plum", "nectarine", "persimmon", "dragon fruit", "guava", "almond", "cherry", "pomegranate", "avocado", "kumquat", "lemon", "lime", "orange", "mandarin", "tangelo", "pummelo"],
         berry: ["blueberry", "raspberry"],
         vine: ["grape", "kiwi", "passion fruit"],
         tree: ["olive"],
       }
       const keywords = categoryMap[filterBy];
       result = result.filter(plant =>
         keywords.some(keyword => plant.commonName.toLowerCase().includes(keyword))
       );
    }

    // Sort plants
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.displayName.localeCompare(b.displayName)
        case "price-low":
          return a.retailPrice - b.retailPrice
        case "price-high":
          return b.retailPrice - a.retailPrice
        case "size":
          const sizeA = parseInt(a.containerSize.split(' ')[0]);
          const sizeB = parseInt(b.containerSize.split(' ')[0]);
          return (isNaN(sizeA) ? 0 : sizeA) - (isNaN(sizeB) ? 0 : sizeB);
        default:
          return 0
      }
    })

    setFilteredAndSortedPlants(result)
  }, [allPlants, searchTerm, filterBy, sortBy])

  // --- Cart Functions ---
  const addToCart = (id: string) => {
    const plantToAdd = allPlants.find((p) => p.id === id)
    if (!plantToAdd || plantToAdd.available <= 0) return

    const existingItemIndex = cart.findIndex((item) => item.id === id)

    if (existingItemIndex > -1) {
      if (cart[existingItemIndex].quantity < plantToAdd.available) {
         const newCart = [...cart];
         newCart[existingItemIndex].quantity += 1;
         setCart(newCart);
         toast({ variant: "success", title: "Item Added", description: `${plantToAdd.commonName} quantity updated.`, duration: 2000 });
      } else {
          toast({ variant: "destructive", title: "Stock Limit", description: `Cannot add more ${plantToAdd.commonName}. Only ${plantToAdd.available} available.`, duration: 3000 });
      }
    } else {
      setCart([...cart, { ...plantToAdd, quantity: 1 }])
       toast({ variant: "success", title: "Item Added", description: `${plantToAdd.commonName} added to cart.`, duration: 2000 });
    }
    setIsCartOpen(true);
  }

  const updateCartQuantity = (id: string, newQuantity: number) => {
     const plantInCatalog = allPlants.find(p => p.id === id);
     if (!plantInCatalog) return;

     if (newQuantity <= 0) {
       removeFromCart(id);
     } else if (newQuantity > plantInCatalog.available) {
         toast({ variant: "destructive", title: "Stock Limit", description: `Cannot set quantity for ${plantInCatalog.commonName}. Only ${plantInCatalog.available} available.`, duration: 3000 });
     } else {
        setCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
     }
  };

  const removeFromCart = (id: string) => {
    const plantToRemove = cart.find(item => item.id === id);
    setCart(cart.filter((item) => item.id !== id))
    if (plantToRemove) {
         toast({ title: "Item Removed", description: `${plantToRemove.commonName} removed from cart.`, duration: 2000 });
    }
  }

  const cartTotal = cart.reduce((total, item) => total + item.retailPrice * item.quantity, 0)
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  // --- Checkout Logic ---
  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false)
    setCart([])
     toast({ title: "Order Submitted", description: "Your order request has been sent!", duration: 4000 });
  }

  const selectedPlantData = allPlants.find(p => p.id === selectedPlantId);

  // --- Render ---
  if (isLoading) {
    // ... (loading state JSX remains the same) ...
     return (
      <div className="container mx-auto px-4 py-16">
         <h2 className="text-3xl font-bold mb-8">Loading Plants...</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(6)].map((_, i) => (
             <Card key={i} className="overflow-hidden">
               <div className="h-48 bg-gray-200 animate-pulse"></div>
               <CardContent className="p-6 space-y-3">
                 <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                 <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                 <div className="flex justify-between items-center mt-4">
                    <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
    );
  }

  return (
    <div className="bg-[#f8f9f6] py-16">
      <div className="container mx-auto px-4">
        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Our Plant Selection</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search plants..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
           {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-4 w-4" />
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
           {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Sort by:</span>
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

        {/* Plant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPlants.map((plant) => (
            // ... (Plant Card JSX remains the same) ...
             <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative h-48 w-full">
                 <Image
                   src={getPlantImageUrl(plant) || "/placeholder.svg?height=400&width=400&text=Plant"}
                   alt={plant.commonName}
                   fill
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-cover"
                   priority={false}
                 />
                 {plant.available > 0 && plant.available <= 3 && (
                    <Badge variant="destructive" className="absolute top-2 right-2">Only {plant.available} left</Badge>
                 )}
                 {plant.available === 0 && (
                   <Badge variant="secondary" className="absolute top-2 right-2">Out of stock</Badge>
                 )}
              </div>
              <CardContent className="p-4 flex-grow flex flex-col justify-between">
                 <div>
                    <h3 className="font-bold text-lg mb-1">{plant.commonName}</h3>
                    <p className="text-sm text-gray-500 italic mb-2">{plant.botanicalName || plant.displayName}</p>
                    <p className="text-sm text-gray-600 mb-3">{plant.containerSize}</p>
                    <p className="font-bold text-lg">${plant.retailPrice.toFixed(2)}</p>
                 </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedPlantId(plant.id)}>
                    Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-green-700 hover:bg-green-800"
                    onClick={() => addToCart(plant.id)}
                    disabled={plant.available === 0}
                  >
                    {plant.available === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredAndSortedPlants.length === 0 && !isLoading && (
          <div className="text-center py-12 col-span-full">
            <p className="text-lg text-gray-500">No plants found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Modals and Floating Cart */}
      {selectedPlantData && (
        <PlantDetails
          plantId={selectedPlantId!}
          onClose={() => setSelectedPlantId(null)}
          onAddToCart={() => {
             if (selectedPlantId) {
                 addToCart(selectedPlantId)
             }
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

       {/* ** THIS IS WHERE THE ERROR WAS - CartSidebar component being called ** */}
        <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={updateCartQuantity} // Ensure this function exists and handles updates
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
        />

      <FloatingCart cart={cart} onCartOpen={() => setIsCartOpen(true)} />
    </div>
  )
}