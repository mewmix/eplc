// Utility functions for handling plant images

// Function to determine plant type from name
export function getPlantType(commonName: string): string {
  const name = commonName.toLowerCase()

  if (name.includes("avocado")) return "avocado"
  if (name.includes("almond")) return "almond"
  if (name.includes("apple")) return "apple"
  if (name.includes("blueberry")) return "blueberry"
  if (name.includes("cherry")) return "cherry"
  if (name.includes("dragon fruit")) return "dragon-fruit"
  if (name.includes("grape")) return "grape"
  if (name.includes("guava")) return "guava"
  if (name.includes("kiwi")) return "kiwi"
  if (name.includes("kumquat")) return "kumquat"
  if (name.includes("lemon")) return "lemon"
  if (name.includes("lime")) return "lime"
  if (name.includes("mandarin") || name.includes("clementine") || name.includes("satsuma")) return "mandarin"
  if (name.includes("nectarine")) return "nectarine"
  if (name.includes("olive")) return "olive"
  if (name.includes("orange")) return "orange"
  if (name.includes("passion fruit")) return "passion-fruit"
  if (name.includes("peach")) return "peach"
  if (name.includes("persimmon")) return "persimmon"
  if (name.includes("plum")) return "plum"
  if (name.includes("pomegranate")) return "pomegranate"
  if (name.includes("pummelo")) return "pummelo"
  if (name.includes("raspberry")) return "raspberry"
  if (name.includes("tangelo")) return "tangelo"

  // Default to a generic fruit tree image
  return "fruit-tree"
}

// Get image URL for a plant
export function getPlantImageUrl(plant: any): string {
  const type = getPlantType(plant.commonName)

  // Use Unsplash source for realistic plant images
  // Using specific collections for fruit trees and plants
  const imageMap = {
    avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop",
    almond: "https://images.unsplash.com/photo-1574570068476-a85f0fb1f859?w=400&h=300&fit=crop",
    apple: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&h=300&fit=crop",
    blueberry: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=300&fit=crop",
    cherry: "https://images.unsplash.com/photo-1528821128474-25c5c5a1c556?w=400&h=300&fit=crop",
    "dragon-fruit": "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&h=300&fit=crop",
    grape: "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400&h=300&fit=crop",
    guava: "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=300&fit=crop",
    kiwi: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&h=300&fit=crop",
    kumquat: "https://images.unsplash.com/photo-1591329857535-41a5a6dee9ff?w=400&h=300&fit=crop",
    lemon: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=300&fit=crop",
    lime: "https://images.unsplash.com/photo-1622957461168-202e611c8077?w=400&h=300&fit=crop",
    mandarin: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&h=300&fit=crop",
    nectarine: "https://images.unsplash.com/photo-1521243495304-138a02be58e2?w=400&h=300&fit=crop",
    olive: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop",
    orange: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&h=300&fit=crop",
    "passion-fruit": "https://images.unsplash.com/photo-1604145559206-e3bce0040e2d?w=400&h=300&fit=crop",
    peach: "https://images.unsplash.com/photo-1595743825637-cdafc8ad4173?w=400&h=300&fit=crop",
    persimmon: "https://images.unsplash.com/photo-1604836767755-35493ce9b9dd?w=400&h=300&fit=crop",
    plum: "https://images.unsplash.com/photo-1599639668273-7cf4e5a2fe77?w=400&h=300&fit=crop",
    pomegranate: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=400&h=300&fit=crop",
    pummelo: "https://images.unsplash.com/photo-1587496679742-bad502958fbf?w=400&h=300&fit=crop",
    raspberry: "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=400&h=300&fit=crop",
    tangelo: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=300&fit=crop",
    "fruit-tree": "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop",
  }

  return imageMap[type] || imageMap["fruit-tree"]
}

// Get a container size image based on the size
export function getContainerSizeImage(containerSize: string): string {
  if (containerSize.includes("25") || containerSize.includes("24")) {
    return "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=100&h=100&fit=crop"
  } else if (containerSize.includes("15") || containerSize.includes("10")) {
    return "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=80&h=80&fit=crop"
  } else {
    return "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=60&h=60&fit=crop"
  }
}

