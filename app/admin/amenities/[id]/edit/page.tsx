"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/dashboard/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminEditAmenityPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    icon_class: "",
  })

  useEffect(() => {
    const loadAmenity = async () => {
      try {
        const res = await fetch(`/api/admin/amenities/${id}`)
        const data = await res.json()
        setFormData(data)
      } catch (error) {
        console.error("[v0] Error loading amenity:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadAmenity()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/amenities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        router.push("/admin/amenities")
      }
    } catch (error) {
      console.error("[v0] Error updating amenity:", error)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Amenity"
          description="Loading..."
          showBackButton
          backHref="/admin/amenities"
        />
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Amenity"
        description={`Editing: ${formData.name || "Amenity"}`}
        showBackButton
        backHref="/admin/amenities"
      />

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6 max-w-2xl">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Amenity Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Icon Class (Lucide)</label>
          <input
            type="text"
            name="icon_class"
            value={formData.icon_class}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="text-xs h-8">
            {loading ? "Updating..." : "Update Amenity"}
          </Button>
          <Button type="button" variant="outline" className="text-xs h-8" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
