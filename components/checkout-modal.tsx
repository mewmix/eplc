"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Truck, Shovel, Package, Mail, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { plantsData, baseCosts } from "@/data/plants"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { Droplet, Sprout, CloudRain } from "lucide-react"
import { SuccessView } from "@/components/success-view"

interface CheckoutModalProps {
  cart: { id: string; quantity: number }[]
  onClose: () => void
  onCheckoutComplete: () => void
}

type DeliveryZone = "local" | "regional" | "extended"
type DeliverySize = "small" | "medium" | "large"
type ContactPreference = "email" | "phone" | "text"
type OrderStatus = "form" | "submitting" | "success"

export function CheckoutModal({ cart, onClose, onCheckoutComplete }: CheckoutModalProps) {
  const [soilBags, setSoilBags] = useState(0)
  const [includePlanting, setIncludePlanting] = useState(false)
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("local")
  const [deliverySize, setDeliverySize] = useState<DeliverySize>("small")
  const [contactPreference, setContactPreference] = useState<ContactPreference>("email")
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("form")
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  })

  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [needsIrrigation, setNeedsIrrigation] = useState<boolean | null>(null)
  const [irrigationType, setIrrigationType] = useState<string>("none")
  const [needsFertilizer, setNeedsFertilizer] = useState<boolean | null>(null)
  const [projectTimeline, setProjectTimeline] = useState<string>("flexible")

  // Calculate subtotal for plants only
  const plantSubtotal = cart.reduce((total, item) => {
    const plant = plantsData.find((p) => p.id === item.id)
    return total + (plant ? plant.retailPrice * item.quantity : 0)
  }, 0)

  // Calculate premium soil cost
  const soilCost = soilBags * 20

  // Calculate planting service cost (1.5x the plant price)
  const plantingCost = includePlanting ? plantSubtotal * 1.5 : 0

  // Calculate delivery cost based on zone and size
  const getDeliveryCost = () => {
    return baseCosts[deliveryZone][deliverySize]
  }

  const deliveryCost = getDeliveryCost()

  // Calculate total
  const total = plantSubtotal + soilCost + plantingCost + deliveryCost

  // Determine delivery size based on cart contents
  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    if (totalItems <= 3) {
      setDeliverySize("small")
    } else if (totalItems <= 10) {
      setDeliverySize("medium")
    } else {
      setDeliverySize("large")
    }
  }, [cart])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderStatus("submitting")

    // Simulate sending an email with order details
    setTimeout(() => {
      setOrderStatus("success")
      // In a real application, you would send the order details to your server here
    }, 1500)
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Render different content based on order status
  const renderContent = () => {
    switch (orderStatus) {
      case "submitting":
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 w-48 bg-gray-100 rounded"></div>
            </div>
            <p className="mt-6 text-center text-gray-600">Submitting your order request...</p>
          </div>
        )

      case "success":
        return <SuccessView onClose={onCheckoutComplete} contactPreference={contactPreference} />

      default:
        return (
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cart Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Plants</h3>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    const plant = plantsData.find((p) => p.id === item.id)
                    if (!plant) return null
                    return (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{plant.commonName}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × ${plant.retailPrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">${(plant.retailPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    )
                  })}
                </div>

                <Separator className="my-6" />

                {/* Premium Soil Option */}
                <div className="mb-6">
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

                {/* Planting Service */}
                <div className="mb-6">
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

                {/* Delivery Options */}
                <div className="mb-6">
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
                    Delivery size: {deliverySize.charAt(0).toUpperCase() + deliverySize.slice(1)}(
                    {deliverySize === "small" ? "1-3 items" : deliverySize === "medium" ? "4-10 items" : "11+ items"})
                  </p>
                </div>

                {/* Order Summary */}
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

              {/* Contact Information */}
              <div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        This is an order request. We'll verify inventory and contact you to arrange payment and
                        delivery.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                <div className="space-y-6 mb-6">
                  {/* Basic Contact Info */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={contactInfo.name} onChange={handleInputChange} required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Delivery Address</h4>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={contactInfo.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={contactInfo.city} onChange={handleInputChange} required />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={contactInfo.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="zip">ZIP</Label>
                          <Input id="zip" name="zip" value={contactInfo.zip} onChange={handleInputChange} required />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Irrigation Needs */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <CloudRain className="h-4 w-4 mr-2 text-green-700" />
                      Irrigation Needs
                    </h4>

                    <div className="grid gap-3">
                      <Label className="text-sm text-gray-600">Do you need irrigation installed?</Label>
                      <RadioGroup
                        value={needsIrrigation === null ? "" : needsIrrigation.toString()}
                        onValueChange={(val) => setNeedsIrrigation(val === "true")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="irrigation-yes" />
                          <Label htmlFor="irrigation-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="irrigation-no" />
                          <Label htmlFor="irrigation-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="irrigation-unsure" />
                          <Label htmlFor="irrigation-unsure">Not sure</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {needsIrrigation && (
                      <div className="grid gap-2">
                        <Label htmlFor="irrigation-type">Irrigation Type</Label>
                        <Select value={irrigationType} onValueChange={setIrrigationType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select irrigation type" />
                          </SelectTrigger>
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

                  {/* Fertilizer Needs */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <Sprout className="h-4 w-4 mr-2 text-green-700" />
                      Fertilizer & Amendments
                    </h4>

                    <div className="grid gap-3">
                      <Label className="text-sm text-gray-600">Would you like us to provide fertilizer?</Label>
                      <RadioGroup
                        value={needsFertilizer === null ? "" : needsFertilizer.toString()}
                        onValueChange={(val) => setNeedsFertilizer(val === "true")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="fertilizer-yes" />
                          <Label htmlFor="fertilizer-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="fertilizer-no" />
                          <Label htmlFor="fertilizer-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="fertilizer-unsure" />
                          <Label htmlFor="fertilizer-unsure">Not sure</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Project Timeline */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Project Timeline</h4>
                    <div className="grid gap-2">
                      <Label>When would you like to complete this project?</Label>
                      <Select value={projectTimeline} onValueChange={setProjectTimeline}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">As soon as possible</SelectItem>
                          <SelectItem value="month">Within a month</SelectItem>
                          <SelectItem value="season">This growing season</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <Droplet className="h-4 w-4 mr-2 text-green-700" />
                      Upload Photos of Your Planting Area
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Photos help us better understand your space and provide more accurate recommendations.
                    </p>
                    <ImageUpload onFileUpload={(file) => setUploadedImages((prev) => [...prev, file])} maxFiles={3} />
                  </div>

                  {/* Special Instructions */}
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Special Instructions or Questions</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={contactInfo.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific planting instructions, delivery notes, or questions about your order..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Preferred Contact Method</Label>
                    <RadioGroup
                      defaultValue="email"
                      value={contactPreference}
                      onValueChange={(value) => setContactPreference(value as ContactPreference)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email-contact" />
                        <Label htmlFor="email-contact" className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone-contact" />
                        <Label htmlFor="phone-contact" className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>Phone</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="text-contact" />
                        <Label htmlFor="text-contact" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>Text</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6 bg-green-700 hover:bg-green-800">
                  Submit Order Request
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By submitting this request, you agree to be contacted regarding your plant order.
                </p>
              </div>
            </div>
          </form>
        )
    }
  }

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
  )
}

