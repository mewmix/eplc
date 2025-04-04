"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { plantsData } from "@/data/plants"

export default function AdminPage() {
  const [inventory, setInventory] = useState(plantsData)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setUploadSuccess(false)
  }

  const handleProcessFile = () => {
    if (!uploadedFile) return

    setIsUploading(true)

    // Simulate processing the file
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)

      // In a real application, you would parse the CSV/Excel file here
      // and update the inventory state with the new data
    }, 2000)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

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
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" placeholder="e.g., Apple 'Fuji' 10/15 gal" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="commonName">Common Name</Label>
                    <Input id="commonName" placeholder="e.g., Fuji Apple" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="containerSize">Container Size</Label>
                      <Input id="containerSize" placeholder="e.g., 10/15 gallon" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="basePrice">Base Price ($)</Label>
                      <Input id="basePrice" type="number" step="0.01" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="available">Available Quantity</Label>
                      <Input id="available" type="number" placeholder="0" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="retailPrice">Retail Price ($)</Label>
                      <Input id="retailPrice" type="number" step="0.01" placeholder="0.00" disabled />
                      <p className="text-xs text-gray-500">Auto-calculated at 1.75× base price</p>
                    </div>
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
                      <th className="text-left py-3 px-4">Plant Name</th>
                      <th className="text-left py-3 px-4">Size</th>
                      <th className="text-left py-3 px-4">Base Price</th>
                      <th className="text-left py-3 px-4">Retail Price</th>
                      <th className="text-left py-3 px-4">Available</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.slice(0, 10).map((plant) => (
                      <tr key={plant.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{plant.commonName}</p>
                            <p className="text-sm text-gray-500">{plant.displayName}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{plant.containerSize}</td>
                        <td className="py-3 px-4">${plant.basePrice.toFixed(2)}</td>
                        <td className="py-3 px-4">${plant.retailPrice.toFixed(2)}</td>
                        <td className="py-3 px-4">{plant.available}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {inventory.length > 10 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline">Load More</Button>
                </div>
              )}
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

