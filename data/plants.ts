// Define delivery cost constants
export const baseCosts = {
  local: { small: 50, medium: 75, large: 100 },
  regional: { small: 75, medium: 100, large: 125 },
  extended: { small: 100, medium: 125, large: 150 },
}

// This file contains the plant data with retail prices calculated (base price × 1.75)

export interface Plant {
  id: string
  displayName: string
  commonName: string
  containerSize: string
  basePrice: number
  retailPrice: number
  available: number
  image?: string
}

// The plantsData array has been removed from this file.
// It is now fetched from the API endpoint /api/products,
// which reads from data/plant-data.json.

