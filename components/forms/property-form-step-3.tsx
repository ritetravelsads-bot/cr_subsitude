"use client"

import { useState, useEffect } from "react"
import { ComboSelect, MultiComboSelect } from "@/components/ui/combo-select"
import { Plus, Trash2, MapPin, Navigation } from "lucide-react"

interface Option {
  _id: string
  name: string
  [key: string]: any
}

const CONNECTIVITY_TYPES = [
  { value: "metro", label: "Metro Station" },
  { value: "airport", label: "Airport" },
  { value: "highway", label: "Highway" },
  { value: "hospital", label: "Hospital" },
  { value: "school", label: "School" },
  { value: "mall", label: "Mall" },
  { value: "railway", label: "Railway Station" },
  { value: "bus_stand", label: "Bus Stand" },
]

export default function PropertyFormStep3({ formData, onChange }: any) {
  // Location connectivity management
  const connectivity = formData.location_connectivity || []

  const addConnectivity = () => {
    const newItem = {
      type: "metro",
      name: "",
      distance: ""
    }
    onChange("location_connectivity", [...connectivity, newItem])
  }

  const updateConnectivity = (index: number, field: string, value: string) => {
    const updated = [...connectivity]
    updated[index] = { ...updated[index], [field]: value }
    onChange("location_connectivity", updated)
  }

  const removeConnectivity = (index: number) => {
    const updated = connectivity.filter((_: any, i: number) => i !== index)
    onChange("location_connectivity", updated)
  }
  const [states, setStates] = useState<Option[]>([])
  const [locations, setLocations] = useState<Option[]>([])
  const [amenities, setAmenities] = useState<Option[]>([])
  const [facilities, setFacilities] = useState<Option[]>([])
  const [connectivityTypes, setConnectivityTypes] = useState<Option[]>(
    CONNECTIVITY_TYPES.map((t, idx) => ({ _id: `default-${idx}`, name: t.label, value: t.value }))
  )
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [loadingAmenities, setLoadingAmenities] = useState(false)
  const [loadingFacilities, setLoadingFacilities] = useState(false)

  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true)
      try {
        const res = await fetch("/api/admin/states")
        const data = await res.json()
        setStates(data)
      } catch (error) {
        console.error("Error loading states:", error)
      } finally {
        setLoadingStates(false)
      }
    }

    const loadLocations = async () => {
      setLoadingLocations(true)
      try {
        const res = await fetch("/api/admin/locations")
        const data = await res.json()
        setLocations(data)
      } catch (error) {
        console.error("Error loading locations:", error)
      } finally {
        setLoadingLocations(false)
      }
    }

    const loadAmenities = async () => {
      setLoadingAmenities(true)
      try {
        const res = await fetch("/api/admin/amenities")
        const data = await res.json()
        setAmenities(data)
      } catch (error) {
        console.error("Error loading amenities:", error)
      } finally {
        setLoadingAmenities(false)
      }
    }

    const loadFacilities = async () => {
      setLoadingFacilities(true)
      try {
        const res = await fetch("/api/admin/facilities")
        const data = await res.json()
        setFacilities(data)
      } catch (error) {
        console.error("Error loading facilities:", error)
      } finally {
        setLoadingFacilities(false)
      }
    }

    loadStates()
    loadLocations()
    loadAmenities()
    loadFacilities()
  }, [])

  const handleAddState = async (name: string): Promise<Option | null> => {
    try {
      const res = await fetch("/api/admin/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        const newState = await res.json()
        setStates((prev) => [...prev, newState].sort((a, b) => a.name.localeCompare(b.name)))
        return newState
      }
    } catch (error) {
      console.error("Error adding state:", error)
    }
    return null
  }

  const handleAddLocation = async (name: string): Promise<Option | null> => {
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          type: "city",
          state: formData.state || ""
        }),
      })
      if (res.ok) {
        const newLocation = await res.json()
        setLocations((prev) => [...prev, newLocation].sort((a, b) => a.name.localeCompare(b.name)))
        return newLocation
      }
    } catch (error) {
      console.error("Error adding location:", error)
    }
    return null
  }

  const handleAddAmenity = async (name: string): Promise<Option | null> => {
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon_class: "check" }),
      })
      if (res.ok) {
        const newAmenity = await res.json()
        setAmenities((prev) => [...prev, newAmenity].sort((a, b) => a.name.localeCompare(b.name)))
        return newAmenity
      }
    } catch (error) {
      console.error("Error adding amenity:", error)
    }
    return null
  }

  const handleAddFacility = async (name: string): Promise<Option | null> => {
    try {
      const res = await fetch("/api/admin/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon_class: "building" }),
      })
      if (res.ok) {
        const newFacility = await res.json()
        setFacilities((prev) => [...prev, newFacility].sort((a, b) => a.name.localeCompare(b.name)))
        return newFacility
      }
    } catch (error) {
      console.error("Error adding facility:", error)
    }
    return null
  }

  const handleStateChange = (value: string | string[]) => {
    const selectedName = Array.isArray(value) ? value[0] : value
    onChange("state", selectedName || "")
  }

  const handleLocationChange = (value: string | string[]) => {
    const selectedName = Array.isArray(value) ? value[0] : value
    onChange("city", selectedName || "")
  }

  const handleAmenitiesChange = (value: string[]) => {
    onChange("amenities", value)
  }

  const handleFacilitiesChange = (value: string[]) => {
    onChange("facilities", value)
  }

  const handleAddConnectivityType = async (name: string): Promise<Option | null> => {
    // Create a new custom connectivity type (stored locally, not in DB)
    const newType: Option = {
      _id: `custom-${Date.now()}`,
      name: name,
      value: name.toLowerCase().replace(/\s+/g, "_")
    }
    setConnectivityTypes((prev) => [...prev, newType].sort((a, b) => a.name.localeCompare(b.name)))
    return newType
  }

  const handleConnectivityTypeChange = (index: number, value: string | string[]) => {
    const selectedName = Array.isArray(value) ? value[0] : value
    // Find the type value from the name
    const typeOption = connectivityTypes.find(t => t.name === selectedName)
    const typeValue = typeOption?.value || selectedName.toLowerCase().replace(/\s+/g, "_")
    updateConnectivity(index, "type", typeValue)
    // Also store the display name
    updateConnectivity(index, "type_label", selectedName)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Location & Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Country</label>
          <input
            type="text"
            value={formData.country || "India"}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Country"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Google Map Link</label>
          <input
            type="url"
            value={formData.google_map_link || ""}
            onChange={(e) => onChange("google_map_link", e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Street address"
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" />
              Location / City
            </span>
          </label>
          <ComboSelect
            value={formData.city || ""}
            onChange={handleLocationChange}
            options={locations}
            onAddNew={handleAddLocation}
            placeholder="Select or add location..."
            loading={loadingLocations}
          />
        </div>
        <ComboSelect
          label="State"
          value={formData.state || ""}
          onChange={handleStateChange}
          options={states}
          onAddNew={handleAddState}
          placeholder="Select or add a state..."
          loading={loadingStates}
        />
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Postal Code</label>
          <input
            type="text"
            value={formData.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
            placeholder="Postal code"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Locality</label>
          <input
            type="text"
            value={formData.neighborhood}
            onChange={(e) => onChange("neighborhood", e.target.value)}
            placeholder="Locality or neighborhood"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Landmark</label>
          <input
            type="text"
            value={formData.landmark || ""}
            onChange={(e) => onChange("landmark", e.target.value)}
            placeholder="Nearby landmark"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Amenities with MultiComboSelect */}
      <div className="pt-2">
        <MultiComboSelect
          label="Amenities"
          value={formData.amenities || []}
          onChange={handleAmenitiesChange}
          options={amenities}
          onAddNew={handleAddAmenity}
          placeholder="Select or add amenities..."
          loading={loadingAmenities}
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Select from existing amenities or type to add new ones
        </p>
      </div>

      {/* Facilities with MultiComboSelect */}
      <div className="pt-2">
        <MultiComboSelect
          label="Facilities"
          value={formData.facilities || []}
          onChange={handleFacilitiesChange}
          options={facilities}
          onAddNew={handleAddFacility}
          placeholder="Select or add facilities..."
          loading={loadingFacilities}
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Select from existing facilities or type to add new ones
        </p>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Luxury Amenities</label>
        <textarea
          placeholder="Premium amenities (e.g., Private Elevator, Home Theater, Jacuzzi)"
          value={formData.luxury_amenities.join(", ")}
          onChange={(e) =>
            onChange(
              "luxury_amenities",
              e.target.value.split(",").map((a) => a.trim()),
            )
          }
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
        />
      </div>

      {(formData.listing_type === "resale" || formData.listing_type === "rental") && (
        <div className="border-t border-border pt-4 mt-4">
          <h4 className="font-semibold mb-3">Unit Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: "modular_kitchen", label: "Modular Kitchen" },
              { key: "wardrobes", label: "Wardrobes" },
              { key: "acs", label: "Air Conditioners" },
              { key: "home_automation", label: "Home Automation" },
              { key: "servant_room", label: "Servant Room" },
              { key: "study_room", label: "Study Room" },
            ].map((feature) => (
              <label key={feature.key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.unit_features?.[feature.key] || false}
                  onChange={(e) =>
                    onChange("unit_features", {
                      ...formData.unit_features,
                      [feature.key]: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                <span>{feature.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Location & Connectivity Section */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Location & Connectivity</h4>
          <button
            type="button"
            onClick={addConnectivity}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Add nearby landmarks, transport hubs, and key locations with distances
        </p>

        {connectivity.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">No connectivity points added yet</p>
            <button
              type="button"
              onClick={addConnectivity}
              className="text-sm text-primary hover:underline"
            >
              Add your first connectivity point
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {connectivity.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-lg p-3 bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Location {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeConnectivity(index)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      <span className="flex items-center gap-1.5">
                        <Navigation size={12} className="text-primary" />
                        Location Type
                      </span>
                    </label>
                    <ComboSelect
                      value={item.type_label || connectivityTypes.find(t => t.value === item.type)?.name || ""}
                      onChange={(value) => handleConnectivityTypeChange(index, value)}
                      options={connectivityTypes}
                      onAddNew={handleAddConnectivityType}
                      placeholder="Select or add type..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Name *</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateConnectivity(index, "name", e.target.value)}
                      placeholder="e.g., Huda City Centre Metro"
                      className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Distance *</label>
                    <input
                      type="text"
                      value={item.distance}
                      onChange={(e) => updateConnectivity(index, "distance", e.target.value)}
                      placeholder="e.g., 2.5 km"
                      className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
