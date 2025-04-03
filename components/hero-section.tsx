import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=600&width=1600"
          alt="Fruit trees and edible plants"
          fill
          className="object-cover brightness-[0.85]"
          priority
        />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Grow Your Own Food with Premium Plants</h1>
          <p className="text-lg md:text-xl mb-8">
            A curated selection of high-quality fruit trees, berries, and edible plants, hand-picked for optimal growth
            in your region.
          </p>
          <Button size="lg" className="bg-green-700 hover:bg-green-800">
            Browse Our Selection
          </Button>
        </div>
      </div>
    </div>
  )
}

