"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Eye, Plus, Building2 } from "lucide-react"
import { useEffect, useState } from "react"
import { formatPriceToIndian, getPropertyUrl } from "@/lib/utils"

export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await fetch("/api/agent/properties")
        const data = await res.json()
        setProperties(data)
      } catch (error) {
        console.error("[v0] Error loading properties:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        const res = await fetch(`/api/agent/properties/${id}`, { method: "DELETE" })
        if (res.ok) {
          setProperties(properties.filter((p) => p._id !== id))
        }
      } catch (error) {
        console.error("[v0] Error deleting property:", error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      draft: "bg-muted text-muted-foreground",
      sold: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    }
    return colors[status] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your listed properties</p>
        </div>
        <Button asChild>
          <Link href="/agent/properties/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-foreground">{properties.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-xl font-bold text-foreground">
                {properties.filter((p) => p.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-foreground">
                {properties.filter((p) => p.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sold</p>
              <p className="text-xl font-bold text-foreground">
                {properties.filter((p) => p.status === "sold").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No properties yet</p>
          <Button asChild>
            <Link href="/agent/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Listing
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{property.property_name}</h3>
                <p className="text-xs text-muted-foreground mt-1 truncate">{property.address}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                  <span className="px-2 py-0.5 bg-muted rounded text-xs">
                    {formatPriceToIndian(property.lowest_price)}
                  </span>
                  {property.property_type && (
                    <span className="px-2 py-0.5 bg-muted rounded text-xs capitalize">{property.property_type}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                  <Link href={getPropertyUrl(property)}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                  <Link href={`/agent/properties/${property._id}/edit`}>
                    <Edit2 className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(property._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
