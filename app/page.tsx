import { PlantCatalog } from "@/components/plant-catalog"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9f6]">
      <HeroSection />
      <HowItWorks />
      <PlantCatalog />
    </div>
  )
}

