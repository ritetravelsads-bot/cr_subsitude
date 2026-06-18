"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import PropertyFormStep1 from "./property-form-step-1"
import PropertyFormStep2 from "./property-form-step-2"
import PropertyFormStep3 from "./property-form-step-3"
import PropertyFormStep4 from "./property-form-step-4"
import PropertyFormOfficeSpace from "./property-form-office-space"

export default function PropertyFormMultiStep({
  apiEndpoint = "/api/agent/properties",
  initialData,
  isEdit = false,
  onSubmit, // Declare the onSubmit variable here
}: {
  apiEndpoint?: string
  initialData?: any
  isEdit?: boolean
  onSubmit?: () => Promise<void> // Declare the type of onSubmit
}) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const defaultFormData = {
    property_name: "",
    slug: "",
    property_type: "apartment",
    listing_type: "new",
    property_category: "residential",
    lowest_price: "",
    max_price: "",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    parking_type: "open",
    parking_count: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    status: "active",
    furnished_type: "unfurnished",
    floor_number: "",
    total_floors: "",
    possession: "",
    possession_type: "ready",
    possession_date: "",
    neighborhood: "",
    amenities: [] as string[],
    facilities: [] as string[],
    luxury_amenities: [] as string[],
    // New fields for enhanced property detail page
    about_project: "",
    about_subheading: "",
    special_sections: [] as Array<{ id: string; title: string; subtitle: string; content: string; position: string }>,
    project_highlights: [] as string[],
    units: [] as Array<{ type: string; size_range?: string; price_range?: string; available?: boolean; floor_plan_image?: string }>,
    location_connectivity: [] as Array<{ type: string; name: string; distance: string }>,
    faqs: [] as Array<{ question: string; answer: string }>,
    payment_plan_details: "",
    // Office Space fields
    office_space: null as any,
    commercial_lease: null as any,
    meta_title: "",
    meta_keywords: "",
    meta_description: "",
    main_banner: "",
    main_thumbnail: "",
    multiple_images: [] as string[],
    floor_plans: [] as string[],
    master_plan: "",
    rera_registered: false,
    balconies_count: "",
  }
  
  // Helper function to ensure array fields are properly formatted
  const normalizeArrayField = (value: any): string[] => {
    if (Array.isArray(value)) {
      return value
    }
    if (typeof value === 'string' && value.startsWith('[')) {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        return []
      }
    }
    if (typeof value === 'string' && value.length > 0) {
      // Single URL stored as string
      return [value]
    }
    return []
  }
  
  // Merge initial data with defaults to ensure all fields exist
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      // Normalize array fields that might come from the database in unexpected formats
      const normalizedData = {
        ...defaultFormData,
        ...initialData,
        // Ensure slug is properly loaded
        slug: initialData.slug || "",
        // Ensure image arrays are properly formatted
        multiple_images: normalizeArrayField(initialData.multiple_images),
        floor_plans: normalizeArrayField(initialData.floor_plans),
        amenities: normalizeArrayField(initialData.amenities),
        facilities: normalizeArrayField(initialData.facilities),
        luxury_amenities: normalizeArrayField(initialData.luxury_amenities),
        project_highlights: normalizeArrayField(initialData.project_highlights),
        // Ensure SEO fields are properly loaded (handle both old and new field names)
        meta_title: initialData.meta_title || initialData.seo_title || "",
        meta_description: initialData.meta_description || "",
        meta_keywords: initialData.meta_keywords || "",
      }
      
      // Debug: Log normalized data
      console.log("[v0] Form initialized with normalized data - image fields:", {
        main_thumbnail: normalizedData.main_thumbnail,
        main_banner: normalizedData.main_banner,
        multiple_images: normalizedData.multiple_images,
        floor_plans: normalizedData.floor_plans,
        master_plan: normalizedData.master_plan,
      })
      
      // Debug: Log SEO fields
      console.log("[v0] Form initialized with normalized data - SEO fields:", {
        meta_title: normalizedData.meta_title,
        meta_description: normalizedData.meta_description,
        meta_keywords: normalizedData.meta_keywords,
      })
      
      return normalizedData
    }
    return defaultFormData
  })

  const handleStepChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const method = isEdit ? "PUT" : "POST"
      
      // Debug: Log image fields before processing
      console.log("[v0] Form data before submit - image fields:", {
        main_thumbnail: formData.main_thumbnail,
        main_banner: formData.main_banner,
        multiple_images: formData.multiple_images,
        floor_plans: formData.floor_plans,
        master_plan: formData.master_plan,
      })
      
      // Clean up the form data - remove _id for updates (it's in the URL)
      // and convert numeric strings to numbers
      const cleanedData: Record<string, any> = {}
      
      for (const [key, value] of Object.entries(formData)) {
        // Skip _id field for updates - it's already in the API endpoint URL
        if (key === "_id") continue
        
        // Convert numeric string fields to numbers
        const numericFields = [
          "lowest_price", "max_price", "bedrooms", "bathrooms", "area_sqft",
          "parking_count", "floor_number", "total_floors", "balconies_count",
          "carpet_area", "built_up_area", "super_area", "total_towers",
          "total_units", "floors_per_tower", "total_acreage", "open_area_percentage",
          "clubhouse_size", "booking_amount", "latitude", "longitude"
        ]
        
        if (numericFields.includes(key) && value !== "" && value !== null && value !== undefined) {
          const num = Number(value)
          cleanedData[key] = isNaN(num) ? value : num
        } else if (value !== undefined) {
          cleanedData[key] = value
        }
      }
      
      // Debug: Log cleaned data being sent
      console.log("[v0] Cleaned data being sent - image fields:", {
        main_thumbnail: cleanedData.main_thumbnail,
        main_banner: cleanedData.main_banner,
        multiple_images: cleanedData.multiple_images,
        floor_plans: cleanedData.floor_plans,
        master_plan: cleanedData.master_plan,
      })
      
      // Debug: Log SEO fields being sent
      console.log("[v0] Cleaned data being sent - SEO fields:", {
        meta_title: cleanedData.meta_title,
        meta_description: cleanedData.meta_description,
        meta_keywords: cleanedData.meta_keywords,
      })
      
      const res = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        const slug = data.property?.slug || data.slug || cleanedData.slug
        const id = data.property?._id || data._id
        
        // Redirect to property view page
        router.push(`/properties/${slug || id}`)
      } else {
        alert(`Error saving property: ${data.error || data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error submitting property:", error)
      alert(`Error saving property: ${error instanceof Error ? error.message : "Network error"}`)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Pricing & Size" },
    { number: 3, title: "Location" },
    { number: 4, title: "Media & SEO" },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step.number < currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.number === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step.number < currentStep ? <Check size={18} /> : step.number}
              </div>
              <div className="ml-3 text-sm font-medium">{step.title}</div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${step.number < currentStep ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        {currentStep === 1 && <PropertyFormStep1 formData={formData} onChange={handleStepChange} />}
        {currentStep === 2 && (
          <>
            <PropertyFormStep2 formData={formData} onChange={handleStepChange} />
            {/* Show Office Space form for commercial/office properties */}
            {(formData.property_category === 'commercial' || 
              ['office', 'office_space', 'coworking', 'managed_office', 'virtual_office', 'private_office', 'sco', 'commercial'].includes(formData.property_type?.toLowerCase())) && (
              <div className="mt-8 pt-8 border-t border-border">
                <PropertyFormOfficeSpace formData={formData} onChange={handleStepChange} />
              </div>
            )}
          </>
        )}
        {currentStep === 3 && <PropertyFormStep3 formData={formData} onChange={handleStepChange} />}
        {currentStep === 4 && <PropertyFormStep4 formData={formData} onChange={handleStepChange} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between">
        <Button onClick={handlePrev} variant="outline" disabled={currentStep === 1} className="px-6 bg-transparent">
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </Button>

        {currentStep === 4 ? (
          <Button onClick={handleSubmit} disabled={loading} className="px-8">
            {loading ? "Submitting..." : "Publish Property"}
          </Button>
        ) : (
          <Button onClick={handleNext} className="px-6">
            Next
            <ArrowRight size={16} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
