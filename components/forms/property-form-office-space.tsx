"use client"

import { useState } from "react"
import { Plus, Trash2, Building2, Users, Clock, DollarSign, Zap, Wifi, Shield, Layers, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface SeatConfiguration {
  type: 'hot_desk' | 'dedicated_desk' | 'private_cabin' | 'team_cabin' | 'manager_cabin' | 'executive_cabin' | 'open_desk'
  capacity?: number
  count?: number
  price_per_seat?: number
  price_type?: 'monthly' | 'daily' | 'hourly' | 'yearly'
  amenities?: string[]
}

interface OfficeSpaceData {
  space_type?: string
  total_seats?: number
  available_seats?: number
  cabin_count?: number
  available_cabins?: number
  desk_count?: number
  meeting_rooms_count?: number
  seat_configurations?: SeatConfiguration[]
  pricing_model?: string
  lease_term_min?: number
  lease_term_max?: number
  price_per_seat_monthly?: number
  price_per_seat_daily?: number
  price_per_cabin_monthly?: number
  meeting_room_hourly_rate?: number
  office_amenities?: string[]
  access_hours?: string
  custom_access_hours?: string
  reception_available?: boolean
  mail_handling?: boolean
  parking_included?: boolean
  pantry_cafeteria?: boolean
  flexible_terms?: boolean
  minimum_commitment?: string
  notice_period?: string
  building_grade?: string
  fit_out_status?: string
  // Enhanced fields for different space types
  // Coworking specific
  community_events?: boolean
  networking_lounge?: boolean
  phone_booths_count?: number
  breakout_areas?: boolean
  membership_tiers?: string[]
  day_pass_available?: boolean
  day_pass_price?: number
  // Managed Office specific
  dedicated_floor?: boolean
  customizable_branding?: boolean
  dedicated_reception?: boolean
  server_room?: boolean
  ups_backup?: boolean
  dedicated_internet?: boolean
  internet_speed_mbps?: number
  minimum_lock_in_months?: number
  scalability_options?: string
  // Private Office specific
  private_entrance?: boolean
  dedicated_washroom?: boolean
  executive_cabins_count?: number
  conference_room_capacity?: number
  board_room_available?: boolean
  visitor_management?: boolean
  // Space specifications
  floor_plate_sqft?: number
  ceiling_height_ft?: number
  workstation_density?: string
  natural_lighting?: boolean
  corner_office?: boolean
  // Infrastructure
  power_load_kva?: number
  ac_type?: string
  fire_safety_compliant?: boolean
  wheelchair_accessible?: boolean
  // Additional pricing
  security_deposit_months?: number
  maintenance_included?: boolean
  electricity_included?: boolean
  electricity_charges_per_unit?: number
}

interface CommercialLeaseData {
  lease_type?: string
  rent_per_sqft?: number
  rent_escalation?: string
  cam_charges?: number
  security_deposit_months?: number
  fit_out_allowance?: number
  rent_free_period?: string
  lock_in_period_months?: number
  agreement_duration_years?: number
}

const SPACE_TYPES = [
  { value: 'coworking', label: 'Coworking Space' },
  { value: 'managed_office', label: 'Managed Office' },
  { value: 'private_office', label: 'Private Office' },
  { value: 'virtual_office', label: 'Virtual Office' },
  { value: 'hot_desk', label: 'Hot Desk' },
  { value: 'dedicated_desk', label: 'Dedicated Desk' },
  { value: 'meeting_room', label: 'Meeting Room' },
  { value: 'training_room', label: 'Training Room' },
]

const SEAT_CONFIG_TYPES = [
  { value: 'hot_desk', label: 'Hot Desk' },
  { value: 'dedicated_desk', label: 'Dedicated Desk' },
  { value: 'open_desk', label: 'Open Desk' },
  { value: 'private_cabin', label: 'Private Cabin' },
  { value: 'team_cabin', label: 'Team Cabin (4-8 seats)' },
  { value: 'manager_cabin', label: 'Manager Cabin' },
  { value: 'executive_cabin', label: 'Executive Cabin' },
]

const PRICING_MODELS = [
  { value: 'lease', label: 'Lease' },
  { value: 'rent', label: 'Rent' },
  { value: 'license', label: 'License Agreement' },
  { value: 'membership', label: 'Membership' },
  { value: 'pay_per_use', label: 'Pay Per Use' },
]

const ACCESS_HOURS_OPTIONS = [
  { value: '24_7', label: '24/7 Access' },
  { value: 'business_hours', label: 'Business Hours (9 AM - 6 PM)' },
  { value: 'extended_hours', label: 'Extended Hours (7 AM - 10 PM)' },
  { value: 'custom', label: 'Custom Hours' },
]

const BUILDING_GRADES = [
  { value: 'grade_a_plus', label: 'Grade A+' },
  { value: 'grade_a', label: 'Grade A' },
  { value: 'grade_b', label: 'Grade B' },
  { value: 'premium', label: 'Premium' },
]

const FIT_OUT_OPTIONS = [
  { value: 'bare_shell', label: 'Bare Shell' },
  { value: 'warm_shell', label: 'Warm Shell' },
  { value: 'fully_fitted', label: 'Fully Fitted' },
  { value: 'plug_and_play', label: 'Plug and Play' },
]

const LEASE_TYPES = [
  { value: 'lease', label: 'Lease' },
  { value: 'rent', label: 'Rent' },
  { value: 'sub_lease', label: 'Sub-Lease' },
  { value: 'license', label: 'License' },
]

const OFFICE_AMENITIES = [
  'High-Speed WiFi',
  'Reception Services',
  'Mail Handling',
  'Printer/Scanner',
  'Video Conferencing',
  'Pantry/Cafeteria',
  'Coffee/Tea',
  'Housekeeping',
  'IT Support',
  'Meeting Rooms',
  'Conference Room',
  'Phone Booth',
  'Lounge Area',
  'Parking',
  'Power Backup',
  'Security',
  'CCTV',
  'Biometric Access',
  'Air Conditioning',
  'Water Dispenser',
  'Gym/Fitness Center',
  'Gaming Zone',
  'Nap Pods',
  'Outdoor Terrace',
  'Shower Facilities',
  'Bike Storage',
  'EV Charging',
  'Prayer Room',
  'Creche/Daycare',
  'Food Court',
]

const AC_TYPES = [
  { value: 'central', label: 'Central AC' },
  { value: 'split', label: 'Split AC' },
  { value: 'vrf', label: 'VRF System' },
  { value: 'chiller', label: 'Chiller Based' },
]

const WORKSTATION_DENSITY = [
  { value: 'low', label: 'Low (80-100 sqft/seat)' },
  { value: 'standard', label: 'Standard (60-80 sqft/seat)' },
  { value: 'high', label: 'High (40-60 sqft/seat)' },
]

const MEMBERSHIP_TIERS_OPTIONS = [
  'Day Pass',
  'Hot Desk Monthly',
  'Dedicated Desk',
  'Private Cabin',
  'Team Suite',
  'Enterprise',
]

export default function PropertyFormOfficeSpace({ formData, onChange }: {
  formData: any
  onChange: (field: string, value: any) => void
}) {
  const [showCommercialLease, setShowCommercialLease] = useState(
    formData.property_category === 'commercial' || 
    ['office', 'office_space', 'sco', 'commercial'].includes(formData.property_type)
  )

  const officeSpace: OfficeSpaceData = formData.office_space || {}
  const commercialLease: CommercialLeaseData = formData.commercial_lease || {}

  const updateOfficeSpace = (field: string, value: any) => {
    onChange('office_space', { ...officeSpace, [field]: value })
  }

  const updateCommercialLease = (field: string, value: any) => {
    onChange('commercial_lease', { ...commercialLease, [field]: value })
  }

  // Seat Configurations Management
  const seatConfigs = officeSpace.seat_configurations || []
  
  const addSeatConfig = () => {
    const newConfig: SeatConfiguration = {
      type: 'hot_desk',
      capacity: 1,
      count: 1,
      price_per_seat: 0,
      price_type: 'monthly',
      amenities: []
    }
    updateOfficeSpace('seat_configurations', [...seatConfigs, newConfig])
  }

  const updateSeatConfig = (index: number, field: string, value: any) => {
    const updated = [...seatConfigs]
    updated[index] = { ...updated[index], [field]: value }
    updateOfficeSpace('seat_configurations', updated)
  }

  const removeSeatConfig = (index: number) => {
    const updated = seatConfigs.filter((_, i) => i !== index)
    updateOfficeSpace('seat_configurations', updated)
  }

  // Office Amenities Management
  const selectedAmenities = officeSpace.office_amenities || []
  
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      updateOfficeSpace('office_amenities', selectedAmenities.filter(a => a !== amenity))
    } else {
      updateOfficeSpace('office_amenities', [...selectedAmenities, amenity])
    }
  }

  // Check if this is an office space property
  const isOfficeProperty = [
    'office', 'office_space', 'coworking', 'managed_office', 
    'virtual_office', 'private_office', 'sco', 'commercial'
  ].includes(formData.property_type?.toLowerCase())

  if (!isOfficeProperty && formData.property_category !== 'commercial') {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Office Space Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <Building2 size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Office Space Details</h3>
          <p className="text-sm text-muted-foreground">Configure office space type, seating, and pricing</p>
        </div>
      </div>

      {/* Space Type & Basic Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Building2 size={16} />
          Space Type & Capacity
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Space Type</label>
            <select
              value={officeSpace.space_type || ''}
              onChange={(e) => updateOfficeSpace('space_type', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select Space Type</option>
              {SPACE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Building Grade</label>
            <select
              value={officeSpace.building_grade || ''}
              onChange={(e) => updateOfficeSpace('building_grade', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select Grade</option>
              {BUILDING_GRADES.map(grade => (
                <option key={grade.value} value={grade.value}>{grade.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Fit-out Status</label>
            <select
              value={officeSpace.fit_out_status || ''}
              onChange={(e) => updateOfficeSpace('fit_out_status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select Status</option>
              {FIT_OUT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Pricing Model</label>
            <select
              value={officeSpace.pricing_model || ''}
              onChange={(e) => updateOfficeSpace('pricing_model', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select Model</option>
              {PRICING_MODELS.map(model => (
                <option key={model.value} value={model.value}>{model.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Capacity Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total Seats</label>
            <input
              type="number"
              value={officeSpace.total_seats || ''}
              onChange={(e) => updateOfficeSpace('total_seats', parseInt(e.target.value) || undefined)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Available Seats</label>
            <input
              type="number"
              value={officeSpace.available_seats || ''}
              onChange={(e) => updateOfficeSpace('available_seats', parseInt(e.target.value) || undefined)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total Cabins</label>
            <input
              type="number"
              value={officeSpace.cabin_count || ''}
              onChange={(e) => updateOfficeSpace('cabin_count', parseInt(e.target.value) || undefined)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Available Cabins</label>
            <input
              type="number"
              value={officeSpace.available_cabins || ''}
              onChange={(e) => updateOfficeSpace('available_cabins', parseInt(e.target.value) || undefined)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Desk Count</label>
            <input
              type="number"
              value={officeSpace.desk_count || ''}
              onChange={(e) => updateOfficeSpace('desk_count', parseInt(e.target.value) || undefined)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Meeting Rooms</label>
            <input
              type="number"
              value={officeSpace.meeting_rooms_count || ''}
              onChange={(e) => updateOfficeSpace('meeting_rooms_count', parseInt(e.target.value) || undefined)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Seat/Cabin Configurations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users size={16} />
            Seat/Cabin Configurations
          </h4>
          <button
            type="button"
            onClick={addSeatConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
          >
            <Plus size={14} />
            Add Configuration
          </button>
        </div>

        {seatConfigs.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <Users size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No configurations added yet</p>
            <button
              type="button"
              onClick={addSeatConfig}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Add your first configuration
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {seatConfigs.map((config, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Configuration #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSeatConfig(index)}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Type</label>
                    <select
                      value={config.type}
                      onChange={(e) => updateSeatConfig(index, 'type', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {SEAT_CONFIG_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Capacity</label>
                    <input
                      type="number"
                      value={config.capacity || ''}
                      onChange={(e) => updateSeatConfig(index, 'capacity', parseInt(e.target.value) || 1)}
                      placeholder="1"
                      min="1"
                      className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Count</label>
                    <input
                      type="number"
                      value={config.count || ''}
                      onChange={(e) => updateSeatConfig(index, 'count', parseInt(e.target.value) || 1)}
                      placeholder="1"
                      min="1"
                      className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Price/Seat</label>
                    <input
                      type="number"
                      value={config.price_per_seat || ''}
                      onChange={(e) => updateSeatConfig(index, 'price_per_seat', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Price Type</label>
                    <select
                      value={config.price_type || 'monthly'}
                      onChange={(e) => updateSeatConfig(index, 'price_type', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <DollarSign size={16} />
          Pricing Details
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Per Seat (Monthly)</label>
            <input
              type="number"
              value={officeSpace.price_per_seat_monthly || ''}
              onChange={(e) => updateOfficeSpace('price_per_seat_monthly', parseInt(e.target.value) || undefined)}
              placeholder="₹0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Per Seat (Daily)</label>
            <input
              type="number"
              value={officeSpace.price_per_seat_daily || ''}
              onChange={(e) => updateOfficeSpace('price_per_seat_daily', parseInt(e.target.value) || undefined)}
              placeholder="₹0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Per Cabin (Monthly)</label>
            <input
              type="number"
              value={officeSpace.price_per_cabin_monthly || ''}
              onChange={(e) => updateOfficeSpace('price_per_cabin_monthly', parseInt(e.target.value) || undefined)}
              placeholder="₹0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Meeting Room (Hourly)</label>
            <input
              type="number"
              value={officeSpace.meeting_room_hourly_rate || ''}
              onChange={(e) => updateOfficeSpace('meeting_room_hourly_rate', parseInt(e.target.value) || undefined)}
              placeholder="₹0"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Min Lease Term (months)</label>
            <input
              type="number"
              value={officeSpace.lease_term_min || ''}
              onChange={(e) => updateOfficeSpace('lease_term_min', parseInt(e.target.value) || undefined)}
              placeholder="1"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Max Lease Term (months)</label>
            <input
              type="number"
              value={officeSpace.lease_term_max || ''}
              onChange={(e) => updateOfficeSpace('lease_term_max', parseInt(e.target.value) || undefined)}
              placeholder="36"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Access & Operations */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock size={16} />
          Access & Operations
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Access Hours</label>
            <select
              value={officeSpace.access_hours || ''}
              onChange={(e) => updateOfficeSpace('access_hours', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select Access Hours</option>
              {ACCESS_HOURS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          {officeSpace.access_hours === 'custom' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Custom Hours</label>
              <input
                type="text"
                value={officeSpace.custom_access_hours || ''}
                onChange={(e) => updateOfficeSpace('custom_access_hours', e.target.value)}
                placeholder="e.g., Mon-Sat 8AM-8PM"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          )}
        </div>

        {/* Flexibility Options */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Minimum Commitment</label>
            <input
              type="text"
              value={officeSpace.minimum_commitment || ''}
              onChange={(e) => updateOfficeSpace('minimum_commitment', e.target.value)}
              placeholder="e.g., 1 month"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Notice Period</label>
            <input
              type="text"
              value={officeSpace.notice_period || ''}
              onChange={(e) => updateOfficeSpace('notice_period', e.target.value)}
              placeholder="e.g., 30 days"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'reception_available', label: 'Reception' },
            { key: 'mail_handling', label: 'Mail Handling' },
            { key: 'parking_included', label: 'Parking' },
            { key: 'pantry_cafeteria', label: 'Pantry/Cafeteria' },
            { key: 'flexible_terms', label: 'Flexible Terms' },
          ].map(({ key, label }) => (
            <label
              key={key}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all",
                officeSpace[key as keyof OfficeSpaceData]
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-muted/30 hover:border-primary/50"
              )}
            >
              <input
                type="checkbox"
                checked={!!officeSpace[key as keyof OfficeSpaceData]}
                onChange={(e) => updateOfficeSpace(key, e.target.checked)}
                className="sr-only"
              />
              <span className="text-xs font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Coworking Specific Fields */}
      {officeSpace.space_type === 'coworking' && (
        <div className="space-y-4 p-4 border border-cyan-200 bg-cyan-50/30 rounded-lg">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users size={16} className="text-cyan-600" />
            Coworking Space Features
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Phone Booths</label>
              <input
                type="number"
                value={officeSpace.phone_booths_count || ''}
                onChange={(e) => updateOfficeSpace('phone_booths_count', parseInt(e.target.value) || undefined)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Day Pass Price</label>
              <input
                type="number"
                value={officeSpace.day_pass_price || ''}
                onChange={(e) => updateOfficeSpace('day_pass_price', parseInt(e.target.value) || undefined)}
                placeholder="₹0"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { key: 'community_events', label: 'Community Events' },
              { key: 'networking_lounge', label: 'Networking Lounge' },
              { key: 'breakout_areas', label: 'Breakout Areas' },
              { key: 'day_pass_available', label: 'Day Pass Available' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all",
                  officeSpace[key as keyof OfficeSpaceData]
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-700"
                    : "border-border bg-white hover:border-cyan-300"
                )}
              >
                <input
                  type="checkbox"
                  checked={!!officeSpace[key as keyof OfficeSpaceData]}
                  onChange={(e) => updateOfficeSpace(key, e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs font-medium">{label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">Membership Tiers Offered</label>
            <div className="flex flex-wrap gap-2">
              {MEMBERSHIP_TIERS_OPTIONS.map(tier => {
                const tiers = officeSpace.membership_tiers || []
                const isSelected = tiers.includes(tier)
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        updateOfficeSpace('membership_tiers', tiers.filter(t => t !== tier))
                      } else {
                        updateOfficeSpace('membership_tiers', [...tiers, tier])
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border transition-all",
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-700"
                        : "border-border bg-white hover:border-cyan-300"
                    )}
                  >
                    {tier}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Managed Office Specific Fields */}
      {officeSpace.space_type === 'managed_office' && (
        <div className="space-y-4 p-4 border border-emerald-200 bg-emerald-50/30 rounded-lg">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 size={16} className="text-emerald-600" />
            Managed Office Features
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Internet Speed (Mbps)</label>
              <input
                type="number"
                value={officeSpace.internet_speed_mbps || ''}
                onChange={(e) => updateOfficeSpace('internet_speed_mbps', parseInt(e.target.value) || undefined)}
                placeholder="100"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Lock-in Period (months)</label>
              <input
                type="number"
                value={officeSpace.minimum_lock_in_months || ''}
                onChange={(e) => updateOfficeSpace('minimum_lock_in_months', parseInt(e.target.value) || undefined)}
                placeholder="12"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Scalability Options</label>
              <input
                type="text"
                value={officeSpace.scalability_options || ''}
                onChange={(e) => updateOfficeSpace('scalability_options', e.target.value)}
                placeholder="e.g., Can expand to adjacent floors"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { key: 'dedicated_floor', label: 'Dedicated Floor' },
              { key: 'customizable_branding', label: 'Custom Branding Allowed' },
              { key: 'dedicated_reception', label: 'Dedicated Reception' },
              { key: 'server_room', label: 'Server Room' },
              { key: 'ups_backup', label: 'UPS Backup' },
              { key: 'dedicated_internet', label: 'Dedicated Internet Line' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all",
                  officeSpace[key as keyof OfficeSpaceData]
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                    : "border-border bg-white hover:border-emerald-300"
                )}
              >
                <input
                  type="checkbox"
                  checked={!!officeSpace[key as keyof OfficeSpaceData]}
                  onChange={(e) => updateOfficeSpace(key, e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Private Office Specific Fields */}
      {officeSpace.space_type === 'private_office' && (
        <div className="space-y-4 p-4 border border-amber-200 bg-amber-50/30 rounded-lg">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield size={16} className="text-amber-600" />
            Private Office Features
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Executive Cabins</label>
              <input
                type="number"
                value={officeSpace.executive_cabins_count || ''}
                onChange={(e) => updateOfficeSpace('executive_cabins_count', parseInt(e.target.value) || undefined)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Conference Room Capacity</label>
              <input
                type="number"
                value={officeSpace.conference_room_capacity || ''}
                onChange={(e) => updateOfficeSpace('conference_room_capacity', parseInt(e.target.value) || undefined)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { key: 'private_entrance', label: 'Private Entrance' },
              { key: 'dedicated_washroom', label: 'Dedicated Washroom' },
              { key: 'board_room_available', label: 'Board Room' },
              { key: 'visitor_management', label: 'Visitor Management' },
              { key: 'corner_office', label: 'Corner Office' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all",
                  officeSpace[key as keyof OfficeSpaceData]
                    ? "border-amber-500 bg-amber-500/10 text-amber-700"
                    : "border-border bg-white hover:border-amber-300"
                )}
              >
                <input
                  type="checkbox"
                  checked={!!officeSpace[key as keyof OfficeSpaceData]}
                  onChange={(e) => updateOfficeSpace(key, e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Space Specifications - Shown for all non-virtual types */}
      {officeSpace.space_type && officeSpace.space_type !== 'virtual_office' && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers size={16} />
            Space Specifications
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Floor Plate (Sqft)</label>
              <input
                type="number"
                value={officeSpace.floor_plate_sqft || ''}
                onChange={(e) => updateOfficeSpace('floor_plate_sqft', parseInt(e.target.value) || undefined)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Ceiling Height (ft)</label>
              <input
                type="number"
                value={officeSpace.ceiling_height_ft || ''}
                onChange={(e) => updateOfficeSpace('ceiling_height_ft', parseFloat(e.target.value) || undefined)}
                placeholder="10"
                step="0.5"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Workstation Density</label>
              <select
                value={officeSpace.workstation_density || ''}
                onChange={(e) => updateOfficeSpace('workstation_density', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select Density</option>
                {WORKSTATION_DENSITY.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">AC Type</label>
              <select
                value={officeSpace.ac_type || ''}
                onChange={(e) => updateOfficeSpace('ac_type', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select AC Type</option>
                {AC_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Power Load (KVA)</label>
              <input
                type="number"
                value={officeSpace.power_load_kva || ''}
                onChange={(e) => updateOfficeSpace('power_load_kva', parseFloat(e.target.value) || undefined)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Security Deposit (months)</label>
              <input
                type="number"
                value={officeSpace.security_deposit_months || ''}
                onChange={(e) => updateOfficeSpace('security_deposit_months', parseInt(e.target.value) || undefined)}
                placeholder="3"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Electricity/Unit</label>
              <input
                type="number"
                value={officeSpace.electricity_charges_per_unit || ''}
                onChange={(e) => updateOfficeSpace('electricity_charges_per_unit', parseFloat(e.target.value) || undefined)}
                placeholder="₹0"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { key: 'natural_lighting', label: 'Natural Lighting' },
              { key: 'fire_safety_compliant', label: 'Fire Safety Compliant' },
              { key: 'wheelchair_accessible', label: 'Wheelchair Accessible' },
              { key: 'maintenance_included', label: 'Maintenance Included' },
              { key: 'electricity_included', label: 'Electricity Included' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all",
                  officeSpace[key as keyof OfficeSpaceData]
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-muted/30 hover:border-primary/50"
                )}
              >
                <input
                  type="checkbox"
                  checked={!!officeSpace[key as keyof OfficeSpaceData]}
                  onChange={(e) => updateOfficeSpace(key, e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Office Amenities */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Office Amenities</h4>
        <div className="flex flex-wrap gap-2">
          {OFFICE_AMENITIES.map(amenity => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-all",
                selectedAmenities.includes(amenity)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/30 hover:border-primary/50"
              )}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Commercial Lease Details */}
      {(formData.property_category === 'commercial' || showCommercialLease) && (
        <div className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Commercial Lease Details</h4>
            <button
              type="button"
              onClick={() => setShowCommercialLease(!showCommercialLease)}
              className="text-xs text-primary hover:underline"
            >
              {showCommercialLease ? 'Hide' : 'Show'}
            </button>
          </div>

          {showCommercialLease && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Lease Type</label>
                  <select
                    value={commercialLease.lease_type || ''}
                    onChange={(e) => updateCommercialLease('lease_type', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select Type</option>
                    {LEASE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Rent per Sq.ft</label>
                  <input
                    type="number"
                    value={commercialLease.rent_per_sqft || ''}
                    onChange={(e) => updateCommercialLease('rent_per_sqft', parseInt(e.target.value) || undefined)}
                    placeholder="₹0"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">CAM Charges</label>
                  <input
                    type="number"
                    value={commercialLease.cam_charges || ''}
                    onChange={(e) => updateCommercialLease('cam_charges', parseInt(e.target.value) || undefined)}
                    placeholder="₹0"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Security Deposit (months)</label>
                  <input
                    type="number"
                    value={commercialLease.security_deposit_months || ''}
                    onChange={(e) => updateCommercialLease('security_deposit_months', parseInt(e.target.value) || undefined)}
                    placeholder="6"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Lock-in Period (months)</label>
                  <input
                    type="number"
                    value={commercialLease.lock_in_period_months || ''}
                    onChange={(e) => updateCommercialLease('lock_in_period_months', parseInt(e.target.value) || undefined)}
                    placeholder="36"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Agreement Duration (years)</label>
                  <input
                    type="number"
                    value={commercialLease.agreement_duration_years || ''}
                    onChange={(e) => updateCommercialLease('agreement_duration_years', parseInt(e.target.value) || undefined)}
                    placeholder="9"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Rent Escalation</label>
                  <input
                    type="text"
                    value={commercialLease.rent_escalation || ''}
                    onChange={(e) => updateCommercialLease('rent_escalation', e.target.value)}
                    placeholder="e.g., 5% annually"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Fit-out Allowance</label>
                  <input
                    type="number"
                    value={commercialLease.fit_out_allowance || ''}
                    onChange={(e) => updateCommercialLease('fit_out_allowance', parseInt(e.target.value) || undefined)}
                    placeholder="₹0"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Rent Free Period</label>
                  <input
                    type="text"
                    value={commercialLease.rent_free_period || ''}
                    onChange={(e) => updateCommercialLease('rent_free_period', e.target.value)}
                    placeholder="e.g., 3 months"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
