import { Leaf, Truck, DollarSign } from "lucide-react"

export function HowItWorks() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <Leaf className="h-8 w-8 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Inventory</h3>
            <p className="text-gray-600">
              Our selection updates based on availability, ensuring you only see what's currently in stock.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
            <p className="text-gray-600">
              All prices reflect quality plants, ready for your landscape with no hidden costs.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <Truck className="h-8 w-8 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Convenient Ordering</h3>
            <p className="text-gray-600">
              Choose your plants, and we'll handle delivery and installation for a seamless experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

