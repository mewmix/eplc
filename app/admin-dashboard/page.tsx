"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react" // Added useEffect

// Define a Plant interface based on data/plant-data.json structure
interface Plant {
  id: string;
  botanicalName: string;
  commonName: string;
  displayName: string;
  containerSize: string;
  basePrice: number;
  retailPrice: number;
  availability: string; // Or number, depending on actual data
  image?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [error, setError] = useState("")

  const [inventory, setInventory] = useState<Plant[]>([]) // Initialize with empty array
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Form state for adding a new plant
  const [newPlant, setNewPlant] = useState<Omit<Plant, 'id' | 'retailPrice'>>({
    botanicalName: "",
    commonName: "",
    displayName: "",
    containerSize: "",
    basePrice: 0,
    availability: "",
    image: "",
  })

  const HARDCODED_PASSWORD = "password123"

  // Fetch initial inventory
  useEffect(() => {
    if (isAuthenticated) {
      const fetchInventory = async () => {
        try {
          setApiError(null)
          const response = await fetch("/api/products")
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data: Plant[] = await response.json()
          setInventory(data)
        } catch (e: any) {
          console.error("Failed to fetch inventory:", e)
          setApiError("Failed to load inventory. Please try refreshing.")
        }
      }
      fetchInventory()
    }
  }, [isAuthenticated])

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (passwordInput === HARDCODED_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
      setIsAuthenticated(false)
    }
  }

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setUploadSuccess(false)
    setApiError(null)
  }

  const handleProcessFile = async () => {
    if (!uploadedFile) return

    setIsUploading(true)
    setApiError(null)
    setUploadSuccess(false)

    // Simulate reading and parsing the file
    // In a real app, you'd use a library to parse CSV/Excel
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result
        if (typeof fileContent !== 'string') {
          throw new Error("Failed to read file content.")
        }
        // Assuming the file is a JSON array of plants for simplicity
        const newInventoryData: Plant[] = JSON.parse(fileContent)

        // Validate newInventoryData structure if necessary

        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newInventoryData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        setInventory(newInventoryData) // Update local state with the new data
        setUploadSuccess(true)
        alert("Inventory uploaded successfully!")
      } catch (e: any) {
        console.error("Failed to process or upload file:", e)
        setApiError(`File processing/upload error: ${e.message}`)
        alert(`Error: ${e.message}`)
      } finally {
        setIsUploading(false)
      }
    }
    reader.onerror = () => {
        console.error("FileReader error")
        setApiError("Error reading the uploaded file.")
        alert("Error reading the uploaded file.")
        setIsUploading(false)
    }
    reader.readAsText(uploadedFile) // For this example, assuming text/JSON file
  }

  const handleAddPlantSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setApiError(null)

    if (!newPlant.commonName || !newPlant.botanicalName || !newPlant.basePrice) {
        alert("Please fill in at least Common Name, Botanical Name, and Base Price.");
        return;
    }

    const plantToAdd: Plant = {
      ...newPlant,
      id: Date.now().toString(), // Simple unique ID
      retailPrice: parseFloat((newPlant.basePrice * 1.75).toFixed(2)), // Calculate retail price
    }

    const updatedInventory = [...inventory, plantToAdd]

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInventory),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setInventory(updatedInventory)
      setNewPlant({ // Reset form
        botanicalName: "", commonName: "", displayName: "",
        containerSize: "", basePrice: 0, availability: "", image: ""
      })
      alert("Plant added successfully!")
    } catch (e: any) {
      console.error("Failed to add plant:", e)
      setApiError(`Failed to add plant: ${e.message}`)
      alert(`Error: ${e.message}`)
    }
  }

  const handleDeletePlant = async (plantId: string) => {
    if (!confirm("Are you sure you want to delete this plant?")) return;
    setApiError(null)

    const updatedInventory = inventory.filter((plant) => plant.id !== plantId)

    try {
      const response = await fetch("/api/products", {
        method: "POST", // Using POST as per API design to overwrite data
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInventory),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setInventory(updatedInventory)
      alert("Plant deleted successfully!")
    } catch (e: any) {
      console.error("Failed to delete plant:", e)
      setApiError(`Failed to delete plant: ${e.message}`)
      alert(`Error: ${e.message}`)
    }
  }
  
  const handleNewPlantInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setNewPlant(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };


  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Please enter the password to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          Error: {apiError}
        </div>
      )}

      <Tabs defaultValue="inventory">
        <TabsList className="mb-6">
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Inventory</CardTitle>
                <CardDescription>
                  Upload a CSV or Excel file with your current plant inventory. Prices will automatically be calculated
                  at 1.75× the base price.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUpload={handleFileUpload} />

                {uploadedFile && (
                  <div className="mt-4">
                    <Button
                      onClick={handleProcessFile}
                      disabled={isUploading}
                      className="w-full bg-green-700 hover:bg-green-800"
                    >
                      {isUploading ? "Processing..." : "Process File"}
                    </Button>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                    File processed successfully! Your inventory has been updated.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Individual Plant</CardTitle>
                <CardDescription>Manually add a new plant to your inventory.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPlantSubmit} className="space-y-4">
                  {/* Add all fields from Plant interface, except id and retailPrice */}
                  <div className="grid gap-2">
                    <Label htmlFor="commonName">Common Name*</Label>
                    <Input id="commonName" name="commonName" value={newPlant.commonName} onChange={handleNewPlantInputChange} placeholder="e.g., Fuji Apple" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="botanicalName">Botanical Name*</Label>
                    <Input id="botanicalName" name="botanicalName" value={newPlant.botanicalName} onChange={handleNewPlantInputChange} placeholder="e.g., Malus domestica 'Fuji'" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" name="displayName" value={newPlant.displayName} onChange={handleNewPlantInputChange} placeholder="e.g., Apple 'Fuji' 10/15 gal" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="containerSize">Container Size</Label>
                      <Input id="containerSize" name="containerSize" value={newPlant.containerSize} onChange={handleNewPlantInputChange} placeholder="e.g., 10/15 gallon" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="basePrice">Base Price ($)*</Label>
                      <Input id="basePrice" name="basePrice" type="number" step="0.01" value={newPlant.basePrice} onChange={handleNewPlantInputChange} placeholder="0.00" required />
                    </div>
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Input id="availability" name="availability" value={newPlant.availability} onChange={handleNewPlantInputChange} placeholder="e.g., In Stock" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="retailPrice">Retail Price ($)</Label>
                        <Input id="retailPrice" type="number" step="0.01" value={(newPlant.basePrice * 1.75).toFixed(2)} disabled placeholder="Auto-calculated" />
                        <p className="text-xs text-gray-500">Auto-calculated at 1.75× base price</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input id="image" name="image" value={newPlant.image || ''} onChange={handleNewPlantInputChange} placeholder="e.g., https://example.com/image.jpg" />
                  </div>

                  <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                    Add Plant
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>You have {inventory.length} plants in your inventory.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Display Name</th>
                      <th className="text-left py-3 px-4">Common Name</th>
                      <th className="text-left py-3 px-4">Botanical Name</th>
                      <th className="text-left py-3 px-4">Size</th>
                      <th className="text-left py-3 px-4">Base Price</th>
                      <th className="text-left py-3 px-4">Retail Price</th>
                      <th className="text-left py-3 px-4">Availability</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((plant) => ( // Removed slice to show all inventory
                      <tr key={plant.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-xs">{plant.id}</td>
                        <td className="py-3 px-4">{plant.displayName}</td>
                        <td className="py-3 px-4">{plant.commonName}</td>
                        <td className="py-3 px-4 italic">{plant.botanicalName}</td>
                        <td className="py-3 px-4">{plant.containerSize}</td>
                        <td className="py-3 px-4">${plant.basePrice.toFixed(2)}</td>
                        <td className="py-3 px-4">${plant.retailPrice.toFixed(2)}</td>
                        <td className="py-3 px-4">{plant.availability}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeletePlant(plant.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Removed Load More button for now, as we show all inventory */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage customer orders and track shipments.</CardDescription>
            </CardHeader>
            <CardContent>
              {inventory.length === 0 && !apiError && (
                 <p className="text-center py-8 text-gray-500">No inventory data. Try fetching or uploading.</p>
              )}
              {/* Display apiError specific to inventory loading here if needed */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage customer orders and track shipments.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">No orders to display.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Configure your store settings and pricing rules.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Settings form can be enhanced later if needed */}
              <form className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="pricingMultiplier">Pricing Multiplier</Label>
                  <Input id="pricingMultiplier" type="number" step="0.01" defaultValue="1.75" />
                  <p className="text-xs text-gray-500">
                    This value is used to calculate retail prices from base prices.
                  </p>
                </div>

                <Button type="submit" className="bg-green-700 hover:bg-green-800">
                  Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

