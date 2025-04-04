// Filename: app/admin-dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, ListOrdered, Settings, ShoppingBag, AlertCircle } from "lucide-react"; // Import icons

// Define Plant type consistent with JSON and component usage
type Plant = {
  id: string;
  displayName: string;
  commonName: string;
  botanicalName?: string; // Make optional if not always present
  containerSize: string;
  basePrice: number;
  retailPrice: number; // Calculated
  available: number;
  image?: string;
};

export default function AdminDashboardPage() { // Renamed component function
  const [inventory, setInventory] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch inventory data for display
  useEffect(() => {
    setIsLoading(true);
    fetch('/plant-data.json') // Fetch the live data
      .then(res => {
         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
         // Ensure response is JSON
         const contentType = res.headers.get("content-type");
         if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Received non-JSON response");
         }
         return res.json();
       })
      .then(data => {
        if (!Array.isArray(data)) {
            throw new Error("Fetched data is not an array");
        }
        // Calculate retailPrice after fetching
        const plantsWithRetailPrice = data.map((plant: Omit<Plant, 'retailPrice'>) => ({
          ...plant,
          retailPrice: typeof plant.basePrice === 'number' ? plant.basePrice * 1.75 : 0,
        }));
        setInventory(plantsWithRetailPrice);
      })
      .catch(error => {
        console.error("Error fetching inventory for admin dashboard:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load inventory preview." });
      })
      .finally(() => {
         setIsLoading(false); // Ensure loading stops even on error
      });
  }, [toast]); // Add toast to dependency array

  // Calculate stats based on fetched inventory
  const lowStockCount = inventory.filter(p => p.available > 0 && p.available <= 3).length;
  const outOfStockCount = inventory.filter(p => p.available === 0).length;

  return (
    <div className="container mx-auto py-10">
      {/* --- Header & Link to CMS --- */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {/* Link points correctly to the CMS */}
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href="/admin/" target="_blank" rel="noopener noreferrer">
               <ExternalLink className="mr-2 h-4 w-4" /> Edit Plant Inventory (CMS)
            </Link>
          </Button>
      </div>

      {/* --- Overview Stats --- */}
       <div className="grid gap-4 md:grid-cols-3 mb-8">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Plant Types</CardTitle>
             <ListOrdered className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">
               {isLoading ? '...' : inventory.length}
             </div>
              <p className="text-xs text-muted-foreground">Different plant varieties listed</p>
           </CardContent>
         </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-amber-600">
                 {isLoading ? '...' : lowStockCount}
               </div>
              <p className="text-xs text-muted-foreground">Items with 3 or less available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
              <ShoppingBag className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-red-600">
                  {isLoading ? '...' : outOfStockCount}
               </div>
              <p className="text-xs text-muted-foreground">Items with 0 available</p>
            </CardContent>
          </Card>
       </div>


      {/* --- Tabs --- */}
      <Tabs defaultValue="inventory_preview">
        <TabsList className="mb-6">
          <TabsTrigger value="inventory_preview">Inventory Preview</TabsTrigger>
          <TabsTrigger value="orders" disabled>Orders (Coming Soon)</TabsTrigger>
          <TabsTrigger value="settings" disabled>Settings (Coming Soon)</TabsTrigger>
        </TabsList>

        {/* --- Inventory Preview Tab --- */}
        <TabsContent value="inventory_preview">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory Preview</CardTitle>
              <CardDescription>
                 This is a read-only view. Use the 'Edit Plant Inventory (CMS)' button above to make changes. Updates will appear after the site rebuilds.
              </CardDescription>
            </CardHeader>
            <CardContent>
             {isLoading ? (
                <p className="text-center text-gray-500 py-8">Loading inventory...</p>
             ) : inventory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No inventory data found or failed to load. Check `public/plant-data.json` or CMS configuration.</p>
             ) : (
              <div className="overflow-x-auto max-h-[60vh]">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Plant Name</th>
                      <th className="text-left py-3 px-4 font-medium">Size</th>
                      <th className="text-right py-3 px-4 font-medium">Base Price</th>
                      <th className="text-right py-3 px-4 font-medium">Retail Price</th>
                      <th className="text-center py-3 px-4 font-medium">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((plant) => (
                      <tr key={plant.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-2 px-4">
                           <p className="font-medium">{plant.commonName}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{plant.displayName}</p>
                        </td>
                        <td className="py-2 px-4">{plant.containerSize}</td>
                        <td className="py-2 px-4 text-right">${plant.basePrice?.toFixed(2) ?? 'N/A'}</td>
                        <td className="py-2 px-4 text-right font-semibold">${plant.retailPrice?.toFixed(2) ?? 'N/A'}</td>
                        <td className={`py-2 px-4 text-center font-medium ${plant.available === 0 ? 'text-red-600' : plant.available <= 3 ? 'text-amber-600' : ''}`}>
                            {plant.available ?? 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Placeholder Tabs --- */}
        {/* ... (Orders and Settings tabs remain placeholders) ... */}
         <TabsContent value="orders">
           <Card>
             <CardHeader>
               <CardTitle>Order Management</CardTitle>
               <CardDescription>This section will display and manage customer orders once implemented.</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-center py-8 text-gray-500">Order management feature coming soon.</p>
             </CardContent>
           </Card>
         </TabsContent>
        <TabsContent value="settings">
           <Card>
             <CardHeader>
               <CardTitle>Store Settings</CardTitle>
               <CardDescription>This section will allow configuring store settings once implemented.</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-center py-8 text-gray-500">Settings feature coming soon.</p>
             </CardContent>
           </Card>
         </TabsContent>
      </Tabs>
    </div>
  );
}
