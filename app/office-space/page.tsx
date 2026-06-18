'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Grid3X3, 
  List, 
  Zap, 
  Building2, 
  Users, 
  Clock,
  Filter,
  X
} from 'lucide-react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import LuxuryPropertyCard from '@/components/property/luxury-property-card'
import useSWR from 'swr'
import { getPropertyUrl, cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Office space types
const SPACE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'coworking', label: 'Coworking Space' },
  { value: 'managed_office', label: 'Managed Office' },
  { value: 'private_office', label: 'Private Office' },
  { value: 'virtual_office', label: 'Virtual Office' },
  { value: 'hot_desk', label: 'Hot Desk' },
  { value: 'dedicated_desk', label: 'Dedicated Desk' },
  { value: 'meeting_room', label: 'Meeting Room' },
]

const BUILDING_GRADES = [
  { value: '', label: 'All Grades' },
  { value: 'grade_a_plus', label: 'Grade A+' },
  { value: 'grade_a', label: 'Grade A' },
  { value: 'grade_b', label: 'Grade B' },
  { value: 'premium', label: 'Premium' },
]

const FIT_OUT_OPTIONS = [
  { value: '', label: 'All Options' },
  { value: 'plug_and_play', label: 'Plug and Play' },
  { value: 'fully_fitted', label: 'Fully Fitted' },
  { value: 'warm_shell', label: 'Warm Shell' },
  { value: 'bare_shell', label: 'Bare Shell' },
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
]

interface Property {
  _id: string
  property_name: string
  slug?: string
  main_thumbnail?: string
  address?: string
  city?: string
  bedrooms?: number
  bathrooms?: number
  carpet_area?: number
  super_area?: number
  area_sqft?: number
  lowest_price?: number
  max_price?: number
  price_range?: string
  project_status?: string
  listing_type?: string
  property_type?: string
  rera_registered?: boolean
  is_featured?: boolean
  office_space?: {
    space_type?: string
    total_seats?: number
    available_seats?: number
    cabin_count?: number
    available_cabins?: number
    price_per_seat_monthly?: number
    building_grade?: string
    fit_out_status?: string
    access_hours?: string
  }
}

export default function OfficeSpacePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const sortBy = searchParams.get('sort') || 'featured'
  const viewMode = searchParams.get('view') || 'grid'
  const spaceType = searchParams.get('space_type') || ''
  const buildingGrade = searchParams.get('building_grade') || ''
  const fitOutStatus = searchParams.get('fit_out_status') || ''
  const minSeats = searchParams.get('min_seats') || ''

  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>(viewMode as 'grid' | 'list')
  const [showFilters, setShowFilters] = useState(false)

  // Build query string for office space properties
  const buildQueryString = () => {
    const params = new URLSearchParams()
    
    // Property types for office spaces
    const officeTypes = ['office', 'office_space', 'coworking', 'managed_office', 'virtual_office', 'private_office', 'sco']
    officeTypes.forEach(type => params.append('property_type', type))
    
    params.set('sort', sortBy)
    params.set('limit', '20')
    
    if (spaceType) params.set('space_type', spaceType)
    if (buildingGrade) params.set('building_grade', buildingGrade)
    if (fitOutStatus) params.set('fit_out_status', fitOutStatus)
    if (minSeats) params.set('min_seats', minSeats)
    
    return params.toString()
  }

  const queryString = buildQueryString()
  const { data, isLoading } = useSWR(
    `/api/properties?${queryString}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const properties: Property[] = data?.properties || []

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/office-space?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/office-space')
  }

  const hasActiveFilters = spaceType || buildingGrade || fitOutStatus || minSeats

  // Helper to display office space info
  const getOfficeInfo = (property: Property) => {
    const os = property.office_space
    if (!os) return null
    
    const info: string[] = []
    if (os.available_seats) info.push(`${os.available_seats} seats`)
    if (os.available_cabins) info.push(`${os.available_cabins} cabins`)
    if (os.price_per_seat_monthly) info.push(`₹${os.price_per_seat_monthly.toLocaleString()}/seat`)
    
    return info.join(' • ')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-[var(--luxury-cream)]">
        {/* Hero Section */}
        <div className="luxury-section bg-white border-b border-[var(--luxury-border)]">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="flex items-center gap-1 text-[var(--luxury-navy)] hover:text-[var(--luxury-gold)] transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Home</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-600">Office Spaces</span>
            </div>

            {/* Title & Description */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-16 bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--luxury-navy)] rounded-full" />
                <span className="text-[var(--luxury-gold)] text-sm font-semibold uppercase tracking-wider">Premium Workspaces</span>
              </div>
              <h1 className="luxury-heading mb-3">Office Spaces</h1>
              <p className="luxury-subheading max-w-2xl">
                Discover premium office spaces including coworking, managed offices, private offices, and virtual offices for businesses of all sizes.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-[var(--luxury-border)]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[var(--luxury-gold)]" />
                  <span className="text-sm font-semibold text-[var(--luxury-navy)]">
                    {isLoading ? 'Loading...' : `${properties.length} Office Spaces Found`}
                  </span>
                </div>
                
                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span>Coworking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>Managed Offices</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Flexible Terms</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                    showFilters || hasActiveFilters
                      ? "bg-[var(--luxury-navy)] text-white border-[var(--luxury-navy)]"
                      : "bg-white text-[var(--luxury-navy)] border-[var(--luxury-border)] hover:border-[var(--luxury-navy)]"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                      {[spaceType, buildingGrade, fitOutStatus, minSeats].filter(Boolean).length}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="px-3 py-2 bg-white border border-[var(--luxury-border)] rounded-lg text-sm font-medium text-[var(--luxury-navy)] hover:border-[var(--luxury-navy)] transition-colors cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white border border-[var(--luxury-border)] rounded-lg p-1">
                  <button
                    onClick={() => {
                      setViewLayout('grid')
                      updateFilter('view', 'grid')
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      viewLayout === 'grid'
                        ? 'bg-[var(--luxury-navy)] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setViewLayout('list')
                      updateFilter('view', 'list')
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      viewLayout === 'list'
                        ? 'bg-[var(--luxury-navy)] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="py-4 border-t border-[var(--luxury-border)]">
                <div className="flex flex-wrap items-end gap-4">
                  {/* Space Type */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">Space Type</label>
                    <select
                      value={spaceType}
                      onChange={(e) => updateFilter('space_type', e.target.value)}
                      className="px-3 py-2 bg-white border border-[var(--luxury-border)] rounded-lg text-sm"
                    >
                      {SPACE_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Building Grade */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">Building Grade</label>
                    <select
                      value={buildingGrade}
                      onChange={(e) => updateFilter('building_grade', e.target.value)}
                      className="px-3 py-2 bg-white border border-[var(--luxury-border)] rounded-lg text-sm"
                    >
                      {BUILDING_GRADES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fit-out Status */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">Fit-out Status</label>
                    <select
                      value={fitOutStatus}
                      onChange={(e) => updateFilter('fit_out_status', e.target.value)}
                      className="px-3 py-2 bg-white border border-[var(--luxury-border)] rounded-lg text-sm"
                    >
                      {FIT_OUT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Min Seats */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">Min Seats</label>
                    <input
                      type="number"
                      value={minSeats}
                      onChange={(e) => updateFilter('min_seats', e.target.value)}
                      placeholder="Any"
                      className="w-24 px-3 py-2 bg-white border border-[var(--luxury-border)] rounded-lg text-sm"
                    />
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Grid/List */}
        <div className="luxury-section max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="luxury-card h-96 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Office Spaces Found</h3>
              <p className="text-gray-500 mb-6">
                We couldn&apos;t find any office spaces matching your criteria.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="luxury-button inline-block"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : viewLayout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property._id} className="relative">
                  <LuxuryPropertyCard {...property} />
                  {/* Office Space Badge */}
                  {property.office_space?.space_type && (
                    <div className="absolute top-4 left-4 px-2 py-1 bg-[var(--luxury-navy)]/90 text-white text-xs font-medium rounded-md backdrop-blur-sm">
                      {SPACE_TYPES.find(t => t.value === property.office_space?.space_type)?.label || property.office_space.space_type}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property._id} className="luxury-card p-0 flex overflow-hidden h-52">
                  {/* Image */}
                  <div className="relative w-64 flex-shrink-0 bg-gray-100">
                    <img
                      src={property.main_thumbnail || '/images/placeholder.jpg'}
                      alt={property.property_name}
                      className="w-full h-full object-cover"
                    />
                    {/* Office Space Badge */}
                    {property.office_space?.space_type && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--luxury-navy)]/90 text-white text-xs font-medium rounded-md backdrop-blur-sm">
                        {SPACE_TYPES.find(t => t.value === property.office_space?.space_type)?.label || property.office_space.space_type}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <Link href={getPropertyUrl(property)}>
                        <h3 className="text-lg font-bold text-[var(--luxury-navy)] hover:text-[var(--luxury-gold)] transition-colors mb-2">
                          {property.property_name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 text-[var(--luxury-gold)]" />
                        {property.address || property.city}
                      </div>
                      
                      {/* Office Space Info */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        {property.office_space?.available_seats && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-[var(--luxury-gold)]" />
                            <span>{property.office_space.available_seats} seats available</span>
                          </div>
                        )}
                        {property.office_space?.available_cabins && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-[var(--luxury-gold)]" />
                            <span>{property.office_space.available_cabins} cabins</span>
                          </div>
                        )}
                        {property.office_space?.access_hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-[var(--luxury-gold)]" />
                            <span>{property.office_space.access_hours === '24_7' ? '24/7 Access' : property.office_space.access_hours}</span>
                          </div>
                        )}
                        {property.area_sqft && (
                          <span>{Math.round(property.area_sqft).toLocaleString()} Sqft</span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {property.office_space?.building_grade && (
                          <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">
                            {BUILDING_GRADES.find(g => g.value === property.office_space?.building_grade)?.label || property.office_space.building_grade}
                          </span>
                        )}
                        {property.office_space?.fit_out_status && (
                          <span className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded-full">
                            {FIT_OUT_OPTIONS.find(f => f.value === property.office_space?.fit_out_status)?.label || property.office_space.fit_out_status}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {property.office_space?.price_per_seat_monthly ? (
                          <div>
                            <p className="text-2xl font-bold text-[var(--luxury-navy)]">
                              ₹{property.office_space.price_per_seat_monthly.toLocaleString()}
                              <span className="text-sm font-normal text-gray-500">/seat/month</span>
                            </p>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold text-[var(--luxury-navy)]">
                            {property.price_range || `₹${((property.lowest_price || 0) / 10000000).toFixed(1)}Cr`}
                          </p>
                        )}
                      </div>
                      <Link href={getPropertyUrl(property)} className="luxury-button">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
