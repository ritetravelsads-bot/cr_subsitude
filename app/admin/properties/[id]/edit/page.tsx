"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import PropertyFormMultiStep from "@/components/forms/property-form-multistep"
import { useToast } from "@/hooks/use-toast"
import PageHeader from "@/components/dashboard/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminEditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string
  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("No property ID provided")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/admin/properties/${id}`)
        const data = await res.json()
        
        if (res.ok) {
          // Debug: Log image fields being loaded for edit
          console.log("[v0] Property data loaded for edit - image fields:", {
            main_thumbnail: data.main_thumbnail,
            main_banner: data.main_banner,
            multiple_images: data.multiple_images,
            floor_plans: data.floor_plans,
            master_plan: data.master_plan,
          })
          setInitialData(data)
          setError(null)
        } else {
          setError(data.error || "Property not found")
          toast({
            title: "Error",
            description: data.error || "Property not found",
            variant: "destructive",
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error loading property"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Property"
          description="Loading property details..."
          showBackButton
          backHref="/admin/properties"
        />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error || !initialData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Property Not Found"
          description={error || "The requested property could not be found"}
          showBackButton
          backHref="/admin/properties"
        />
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm">
          <p className="font-medium text-destructive mb-1">Unable to load property</p>
          <p className="text-muted-foreground">
            Property ID: <code className="bg-muted px-1 rounded">{id}</code>
          </p>
          {error && <p className="text-muted-foreground mt-1">Error: {error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Property"
        description={`Editing: ${initialData.property_name || "Property"}`}
        showBackButton
        backHref="/admin/properties"
      />
      <PropertyFormMultiStep
        apiEndpoint={`/api/admin/properties/${id}`}
        initialData={initialData}
        isEdit={true}
      />
    </div>
  )
}
