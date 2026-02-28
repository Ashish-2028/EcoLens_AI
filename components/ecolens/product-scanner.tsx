"use client"

import { useState, useCallback } from "react"
import { Upload, Camera, ScanLine, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProductScannerProps {
  onScan: (file: File) => void
  isScanning: boolean
}

export function ProductScanner({ onScan, isScanning }: ProductScannerProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
      onScan(file)
    },
    [onScan]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const clearPreview = () => {
    setPreview(null)
    setFileName(null)
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScanLine className="size-5 text-primary" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Product Scanner
          </h2>
        </div>
        {preview && (
          <button
            onClick={clearPreview}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear scan"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img
            src={preview}
            alt={fileName || "Scanned product"}
            className="w-full h-48 object-cover"
            crossOrigin="anonymous"
          />
          {isScanning && (
            <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="size-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
              <p className="text-xs font-medium text-primary tracking-wide">
                Analyzing product...
              </p>
            </div>
          )}
          {!isScanning && fileName && (
            <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm px-3 py-2">
              <p className="text-xs text-muted-foreground truncate">{fileName}</p>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all duration-300 cursor-pointer",
            isDragOver
              ? "border-primary bg-primary/5 emerald-glow"
              : "border-border/60 hover:border-primary/40 hover:bg-secondary/30"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center size-14 rounded-2xl transition-all duration-300",
              isDragOver ? "bg-primary/15 scale-110" : "bg-secondary"
            )}
          >
            {isDragOver ? (
              <ImageIcon className="size-6 text-primary" />
            ) : (
              <Upload className="size-6 text-muted-foreground" />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isDragOver ? "Drop your image here" : "Drag & drop a product image"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 10MB
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileInput}
              />
              <Button
                variant="outline"
                size="sm"
                className="border-border/60 text-muted-foreground cursor-pointer"
                asChild
              >
                <label htmlFor="file-upload">
                  <Upload className="size-3.5 mr-1.5" />
                  Browse
                </label>
              </Button>
            </div>
            <div>
              <input
                id="camera-upload"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={handleFileInput}
              />
              <Button
                variant="outline"
                size="sm"
                className="border-border/60 text-muted-foreground cursor-pointer"
                asChild
              >
                <label htmlFor="camera-upload">
                  <Camera className="size-3.5 mr-1.5" />
                  Camera
                </label>
              </Button>
            </div>
          </div>

          {/* Pulse decoration */}
          <div className="absolute inset-0 rounded-xl scanner-pulse pointer-events-none">
            <div className="absolute inset-0 rounded-xl border border-primary/10" />
          </div>
        </div>
      )}
    </div>
  )
}
