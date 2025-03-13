"use client"

import type React from "react"

import { UploadCloud, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"

interface FileUploadProps {
  endpoint: string
  value: string
  onChange: (url: string) => void
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)
      setError(null)

      try {
        const file = acceptedFiles[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        // In a real implementation, you would upload to your actual endpoint
        // const response = await fetch(`/api/upload/${endpoint}`, {
        //   method: "POST",
        //   body: formData,
        // });

        // if (!response.ok) {
        //   throw new Error("Failed to upload file");
        // }

        // const data = await response.json();
        // onChange(data.url);

        // For demo purposes, we'll simulate a successful upload with a timeout
        // and use a placeholder URL
        setTimeout(() => {
          const placeholderUrl = `/placeholder.svg?height=300&width=300&text=${file.name}`
          onChange(placeholderUrl)
          setIsUploading(false)
        }, 1500)
      } catch (error) {
        console.error(error)
        setError("Something went wrong while uploading the file.")
        setIsUploading(false)
      }
    },
    [endpoint, onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg"],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onChange("")
    },
    [onChange],
  )

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full h-60 rounded-lg overflow-hidden border-2 border-dashed border-primary/20">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            w-full 
            p-6 
            border-2 
            border-dashed 
            rounded-lg 
            transition 
            flex 
            flex-col 
            items-center 
            justify-center 
            gap-2
            cursor-pointer
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
            ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"}
          `}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`h-10 w-10 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm text-center text-muted-foreground font-medium">
            {isDragActive ? (
              "Drop the file here"
            ) : isUploading ? (
              "Uploading..."
            ) : (
              <>
                Drag & drop an image here, or <span className="text-primary">click to select</span>
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground text-center">PNG, JPG, GIF up to 10MB</p>
          {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
        </div>
      )}
    </div>
  )
}

