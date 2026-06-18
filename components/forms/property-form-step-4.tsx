"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle, Loader2, FileImage, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedImage {
  url: string
  name: string
  thumbnailUrl?: string
  size?: number
}

export default function PropertyFormStep4({ formData, onChange }: any) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  // FAQs management
  const faqs = formData.faqs || []

  const addFaq = () => {
    const newFaq = { question: "", answer: "" }
    onChange("faqs", [...faqs, newFaq])
  }

  const updateFaq = (index: number, field: string, value: string) => {
    const updated = [...faqs]
    updated[index] = { ...updated[index], [field]: value }
    onChange("faqs", updated)
  }

  const removeFaq = (index: number) => {
    const updated = faqs.filter((_: any, i: number) => i !== index)
    onChange("faqs", updated)
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    isMultiple = false
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading((prev) => ({ ...prev, [fieldName]: true }))
    setUploadErrors((prev) => ({ ...prev, [fieldName]: "" }))

    try {
      const uploadedImages: UploadedImage[] = []
      const totalFiles = files.length

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Update progress
        setUploadProgress((prev) => ({
          ...prev,
          [fieldName]: Math.round(((i + 0.5) / totalFiles) * 100),
        }))

        // Create FormData for upload
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)
        uploadFormData.append("folder", "properties")

        // Upload to our API route which handles ImageKit
        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Upload failed")
        }

        const data = await response.json()
        
        uploadedImages.push({
          url: data.url,
          name: data.name || file.name,
          thumbnailUrl: data.thumbnailUrl,
          size: data.size || file.size,
        })

        // Update progress
        setUploadProgress((prev) => ({
          ...prev,
          [fieldName]: Math.round(((i + 1) / totalFiles) * 100),
        }))
      }

      // Update form data
      if (isMultiple) {
        // Ensure existingUrls is always an array
        let rawExisting = formData[fieldName]
        let existingUrls: string[] = []
        if (Array.isArray(rawExisting)) {
          existingUrls = rawExisting
        } else if (typeof rawExisting === 'string' && rawExisting.startsWith('[')) {
          try {
            existingUrls = JSON.parse(rawExisting)
          } catch (e) {
            existingUrls = []
          }
        } else if (typeof rawExisting === 'string' && rawExisting.length > 0) {
          existingUrls = [rawExisting]
        }
        
        const newUrls = uploadedImages.map((img) => img.url)
        onChange(fieldName, [...existingUrls, ...newUrls])
        
        // Store image metadata for display
        const existingMeta = formData[`${fieldName}_meta`] || []
        onChange(`${fieldName}_meta`, [...existingMeta, ...uploadedImages])
      } else {
        onChange(fieldName, uploadedImages[0]?.url || "")
        onChange(`${fieldName}_meta`, uploadedImages[0] || null)
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadErrors((prev) => ({
        ...prev,
        [fieldName]: error instanceof Error ? error.message : "Upload failed",
      }))
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }))
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }))
      // Reset the input
      e.target.value = ""
    }
  }

  const removeImage = (fieldName: string, index?: number) => {
    if (index !== undefined) {
      // Ensure we're working with an array
      let rawUrls = formData[fieldName]
      let urls: string[] = []
      if (Array.isArray(rawUrls)) {
        urls = [...rawUrls]
      } else if (typeof rawUrls === 'string' && rawUrls.startsWith('[')) {
        try {
          urls = JSON.parse(rawUrls)
        } catch (e) {
          urls = []
        }
      }
      
      urls.splice(index, 1)
      onChange(fieldName, urls)
      
      // Also remove metadata
      const updatedMeta = [...(formData[`${fieldName}_meta`] || [])]
      updatedMeta.splice(index, 1)
      onChange(`${fieldName}_meta`, updatedMeta)
    } else {
      onChange(fieldName, "")
      onChange(`${fieldName}_meta`, null)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getImageMeta = (fieldName: string, index?: number): UploadedImage | null => {
    if (index !== undefined) {
      return formData[`${fieldName}_meta`]?.[index] || null
    }
    return formData[`${fieldName}_meta`] || null
  }

  // Single image upload component
  const SingleImageUpload = ({
    fieldName,
    title,
    description,
    height = "h-48",
  }: {
    fieldName: string
    title: string
    description: string
    height?: string
  }) => {
    const imageUrl = formData[fieldName]
    const imageMeta = getImageMeta(fieldName)
    const isUploading = uploading[fieldName]
    const error = uploadErrors[fieldName]

    return (
      <div className="border border-border rounded-xl p-4 space-y-3 bg-card">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {imageUrl && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              Uploaded
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {imageUrl ? (
          <div className="relative group">
            <div className={cn("relative overflow-hidden rounded-lg bg-muted", height)}>
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  console.error(`[v0] Failed to load image for ${fieldName}:`, imageUrl)
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <button
                type="button"
                onClick={() => removeImage(fieldName)}
                className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {imageMeta && (
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <FileImage className="h-3.5 w-3.5" />
                <span className="truncate max-w-[200px]">{imageMeta.name}</span>
                {imageMeta.size && (
                  <span className="text-muted-foreground/60">({formatFileSize(imageMeta.size)})</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <label
            className={cn(
              "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
              isUploading
                ? "border-primary/50 bg-primary/5"
                : "border-border hover:border-primary hover:bg-muted/50",
              height
            )}
          >
            <div className="flex flex-col items-center justify-center py-4">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                  <p className="text-sm text-primary font-medium">Uploading...</p>
                  {uploadProgress[fieldName] > 0 && (
                    <div className="w-32 h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[fieldName]}%` }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 10MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, fieldName)}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>
    )
  }

  // Multiple image upload component
  const MultipleImageUpload = ({
    fieldName,
    title,
    description,
    gridCols = "grid-cols-2 md:grid-cols-4",
  }: {
    fieldName: string
    title: string
    description: string
    gridCols?: string
  }) => {
    // Ensure images is always an array (handle case where it might be stored as string)
    let rawImages = formData[fieldName]
    let images: string[] = []
    if (Array.isArray(rawImages)) {
      images = rawImages
    } else if (typeof rawImages === 'string' && rawImages.startsWith('[')) {
      // Handle case where images might be stored as JSON string
      try {
        images = JSON.parse(rawImages)
      } catch (e) {
        console.error(`[v0] Failed to parse ${fieldName} as JSON:`, e)
        images = []
      }
    } else if (typeof rawImages === 'string' && rawImages.length > 0) {
      // Single URL stored as string - convert to array
      images = [rawImages]
    }
    
    const imagesMeta = formData[`${fieldName}_meta`] || []
    const isUploading = uploading[fieldName]
    const error = uploadErrors[fieldName]

    return (
      <div className="border border-border rounded-xl p-4 space-y-3 bg-card">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {images.length > 0 && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {images.length} image{images.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className={cn("grid gap-3", gridCols)}>
          {images.map((url: string, index: number) => {
            const meta = imagesMeta[index]
            return (
              <div key={`${fieldName}-${index}`} className="relative group">
                <div className="relative h-28 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`${title} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error(`[v0] Failed to load image in ${fieldName}[${index}]:`, url)
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                  <button
                    type="button"
                    onClick={() => removeImage(fieldName, index)}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                {meta && (
                  <p className="mt-1 text-[10px] text-muted-foreground truncate" title={meta.name}>
                    {meta.name}
                  </p>
                )}
              </div>
            )
          })}

          <label
            className={cn(
              "flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
              isUploading
                ? "border-primary/50 bg-primary/5"
                : "border-border hover:border-primary hover:bg-muted/50"
            )}
          >
            <div className="flex flex-col items-center justify-center">
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 mb-1 text-primary animate-spin" />
                  <p className="text-xs text-primary font-medium">
                    {uploadProgress[fieldName]}%
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Add Images</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, fieldName, true)}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Media & SEO</h3>
        <p className="text-sm text-muted-foreground">
          Upload images and optimize your property for search engines
        </p>
      </div>

      {/* Main Thumbnail - Required */}
      <SingleImageUpload
        fieldName="main_thumbnail"
        title="Main Thumbnail *"
        description="Primary image shown in listings and search results"
        height="h-52"
      />

      {/* Banner Image */}
      <SingleImageUpload
        fieldName="main_banner"
        title="Banner Image"
        description="Hero banner for the property detail page header"
        height="h-40"
      />

      {/* Gallery Images */}
      <MultipleImageUpload
        fieldName="multiple_images"
        title="Gallery Images"
        description="Additional images for the property gallery"
        gridCols="grid-cols-2 md:grid-cols-4"
      />

      {/* Master Plan */}
      <SingleImageUpload
        fieldName="master_plan"
        title="Master Plan"
        description="Overall project layout and master plan image"
        height="h-56"
      />

      {/* Ownership & Documents for resale/rental */}
      {(formData.listing_type === "resale" || formData.listing_type === "rental") && (
        <div className="border border-border rounded-xl p-4 space-y-4 bg-card">
          <h4 className="font-semibold">Ownership & Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Owner Type
              </label>
              <select
                value={formData.owner_type || "owner"}
                onChange={(e) => onChange("owner_type", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
                <option value="builder">Builder</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Ownership Type
              </label>
              <select
                value={formData.ownership_type || "freehold"}
                onChange={(e) => onChange("ownership_type", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="freehold">Freehold</option>
                <option value="leasehold">Leasehold</option>
                <option value="gpa">GPA</option>
                <option value="coop">Co-operative Society</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreement_ready || false}
                onChange={(e) => onChange("agreement_ready", e.target.checked)}
                className="rounded border-border"
              />
              <span>Agreement Ready</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.loan_available || false}
                onChange={(e) => onChange("loan_available", e.target.checked)}
                className="rounded border-border"
              />
              <span>Loan Available</span>
            </label>
          </div>
        </div>
      )}

      {/* Sales Contact for builder projects */}
      {formData.listing_type === "builder_project" && (
        <div className="border border-border rounded-xl p-4 space-y-4 bg-card">
          <h4 className="font-semibold">Sales Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Manager Name
              </label>
              <input
                type="text"
                value={formData.sales_manager_name || ""}
                onChange={(e) => onChange("sales_manager_name", e.target.value)}
                placeholder="Sales manager name"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={formData.sales_phone || ""}
                onChange={(e) => onChange("sales_phone", e.target.value)}
                placeholder="Contact number"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <div className="border border-border rounded-xl p-4 space-y-4 bg-card">
        <h4 className="font-semibold">SEO Settings</h4>
        
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            SEO Title
          </label>
          <input
            type="text"
            value={formData.meta_title || ""}
            onChange={(e) => onChange("meta_title", e.target.value)}
            placeholder="SEO title (max 75 characters)"
            maxLength={75}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(formData.meta_title || "").length}/75
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Meta Keywords
          </label>
          <input
            type="text"
            value={formData.meta_keywords || ""}
            onChange={(e) => onChange("meta_keywords", e.target.value)}
            placeholder="Keywords separated by commas"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Meta Description
          </label>
          <textarea
            value={formData.meta_description || ""}
            onChange={(e) => onChange("meta_description", e.target.value)}
            placeholder="Meta description (max 200 characters)"
            maxLength={200}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(formData.meta_description || "").length}/200
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="border border-border rounded-xl p-4 space-y-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm">FAQs</h4>
            <p className="text-xs text-muted-foreground">Add frequently asked questions about this property</p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>
        </div>

        {faqs.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">No FAQs added yet</p>
            <button
              type="button"
              onClick={addFaq}
              className="text-sm text-primary hover:underline"
            >
              Add your first FAQ
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-border rounded-lg p-3 bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">FAQ {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Question *</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="e.g., What is the possession date?"
                      className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Answer *</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Enter the answer..."
                      className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Helpful Note */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Ready to Submit
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1 ml-6">
          <li>Main thumbnail is recommended for better visibility</li>
          <li>Gallery images help showcase your property</li>
          <li>Floor plans increase buyer interest</li>
          <li>SEO fields help your listing rank higher in search</li>
        </ul>
      </div>
    </div>
  )
}
