"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface ImageUploadProps {
  onFileUpload: (file: File) => void
  maxFiles?: number
  acceptedFileTypes?: string
  maxFileSizeMB?: number
}

export function ImageUpload({
  onFileUpload,
  maxFiles = 3,
  acceptedFileTypes = "image/jpeg, image/png, image/jpg",
  maxFileSizeMB = 5,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type

    const isValidType = acceptedFileTypes.split(",").some((type) => fileType === type.trim())

    if (!isValidType) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes}`)
      return false
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSizeMB) {
      setError(`File size exceeds ${maxFileSizeMB}MB limit`)
      return false
    }

    // Check max files
    if (selectedFiles.length >= maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images`)
      return false
    }

    setError(null)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handleFileSelection(file)
    }
  }

  const handleFileSelection = (file: File) => {
    if (validateFile(file)) {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviews((prev) => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)

      // Update selected files
      setSelectedFiles((prev) => [...prev, file])
      onFileUpload(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      <Input ref={inputRef} type="file" accept={acceptedFileTypes} onChange={handleChange} className="hidden" />

      {selectedFiles.length < maxFiles && (
        <Card
          className={`border-2 border-dashed p-6 text-center mb-4 ${
            dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
          } hover:border-green-500 transition-colors cursor-pointer`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <ImageIcon className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="font-medium">Drag and drop your photos or click to browse</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload photos of your planting area ({selectedFiles.length}/{maxFiles})
              </p>
            </div>
            <Button type="button" variant="outline">
              Select Image
            </Button>
          </div>
        </Card>
      )}

      {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}

      {previews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative rounded-md overflow-hidden h-40">
              <Image
                src={preview || "/placeholder.svg"}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

