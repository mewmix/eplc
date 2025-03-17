"use client"

import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getPlantImageUrl } from "@/lib/image-utils"

export function CartSidebar({ isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="bg-white w-full max-w-md flex flex-col h-full shadow-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <Button variant="outline" className="mt-4" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="border-b pb-4">
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={getPlantImageUrl(item) || "/placeholder.svg"}
                          alt={item.commonName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.commonName}</h3>
                            <p className="text-sm text-gray-500">{item.containerSize}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
                            <X size={16} />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus size={14} />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus size={14} />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                          <p className="font-medium">${(item.retailPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex justify-between py-2">
                <p className="font-medium">Subtotal</p>
                <p className="font-medium">${totalPrice.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Shipping and taxes will be calculated after we review your order.
              </p>
              <Button className="w-full bg-green-700 hover:bg-green-800" onClick={onCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

