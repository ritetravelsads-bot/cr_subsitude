"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import PageHeader from "@/components/dashboard/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export default function EditDeveloperPage() {
  const router = useRouter()
  const params = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    about_developer: "",
  })

  useEffect(() => {
    const loadDeveloper = async () => {
      try {
        // Add cache-busting timestamp to ensure fresh data
        const res = await fetch(`/api/admin/developers/${params.id}?_t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await res.json()
        
        // Only set the fields we need
        const newFormData = {
          name: data.name || "",
          logo_url: data.logo_url || "",
          about_developer: data.about_developer || "",
        }
        setFormData(newFormData)
        
        if (data.logo_url) {
          setLogoPreview(data.logo_url)
        }
      } catch (error) {
        console.error("[v0] Error loading developer:", error)
        toast.error("Failed to load developer")
      } finally {
        setLoading(false)
      }
    }

    loadDeveloper()
  }, [params.id])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      formDataUpload.append("folder", "developers")

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await res.json()

      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, logo_url: data.url }))
        setLogoPreview(data.url)
        toast.success("Logo uploaded successfully")
      } else {
        toast.error(data.error || "Failed to upload logo")
        setLogoPreview(formData.logo_url)
      }
    } catch (error) {
      console.error("[v0] Error uploading image:", error)
      toast.error("Error uploading logo")
      setLogoPreview(formData.logo_url)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview("")
    setFormData((prev) => ({ ...prev, logo_url: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Developer name is required")
      return
    }
    
    setSaving(true)
    try {
      const payload = {
        name: formData.name.trim(),
        logo_url: formData.logo_url || "",
        about_developer: formData.about_developer || "",
      }
      
      const res = await fetch(`/api/admin/developers/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      
      if (res.ok) {
        toast.success("Developer updated successfully")
        router.push("/admin/developers")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update developer")
      }
    } catch (error) {
      console.error("[v0] Error updating developer:", error)
      toast.error("Error updating developer")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Developer"
          description="Loading..."
          showBackButton
          backHref="/admin/developers"
        />
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Developer"
        description={`Editing: ${formData.name || "Developer"}`}
        showBackButton
        backHref="/admin/developers"
      />

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6 max-w-2xl">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Developer Name</label>
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
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Developer Logo</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="text-xs h-8"
                        disabled={uploading}
                      >
                        <Upload size={14} className="mr-1.5" />
                        {uploading ? "Uploading..." : logoPreview ? "Change Logo" : "Upload Logo"}
                      </Button>
                    </div>
                    {logoPreview && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md border border-border">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-16 w-16 object-contain rounded border border-border bg-background"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground">Current Logo</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {formData.logo_url ? "Uploaded to server" : "Preview only"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={handleRemoveLogo}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    )}
                    {!logoPreview && (
                      <p className="text-xs text-muted-foreground">No logo uploaded. Click the button above to add one.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">About Developer</label>
                  <textarea
                    name="about_developer"
                    value={formData.about_developer}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving} className="text-xs h-8">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" className="text-xs h-8" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
