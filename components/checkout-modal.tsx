// components/checkout-modal.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
// --- Icons ---
import { X, Truck, Shovel, Package, Mail, Phone, MessageSquare, CloudRain, Sprout, Droplet, CheckCircle } from "lucide-react" // Added CheckCircle
// --- UI Components ---
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// --- Custom Components ---
import { ImageUpload } from "@/components/image-upload" // Assuming this exists and is needed
import { SuccessView } from "@/components/success-view"
// --- Data (Only for base costs) ---
import { baseCosts } from "@/data/plants" // Keep for delivery costs

// --- Define Plant/CartItem Type (Ensure this matches plant-catalog.tsx) ---
// It's best practice to define this in a shared types file, but defining here for clarity
type Plant = {
  id: string;
  displayName: string;
  commonName: string;
  botanicalName?: string;
  containerSize: string;
  basePrice: number;
  retailPrice: number; // IMPORTANT: Ensure this is calculated in plant-catalog *before* adding to cart
  available: number;
  image?: string;
};

type CartItem = Plant & {
  quantity: number; // Quantity should be part of the item passed in props now
};

// --- Props Interface (Expects the FULL CartItem array) ---
interface CheckoutModalProps {
  // cart: { id: string; quantity: number }[]; // <-- OLD WRONG TYPE
  cart: CartItem[]; // <-- CORRECT TYPE: Expects full details + quantity
  onClose: () => void;
  onCheckoutComplete: () => void;
}

type DeliveryZone = "local" | "regional" | "extended";
type DeliverySize = "small" | "medium" | "large";
type ContactPreference = "email" | "phone" | "text";
type OrderStatus = "form" | "submitting" | "success" | "error"; // Added error state

export function CheckoutModal({ cart, onClose, onCheckoutComplete }: CheckoutModalProps) {
  // State remains mostly the same, but NO detailedCart or isDataLoading needed
  const [soilBags, setSoilBags] = useState(0);
  const [includePlanting, setIncludePlanting] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("local");
  const [deliverySize, setDeliverySize] = useState<DeliverySize>("small");
  const [contactPreference, setContactPreference] = useState<ContactPreference>("email");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("form");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });
  // Additional state fields
  const [uploadedImages, setUploadedImages] = useState<File[]>([]); // Keep if ImageUpload is used
  const [needsIrrigation, setNeedsIrrigation] = useState<boolean | null>(null);
  const [irrigationType, setIrrigationType] = useState<string>("none");
  const [needsFertilizer, setNeedsFertilizer] = useState<boolean | null>(null);
  const [projectTimeline, setProjectTimeline] = useState<string>("flexible");

  // --- Calculate Costs (Use cart prop directly) ---
  const plantSubtotal = cart.reduce((total, item) => {
    // item.retailPrice should already be calculated by plant-catalog
    return total + (item.retailPrice * item.quantity);
  }, 0);
  const soilCost = soilBags * 20; // Assuming $20 per bag
  const plantingCost = includePlanting ? plantSubtotal * 1.5 : 0; // Example: 150% of plant cost

  // --- Delivery Cost Calculation ---
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => {
    if (totalItems <= 3) setDeliverySize("small");
    else if (totalItems <= 10) setDeliverySize("medium");
    else setDeliverySize("large");
  }, [totalItems]); // Recalculate size when cart changes

  const getDeliveryCost = () => {
    if (!deliveryZone || !deliverySize || !baseCosts[deliveryZone]?.[deliverySize]) {
      return 0;
    }
    return baseCosts[deliveryZone][deliverySize];
  };
  const deliveryCost = getDeliveryCost();

  const total = plantSubtotal + soilCost + plantingCost + deliveryCost;

  // --- Event Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  // --- Form Submission (Simplified) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus("submitting");

    // Construct orderData using the cart prop directly
    const orderData = {
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.state} ${contactInfo.zip}`,
      notes: contactInfo.notes,
      // Use the cart prop directly - it now has all the details
      cart: cart.map(item => ({
        name: item.commonName, // Directly from prop
        quantity: item.quantity, // Directly from prop
        price: item.retailPrice, // Directly from prop
      })),
      soilBags,
      includePlanting,
      deliveryZone,
      deliverySize,
      contactPreference,
      needsIrrigation: needsIrrigation === null ? "unsure" : needsIrrigation,
      irrigationType,
      needsFertilizer: needsFertilizer === null ? "unsure" : needsFertilizer,
      projectTimeline,
      // Send calculated costs
      plantSubtotal: plantSubtotal.toFixed(2),
      soilCost: soilCost.toFixed(2),
      plantingCost: plantingCost.toFixed(2),
      deliveryCost: deliveryCost.toFixed(2),
      total: total.toFixed(2),
    };

    console.log("Submitting Order Data:", JSON.stringify(orderData, null, 2)); // Keep for debugging

    try {
      const response = await fetch("/api/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderStatus("success");
        // We call onCheckoutComplete from the SuccessView now
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Submission failed:", response.status, response.statusText, errorData);
        setOrderStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setOrderStatus("error");
    }
  };

  // --- Render Logic (Uses cart prop) ---
  const renderContent = () => {
    switch (orderStatus) {
      case "submitting":
        return (
            <div className="flex flex-col items-center justify-center py-12">
                {/* Using simple text for loading state */}
                <p className="mt-6 text-center text-gray-600">Submitting your order request...</p>
            </div>
        );
      case "success":
        // Pass onCheckoutComplete to the SuccessView so it can trigger cart clearing etc.
        return <SuccessView onClose={onCheckoutComplete} contactPreference={contactPreference} />;
      case "error":
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                 <X className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-red-700">Submission Failed</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                    There was an error submitting your order request. Please try again later or contact us directly.
                </p>
                <Button onClick={() => setOrderStatus("form")} variant="outline">Try Again</Button>
                 <Button onClick={onClose} variant="secondary" className="ml-2">Close</Button>
            </div>
        );
      default: // "form" state
        return (
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Order Summary Section - uses 'cart' prop */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Your Plants</h3>
                    {cart.length > 0 ? (
                         <div className="space-y-4 mb-6">
                          {cart.map((item) => ( // Use cart prop directly
                            <div key={item.id} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{item.commonName}</p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} × ${item.retailPrice.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-semibold">${(item.retailPrice * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                    ) : (
                         <p className="text-gray-500">No plants in cart.</p>
                    )}

                    <Separator className="my-6" />
                      {/* Soil Section */}
                      <div className="mb-6">
                           {/* ... soil input ... */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                 <Package className="h-5 w-5 text-green-700" />
                                 <h3 className="font-semibold">Premium Soil</h3>
                               </div>
                               <p className="text-sm font-medium">$20.00 per bag</p>
                             </div>
                             <p className="text-sm text-gray-600 mb-3">
                               Our premium organic soil blend is perfect for fruit trees and edible plants.
                             </p>
                             <div className="flex items-center gap-2">
                               <Label htmlFor="soil-bags">Number of bags:</Label>
                               <Select value={soilBags.toString()} onValueChange={(value) => setSoilBags(Number.parseInt(value))}>
                                 <SelectTrigger className="w-20">
                                   <SelectValue placeholder="0" />
                                 </SelectTrigger>
                                 <SelectContent>
                                   {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                     <SelectItem key={num} value={num.toString()}>
                                       {num}
                                     </SelectItem>
                                   ))}
                                 </SelectContent>
                               </Select>
                             </div>
                      </div>
                      {/* Planting Service Section */}
                     <div className="mb-6">
                           {/* ... planting checkbox ... */}
                           <div className="flex items-center gap-3 mb-2">
                             <Checkbox
                               id="planting-service"
                               checked={includePlanting}
                               onCheckedChange={(checked) => setIncludePlanting(checked === true)}
                             />
                             <div className="flex items-center gap-2">
                               <Shovel className="h-5 w-5 text-green-700" />
                               <Label htmlFor="planting-service" className="font-semibold">
                                 Professional Planting Service
                               </Label>
                             </div>
                           </div>
                           <div className="pl-9">
                             <p className="text-sm text-gray-600 mb-2">Our expert team will plant your selections with care.</p>
                             <p className="text-sm font-medium">Price: 1.5× plant cost (${plantingCost.toFixed(2)})</p>
                           </div>
                     </div>
                     {/* Delivery Options Section */}
                      <div className="mb-6">
                          {/* ... delivery radio group ... */}
                           <div className="flex items-center gap-2 mb-3">
                                 <Truck className="h-5 w-5 text-green-700" />
                                 <h3 className="font-semibold">Delivery Options</h3>
                             </div>
                             <RadioGroup
                               defaultValue="local"
                               value={deliveryZone}
                               onValueChange={(value) => setDeliveryZone(value as DeliveryZone)}
                               className="space-y-3"
                             >
                               {/* Radio Items */}
                               <div className="flex items-center space-x-3">
                                   <RadioGroupItem value="local" id="local" />
                                   <Label htmlFor="local" className="flex justify-between w-full">
                                     <span>Local (within 10 miles)</span>
                                     <span className="font-medium">
                                       ${baseCosts["local"].small}-${baseCosts["local"].large}
                                     </span>
                                   </Label>
                                 </div>
                                  <div className="flex items-center space-x-3">
                                   <RadioGroupItem value="regional" id="regional" />
                                   <Label htmlFor="regional" className="flex justify-between w-full">
                                     <span>Regional (10-25 miles)</span>
                                     <span className="font-medium">
                                       ${baseCosts["regional"].small}-${baseCosts["regional"].large}
                                     </span>
                                   </Label>
                                 </div>
                                 <div className="flex items-center space-x-3">
                                   <RadioGroupItem value="extended" id="extended" />
                                   <Label htmlFor="extended" className="flex justify-between w-full">
                                     <span>Extended (25-50 miles)</span>
                                     <span className="font-medium">
                                       ${baseCosts["extended"].small}-${baseCosts["extended"].large}
                                     </span>
                                   </Label>
                                 </div>
                             </RadioGroup>
                             <p className="text-sm text-gray-600 mt-2">
                               Delivery size: {deliverySize.charAt(0).toUpperCase() + deliverySize.slice(1)} (
                               {deliverySize === "small" ? "1-3 items" : deliverySize === "medium" ? "4-10 items" : "11+ items"})
                             </p>
                      </div>
                     {/* Order Summary Card */}
                     <div className="rounded-lg bg-gray-50 p-4">
                       <h3 className="font-semibold mb-3">Order Summary</h3>
                         <div className="space-y-2 text-sm">
                           <div className="flex justify-between">
                             <span>Plants Subtotal:</span>
                             <span>${plantSubtotal.toFixed(2)}</span>
                           </div>
                           {soilBags > 0 && (
                             <div className="flex justify-between">
                               <span>Premium Soil ({soilBags} bags):</span>
                               <span>${soilCost.toFixed(2)}</span>
                             </div>
                           )}
                           {includePlanting && (
                             <div className="flex justify-between">
                               <span>Planting Service:</span>
                               <span>${plantingCost.toFixed(2)}</span>
                             </div>
                           )}
                           <div className="flex justify-between">
                             <span>
                               Delivery ({deliveryZone}, {deliverySize}):
                             </span>
                             <span>${deliveryCost.toFixed(2)}</span>
                           </div>
                           <Separator className="my-2" />
                           <div className="flex justify-between font-semibold text-base">
                             <span>Estimated Total:</span>
                             <span>${total.toFixed(2)}</span>
                           </div>
                         </div>
                     </div>

                </div>

               {/* Contact Information and Other Details Column */}
                <div>
                    {/* All the inputs for contact info, address, irrigation, etc. */}
                     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                           {/* Reminder notice */}
                           <div className="flex">
                             <div className="flex-shrink-0">
                               <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                             </div>
                             <div className="ml-3"><p className="text-sm text-yellow-700">This is an order request. We'll verify inventory and contact you to arrange payment and delivery.</p></div>
                           </div>
                     </div>
                     <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                     <div className="space-y-6 mb-6">
                         {/* Name, Email, Phone Inputs */}
                         <div className="space-y-4">
                           <div className="grid gap-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={contactInfo.name} onChange={handleInputChange} required /></div>
                           <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={contactInfo.email} onChange={handleInputChange} required /></div>
                           <div className="grid gap-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" value={contactInfo.phone} onChange={handleInputChange} required /></div>
                         </div>
                         {/* Address Inputs */}
                         <div className="space-y-4">
                            <h4 className="font-medium text-gray-700">Delivery Address</h4>
                            <div className="grid gap-2"><Label htmlFor="address">Street Address</Label><Input id="address" name="address" value={contactInfo.address} onChange={handleInputChange} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2"><Label htmlFor="city">City</Label><Input id="city" name="city" value={contactInfo.city} onChange={handleInputChange} required /></div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2"><Label htmlFor="state">State</Label><Input id="state" name="state" value={contactInfo.state} onChange={handleInputChange} required /></div>
                                <div className="grid gap-2"><Label htmlFor="zip">ZIP</Label><Input id="zip" name="zip" value={contactInfo.zip} onChange={handleInputChange} required /></div>
                              </div>
                            </div>
                         </div>
                          {/* Irrigation Section */}
                          <div className="space-y-4">
                             <h4 className="font-medium text-gray-700 flex items-center"><CloudRain className="h-4 w-4 mr-2 text-green-700" />Irrigation Needs</h4>
                             <div className="grid gap-3">
                                <Label className="text-sm text-gray-600">Do you need irrigation installed?</Label>
                                 <RadioGroup value={needsIrrigation === null ? "" : needsIrrigation.toString()} onValueChange={(val) => setNeedsIrrigation(val === "true")} className="flex space-x-4">
                                     {/* Radio items */}
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="true" id="irrigation-yes" /><Label htmlFor="irrigation-yes">Yes</Label></div>
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="false" id="irrigation-no" /><Label htmlFor="irrigation-no">No</Label></div>
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="" id="irrigation-unsure" /><Label htmlFor="irrigation-unsure">Not sure</Label></div>
                                 </RadioGroup>
                             </div>
                             {needsIrrigation && ( /* Irrigation Type Select */
                                <div className="grid gap-2">
                                  <Label htmlFor="irrigation-type">Irrigation Type</Label>
                                  <Select value={irrigationType} onValueChange={setIrrigationType}>
                                    <SelectTrigger><SelectValue placeholder="Select irrigation type" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="drip">Drip irrigation</SelectItem>
                                      <SelectItem value="sprinkler">Sprinkler system</SelectItem>
                                      <SelectItem value="soaker">Soaker hose</SelectItem>
                                      <SelectItem value="unsure">Not sure</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                             )}
                         </div>
                          {/* Fertilizer Section */}
                          <div className="space-y-4">
                             <h4 className="font-medium text-gray-700 flex items-center"><Sprout className="h-4 w-4 mr-2 text-green-700" />Fertilizer & Amendments</h4>
                             <div className="grid gap-3">
                                <Label className="text-sm text-gray-600">Would you like us to provide fertilizer?</Label>
                                 <RadioGroup value={needsFertilizer === null ? "" : needsFertilizer.toString()} onValueChange={(val) => setNeedsFertilizer(val === "true")} className="flex space-x-4">
                                     {/* Radio items */}
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="true" id="fertilizer-yes" /><Label htmlFor="fertilizer-yes">Yes</Label></div>
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="false" id="fertilizer-no" /><Label htmlFor="fertilizer-no">No</Label></div>
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="" id="fertilizer-unsure" /><Label htmlFor="fertilizer-unsure">Not sure</Label></div>
                                 </RadioGroup>
                             </div>
                         </div>
                         {/* Timeline Section */}
                         <div className="space-y-4">
                             <h4 className="font-medium text-gray-700">Project Timeline</h4>
                             <div className="grid gap-2">
                                <Label>When would you like to complete this project?</Label>
                                 <Select value={projectTimeline} onValueChange={setProjectTimeline}>
                                    <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="urgent">As soon as possible</SelectItem>
                                      <SelectItem value="month">Within a month</SelectItem>
                                      <SelectItem value="season">This growing season</SelectItem>
                                      <SelectItem value="flexible">Flexible</SelectItem>
                                    </SelectContent>
                                 </Select>
                             </div>
                         </div>
                         {/* Notes Textarea */}
                         <div className="grid gap-2">
                            <Label htmlFor="notes">Special Instructions or Questions</Label>
                            <Textarea id="notes" name="notes" value={contactInfo.notes} onChange={handleInputChange} placeholder="Any specific planting instructions, delivery notes, or questions..." className="min-h-[100px]" />
                         </div>
                         {/* Contact Preference Radios */}
                         <div className="grid gap-2">
                             <Label>Preferred Contact Method</Label>
                             <RadioGroup defaultValue="email" value={contactPreference} onValueChange={(value) => setContactPreference(value as ContactPreference)} className="flex space-x-4">
                                 {/* Radio items */}
                                <div className="flex items-center space-x-2"><RadioGroupItem value="email" id="email-contact" /><Label htmlFor="email-contact" className="flex items-center gap-1"><Mail className="h-4 w-4" /><span>Email</span></Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="phone" id="phone-contact" /><Label htmlFor="phone-contact" className="flex items-center gap-1"><Phone className="h-4 w-4" /><span>Phone</span></Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="text" id="text-contact" /><Label htmlFor="text-contact" className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /><span>Text</span></Label></div>
                             </RadioGroup>
                         </div>
                     </div>
                     {/* Submit Button and Disclaimer */}
                     <Button type="submit" className="w-full mt-6 bg-green-700 hover:bg-green-800" disabled={orderStatus === 'submitting'}>
                         {orderStatus === 'submitting' ? 'Submitting...' : 'Submit Order Request'}
                     </Button>
                     <p className="text-xs text-gray-500 mt-4 text-center">By submitting this request, you agree to be contacted regarding your plant order.</p>
                </div>
            </div>
          </form>
        );
    }
  };

  // --- Main Modal Return ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          {orderStatus === "form" && (
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
          <CardTitle>{orderStatus === "success" ? "Order Request Submitted" : "Complete Your Order Request"}</CardTitle>
          {orderStatus === "form" && (
            <CardDescription>
              Submit your order request and we'll verify inventory before contacting you.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
