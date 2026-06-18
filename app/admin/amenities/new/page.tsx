"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/dashboard/page-header"

export default function AdminAddAmenityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    icon_class: "",
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        router.push("/admin/amenities")
      }
    } catch (error) {
      console.error("[v0] Error creating amenity:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Amenity"
        description="Add a new property amenity"
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
            placeholder="e.g., Swimming Pool"
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
            placeholder="e.g., droplets, wifi, trees"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="text-xs h-8">
            {loading ? "Creating..." : "Create Amenity"}
          </Button>
          <Button type="button" variant="outline" className="text-xs h-8" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
