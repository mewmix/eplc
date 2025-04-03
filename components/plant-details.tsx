"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { plantsData } from "@/data/plants"

interface PlantDetailsProps {
  plantId: string
  onClose: () => void
  onAddToCart: () => void
}

export function PlantDetails({ plantId, onClose, onAddToCart }: PlantDetailsProps) {
  const plant = plantsData.find((p) => p.id === plantId)
  const [activeTab, setActiveTab] = useState<"description" | "care">("description")

  if (!plant) return null

  // Sample descriptions and care instructions (in a real app, these would come from the database)
  const descriptions: Record<string, string> = {
    default:
      "This beautiful plant will make a wonderful addition to your garden, providing delicious fruits and adding beauty to your landscape.",
    "All in One Almond":
      "The All-in-One Almond is a self-fertile variety that produces soft-shelled nuts with excellent flavor. It's perfect for home gardens with limited space.",
    "Fuji Apple":
      "The Fuji apple is known for its crisp, sweet flavor and excellent keeping qualities. This variety produces medium to large fruits with a beautiful red-over-yellow skin.",
    "Emerald Blueberry":
      "The Emerald Blueberry is a southern highbush variety that produces large, sweet berries with a mild flavor. It's an early to mid-season producer with excellent quality fruit.",
    "Wonderful Pomegranate":
      "The Wonderful Pomegranate produces large, purple-red fruits with deep red, juicy seeds. It's the most commercially grown variety due to its excellent flavor and productivity.",
  }

  const careInstructions: Record<string, string> = {
    default:
      "Plant in well-draining soil with full sun exposure. Water regularly during the first growing season to establish a deep root system. Fertilize in early spring with a balanced organic fertilizer.",
    "All in One Almond":
      "Plant in full sun with well-draining soil. Water deeply but infrequently once established. Prune in late winter to maintain shape and remove any dead or crossing branches.",
    "Fuji Apple":
      "Requires 400-600 chill hours. Plant in full sun with well-draining soil. Prune annually during dormancy to maintain an open center. Thin fruits to improve size and prevent branch breakage.",
    "Emerald Blueberry":
      "Plant in acidic soil (pH 4.5-5.5) with good drainage. Mulch with pine bark or pine needles to maintain soil acidity. Water consistently to keep soil moist but not soggy.",
    "Wonderful Pomegranate":
      "Drought tolerant once established. Plant in full sun with well-draining soil. Prune lightly in winter to shape and remove suckers. Fertilize in spring with a balanced fertilizer.",
  }

  const description = descriptions[plant.commonName] || descriptions.default
  const care = careInstructions[plant.commonName] || careInstructions.default

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-[300px] md:h-full">
              <Image
                src={
                  plant.image || `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(plant.commonName)}`
                }
                alt={plant.commonName}
                fill
                className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-1">{plant.commonName}</h2>
              <p className="text-gray-600 mb-4">{plant.displayName}</p>

              <div className="flex gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-bold">${plant.retailPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="text-lg">{plant.containerSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-lg">{plant.available}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex border-b">
                  <button
                    className={`py-2 px-4 font-medium ${activeTab === "description" ? "border-b-2 border-green-700 text-green-700" : "text-gray-500"}`}
                    onClick={() => setActiveTab("description")}
                  >
                    Description
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${activeTab === "care" ? "border-b-2 border-green-700 text-green-700" : "text-gray-500"}`}
                    onClick={() => setActiveTab("care")}
                  >
                    Care Instructions
                  </button>
                </div>

                <div className="py-4">{activeTab === "description" ? <p>{description}</p> : <p>{care}</p>}</div>
              </div>

              <Button
                className="w-full bg-green-700 hover:bg-green-800"
                onClick={() => {
                  onAddToCart()
                  onClose()
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

