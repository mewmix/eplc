import { PlantShop } from "@/components/plant-shop";

export default function Home() {
  return (
    <>
      <section className="max-w-4xl mx-auto mb-12 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Premium Plants for Your Garden
        </h2>
        <p className="text-gray-700">
          We offer a curated selection of high-quality plants, hand-picked for
          optimal growth in your region. Browse our selection and order online
          for easy delivery and installation.
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
    </>
  );
}
