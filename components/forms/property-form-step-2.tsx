"use client"

import { useState } from "react"
import { formatPriceToIndian } from "@/lib/utils"
import { Plus, Trash2, Upload, X, Loader2, ImageIcon } from "lucide-react"

export default function PropertyFormStep2({ formData, onChange }: any) {
  const [uploadingUnit, setUploadingUnit] = useState<number | null>(null)
  
  // Units management
  const units = formData.units || []

  const addUnit = () => {
    const newUnit = {
      type: "",
      size_range: "",
      price_range: "",
      available: true,
      floor_plan_image: ""
    }
    onChange("units", [...units, newUnit])
  }

  // Handle floor plan image upload for a specific unit
  const handleUnitFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>, unitIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingUnit(unitIndex)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)
      uploadFormData.append("folder", "floor-plans")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      
      // Update the specific unit's floor plan
      const updatedUnits = [...units]
      updatedUnits[unitIndex] = { ...updatedUnits[unitIndex], floor_plan_image: data.url }
      onChange("units", updatedUnits)
    } catch (error) {
      console.error("Floor plan upload error:", error)
    } finally {
      setUploadingUnit(null)
      e.target.value = ""
    }
  }

  const removeUnitFloorPlan = (unitIndex: number) => {
    const updatedUnits = [...units]
    updatedUnits[unitIndex] = { ...updatedUnits[unitIndex], floor_plan_image: "" }
    onChange("units", updatedUnits)
  }

  const updateUnit = (index: number, field: string, value: any) => {
    const updated = [...units]
    updated[index] = { ...updated[index], [field]: value }
    onChange("units", updated)
  }

  const removeUnit = (index: number) => {
    const updated = units.filter((_: any, i: number) => i !== index)
    onChange("units", updated)
  }
  // Helper to display formatted price preview
  const getPricePreview = (value: number | string | undefined) => {
    if (!value) return ""
    const numValue = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(numValue) || numValue === 0) return ""
    return formatPriceToIndian(numValue)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pricing & Dimensions</h3>
      </div>

      {formData.listing_type === "rental" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Monthly Rent (₹)</label>
              <input
                type="number"
                value={formData.monthly_rent || ""}
                onChange={(e) => onChange("monthly_rent", e.target.value)}
                placeholder="e.g., 25000"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Security Deposit (₹)</label>
              <input
                type="number"
                value={formData.security_deposit || ""}
                onChange={(e) => onChange("security_deposit", e.target.value)}
                placeholder="e.g., 50000"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Lock-in Period</label>
              <input
                type="text"
                value={formData.lock_in_period || ""}
                onChange={(e) => onChange("lock_in_period", e.target.value)}
                placeholder="e.g., 11 months"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Maintenance Charge (₹)</label>
              <input
                type="number"
                value={formData.maintenance_charge || ""}
                onChange={(e) => onChange("maintenance_charge", e.target.value)}
                placeholder="e.g., 3000"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Lowest Price (₹)</label>
              <input
                type="number"
                value={formData.lowest_price}
                onChange={(e) => onChange("lowest_price", e.target.value)}
                placeholder="e.g., 5000000"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {formData.lowest_price && (
                <p className="text-xs text-primary mt-1 font-medium">
                  Display: ₹{getPricePreview(formData.lowest_price)}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Maximum Price (₹)</label>
              <input
                type="number"
                value={formData.max_price}
                onChange={(e) => onChange("max_price", e.target.value)}
                placeholder="e.g., 7000000"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {formData.max_price && (
                <p className="text-xs text-primary mt-1 font-medium">
                  Display: ₹{getPricePreview(formData.max_price)}
                </p>
              )}
            </div>
          </div>

          {formData.listing_type === "builder_project" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Booking Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.booking_amount || ""}
                    onChange={(e) => onChange("booking_amount", e.target.value)}
                    placeholder="e.g., 100000"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Payment Plan</label>
                  <select
                    value={formData.payment_plan || "clp"}
                    onChange={(e) => onChange("payment_plan", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="clp">Construction Linked Plan</option>
                    <option value="possession_linked">Possession Linked</option>
                    <option value="down_payment">Down Payment</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Offers/Discounts</label>
                <input
                  type="text"
                  value={formData.offers_discounts || ""}
                  onChange={(e) => onChange("offers_discounts", e.target.value)}
                  placeholder="e.g., Early bird discount 5%"
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </>
          )}
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            {formData.listing_type === "builder_project" ? "Super Area (Sq Ft)" : "Area (Sq Ft)"}
          </label>
          <input
            type="number"
            value={formData.area_sqft}
            onChange={(e) => onChange("area_sqft", e.target.value)}
            placeholder="e.g., 1500"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Property Size</label>
          <input
            type="text"
            value={formData.property_size}
            onChange={(e) => onChange("property_size", e.target.value)}
            placeholder="e.g., 1500 Sq Ft"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {(formData.listing_type === "resale" || formData.listing_type === "rental") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Carpet Area (Sq Ft)</label>
            <input
              type="number"
              value={formData.carpet_area || ""}
              onChange={(e) => onChange("carpet_area", e.target.value)}
              placeholder="e.g., 1200"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Built-Up Area (Sq Ft)</label>
            <input
              type="number"
              value={formData.built_up_area || ""}
              onChange={(e) => onChange("built_up_area", e.target.value)}
              placeholder="e.g., 1350"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Direction Facing</label>
            <select
              value={formData.direction_facing || ""}
              onChange={(e) => onChange("direction_facing", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="north_east">North-East</option>
              <option value="north_west">North-West</option>
              <option value="south_east">South-East</option>
              <option value="south_west">South-West</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(formData.listing_type === "resale" || formData.listing_type === "rental") && (
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">BHK Configuration</label>
            <input
              type="text"
              value={formData.bhk_configuration || ""}
              onChange={(e) => onChange("bhk_configuration", e.target.value)}
              placeholder="e.g., 3BHK"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Bedrooms</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => onChange("bedrooms", e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Bathrooms</label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => onChange("bathrooms", e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Balconies</label>
          <input
            type="number"
            value={formData.balconies_count || ""}
            onChange={(e) => onChange("balconies_count", e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Floor Number</label>
          <input
            type="number"
            value={formData.floor_number}
            onChange={(e) => onChange("floor_number", e.target.value)}
            placeholder="e.g., 5"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total Floors</label>
          <input
            type="number"
            value={formData.total_floors}
            onChange={(e) => onChange("total_floors", e.target.value)}
            placeholder="e.g., 20"
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Parking Type</label>
          <select
            value={formData.parking_type}
            onChange={(e) => onChange("parking_type", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="open">Open</option>
            <option value="covered">Covered</option>
            <option value="basement">Basement</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Parking Count</label>
        <input
          type="number"
          value={formData.parking_count}
          onChange={(e) => onChange("parking_count", e.target.value)}
          placeholder="Number of parking spaces"
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {formData.listing_type === "builder_project" && (
        <>
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="font-semibold mb-3">Project Master Data</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total Towers</label>
                <input
                  type="number"
                  value={formData.total_towers || ""}
                  onChange={(e) => onChange("total_towers", e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total Units</label>
                <input
                  type="number"
                  value={formData.total_units || ""}
                  onChange={(e) => onChange("total_units", e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total Acreage</label>
                <input
                  type="text"
                  value={formData.total_acreage || ""}
                  onChange={(e) => onChange("total_acreage", e.target.value)}
                  placeholder="e.g., 10 acres"
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Unit Configurations */}
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Unit Configurations</h4>
              <button
                type="button"
                onClick={addUnit}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Unit Type
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Define available unit types (e.g., 3BHK, 4BHK) with their sizes and prices
            </p>

            {units.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">No unit types added yet</p>
                <button
                  type="button"
                  onClick={addUnit}
                  className="text-sm text-primary hover:underline"
                >
                  Add your first unit type
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {units.map((unit: any, index: number) => (
                  <div key={index} className="border border-border rounded-lg p-3 bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Unit {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeUnit(index)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Type *</label>
                        <input
                          type="text"
                          value={unit.type}
                          onChange={(e) => updateUnit(index, "type", e.target.value)}
                          placeholder="e.g., 3 BHK"
                          className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Size Range</label>
                        <input
                          type="text"
                          value={unit.size_range || ""}
                          onChange={(e) => updateUnit(index, "size_range", e.target.value)}
                          placeholder="e.g., 1800-2200 sqft"
                          className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Price Range</label>
                        <input
                          type="text"
                          value={unit.price_range || ""}
                          onChange={(e) => updateUnit(index, "price_range", e.target.value)}
                          placeholder="e.g., 1.2 Cr - 1.8 Cr"
                          className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Available</label>
                        <select
                          value={unit.available ? "yes" : "no"}
                          onChange={(e) => updateUnit(index, "available", e.target.value === "yes")}
                          className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Floor Plan Image Upload for this Unit */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <label className="text-xs text-muted-foreground block mb-2">
                        Floor Plan Image {unit.type ? `for ${unit.type}` : ""}
                      </label>
                      {unit.floor_plan_image ? (
                        <div className="flex items-start gap-3">
                          <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={unit.floor_plan_image}
                              alt={`Floor plan for ${unit.type || `Unit ${index + 1}`}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeUnitFloorPlan(index)}
                              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Floor plan uploaded</p>
                            <label className="inline-flex items-center gap-1 mt-1 text-xs text-primary cursor-pointer hover:underline">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUnitFloorPlanUpload(e, index)}
                                disabled={uploadingUnit === index}
                                className="hidden"
                              />
                              Replace image
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUnitFloorPlanUpload(e, index)}
                            disabled={uploadingUnit === index}
                            className="hidden"
                          />
                          {uploadingUnit === index ? (
                            <>
                              <Loader2 className="h-4 w-4 text-primary animate-spin" />
                              <span className="text-xs text-primary">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Upload floor plan image</span>
                            </>
                          )}
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
