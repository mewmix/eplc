"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  acceptedFileTypes?: string
  maxFileSizeMB?: number
}

export function FileUpload({
  onFileUpload,
  acceptedFileTypes = ".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  maxFileSizeMB = 10,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    const isValidType = acceptedFileTypes.split(",").some((type) => {
      const trimmedType = type.trim()
      return fileType === trimmedType || (trimmedType.startsWith(".") && `.${fileExtension}` === trimmedType)
    })

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

    setError(null)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        onFileUpload(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        onFileUpload(file)
      }
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="w-full">
      <Input ref={inputRef} type="file" accept={acceptedFileTypes} onChange={handleChange} className="hidden" />

      {!selectedFile ? (
        <Card
          className={`border-2 border-dashed p-6 text-center ${
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
              <Upload className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="font-medium">Drag and drop your inventory file or click to browse</p>
              <p className="text-sm text-gray-500 mt-1">Supports CSV and Excel files up to {maxFileSizeMB}MB</p>
            </div>
            <Button type="button" variant="outline">
              Select File
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-green-100 p-2">
                <FileText className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

