import { PlantShop } from "@/components/plant-shop"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-green-800 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Earth People LandCare</h1>
          <p className="text-lg mt-2">Fruit Trees & Edible Plants - Grow your own food!</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Premium Plants for Your Garden</h2>
          <p className="text-gray-700">
            We offer a curated selection of high-quality plants, hand-picked for optimal growth in your region. Browse
            our selection and order online for easy delivery and installation.
          </p>
        </section>

        <section className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-green-800 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-700 mb-2">Real-Time Inventory</h3>
              <p>Our selection updates based on availability.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-700 mb-2">Transparent Pricing</h3>
              <p>All prices reflect quality plants, ready for your landscape.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-700 mb-2">Convenient Ordering</h3>
              <p>Choose your plants, and we'll handle delivery and installation.</p>
            </div>
          </div>
        </section>

        <PlantShop />
      </main>

      <footer className="bg-green-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Earth People LandCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

