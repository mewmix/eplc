"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface SuccessViewProps {
  onClose: () => void
  contactPreference: string
}

export function SuccessView({ onClose, contactPreference }: SuccessViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="bg-green-100 rounded-full p-3 mb-4">
        <CheckCircle className="h-12 w-12 text-green-700" />
      </div>

      <h3 className="text-xl font-bold mb-2">Order Request Received!</h3>

      <p className="text-center text-gray-600 mb-6 max-w-md">
        Thank you for your interest in our plants! We've received your order request and will verify inventory
        availability.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 w-full max-w-md mb-6">
        <h4 className="font-semibold mb-2">What happens next?</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Our team will review your order and check inventory</li>
          <li>We'll contact you via your preferred method ({contactPreference}) within 1-2 business days</li>
          <li>Once confirmed, we'll provide payment options and schedule delivery</li>
        </ol>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Order reference: EPC-
        {Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}
      </p>

      <Button onClick={onClose} className="bg-green-700 hover:bg-green-800">
        Close
      </Button>
    </div>
  )
}

