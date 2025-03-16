"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPlantImageUrl } from "@/lib/image-utils"

export function PlantCard({ plant, onAddToCart }) {
  const { botanicalName, commonName, containerSize, retailPrice, availability } = plant

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-green-100">
          <Image src={getPlantImageUrl(plant) || "/placeholder.svg"} alt={commonName} fill className="object-cover" />
          {availability <= 3 && availability > 0 && (
            <Badge className="absolute top-2 right-2 bg-amber-500">Only {availability} left</Badge>
          )}
          {availability === 0 && <Badge className="absolute top-2 right-2 bg-red-500">Out of stock</Badge>}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
            <h3 className="font-bold text-lg">{commonName}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-500 italic mb-2">{botanicalName}</p>
        <p className="text-sm mb-2">{containerSize}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-lg">${retailPrice.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={onAddToCart} className="w-full bg-green-700 hover:bg-green-800" disabled={availability === 0}>
          {availability === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}

