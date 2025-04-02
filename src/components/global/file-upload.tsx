"use client"

import { UploadCloud, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useUploadThing } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { OurFileRouter } from "@/lib/our-file-router"

interface FileUploadProps {
  endpoint: keyof OurFileRouter
  value: string | null
  onChange: (url: string) => void
  className?: string
  disabled?: boolean
}

export const FileUpload = ({
  endpoint,
  value,
  onChange,
  className,
  disabled = false
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { startUpload } = useUploadThing(endpoint)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)
      setUploadProgress(0)

      try {
        const file = acceptedFiles[0]
        if (!file) return

        const res = await startUpload([file])

        if (!res?.[0]?.url) {
          throw new Error("Upload failed - no URL returned")
        }

        onChange(res[0].url)
        toast.success("Upload completed")
      } catch (error) {
        console.error(error)
        toast.error("Upload failed", {
          description: error instanceof Error ? error.message : "Please try again"
        })
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [startUpload, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
    disabled: isUploading || disabled,
  })

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onChange("")
    },
    [onChange]
  )

  return (
    <div className={cn("w-full space-y-2", className)}>
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-muted">
          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
            <Image 
              src={value} 
              alt="Uploaded content" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            />
          </div>
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8 rounded-full"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "group relative w-full p-6 border-2 border-dashed rounded-lg transition-all",
            "flex flex-col items-center justify-center gap-2 cursor-pointer",
            "hover:border-primary hover:bg-primary/5",
            isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
            (isUploading || disabled) && "opacity-60 cursor-not-allowed",
            className
          )}
        >
          <input {...getInputProps()} />
          <div className="relative h-16 w-16">
            <UploadCloud className={cn(
              "h-10 w-10 absolute inset-0 m-auto transition-all",
              isDragActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary",
              isUploading && "animate-pulse"
            )} />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {isDragActive ? (
                "Drop the file here"
              ) : isUploading ? (
                "Uploading..."
              ) : (
                <>
                  Drag & drop or <span className="text-primary">click to browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {isUploading ? (
                `${Math.round(uploadProgress)}%`
              ) : (
                "PNG, JPG, WEBP up to 4MB"
              )}
            </p>
          </div>

          {isUploading && (
            <Progress 
              value={uploadProgress} 
              className="h-2 w-full mt-2" 
            />
          )}
        </div>
      )}
    </div>
  )
}