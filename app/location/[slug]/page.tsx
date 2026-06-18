'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  ArrowLeft,
  Zap,
  Building2,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatPriceToIndian, getPropertyUrl, BUDGET_RANGES, parseBudgetRange } from '@/lib/utils'
import LocationHero from '@/components/property/location-hero'
import LuxuryPropertyCard from '@/components/property/luxury-property-card'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

interface Location {
  _id: string
  name: string
  slug: string
  type: string
  state?: string
  city?: string
  description?: string
  featured_image?: string
  meta_title?: string
  meta_description?: string
}

interface Property {
  _id: string
  slug?: string
  property_name: string
  main_thumbnail: string
  lowest_price: number
  bedrooms: number
  bathrooms: number
  area_sqft: number
  address: string
  city: string
  listing_type?: string
  project_status?: string
  rera_registered?: boolean
  property_type?: string
  carpet_area?: number
  super_area?: number
  max_price?: number
  price_range?: string
  is_featured?: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "independent_floor", label: "Independent Floor" },
  { value: "penthouse", label: "Penthouse" },
  { value: "studio", label: "Studio" },
]

const PROJECT_STATUS = [
  { value: "pre_launch", label: "Pre Launch" },
  { value: "new_launch", label: "New Launch" },
  { value: "launched", label: "Launched" },
  { value: "under_construction", label: "Under Construction" },
  { value: "ready_to_move", label: "Ready to Move" },
]

const SEGMENTS = [
  { value: "luxury", label: "Luxury" },
  { value: "premium", label: "Premium" },
  { value: "mid", label: "Mid Range" },
  { value: "affordable", label: "Affordable" },
]

export default function LocationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = (params.slug as string) || ''
  const currentPage = parseInt(searchParams.get('page') || '1')
  const viewParam = searchParams.get('view') || 'grid'

  const [location, setLocation] = useState<Location | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(viewParam as 'grid' | 'list')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    property_type: searchParams.get('property_type') || '',
    project_status: searchParams.get('project_status') || '',
    segment: searchParams.get('segment') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    rera_registered: searchParams.get('rera_registered') || '',
  })

  const buildQueryString = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    params.set('page', String(currentPage))
    return params.toString()
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const queryString = buildQueryString()
        const res = await fetch(`/api/locations/${slug}?${queryString}`)
        if (res.ok) {
          const data = await res.json()
          setLocation(data.location)
          setProperties(data.properties)
          setPagination(data.pagination)
        }
      } catch (error) {
        console.error('[v0] Error fetching location:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchData()
  }, [slug, currentPage, filters])

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    params.set('page', '1')
    params.set('view', viewMode)
    router.push(`/location/${slug}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setFilters({
      property_type: '',
      project_status: '',
      segment: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      rera_registered: '',
    })
    router.push(`/location/${slug}?view=${viewMode}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    params.set('page', String(page))
    params.set('view', viewMode)
    router.push(`/location/${slug}?${params.toString()}`)
  }

  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    params.set('page', String(currentPage))
    params.set('view', mode)
    router.push(`/location/${slug}?${params.toString()}`)
  }

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value
  ).length

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-[var(--luxury-cream)]">
          {/* Hero Skeleton */}
          <div className="h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />

          {/* Content Skeleton */}
          <div className="luxury-section max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="luxury-card h-96 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!location) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-[var(--luxury-cream)] flex items-center justify-center">
          <div className="text-center space-y-6">
            <MapPin className="h-16 w-16 mx-auto text-gray-300" />
            <div>
              <h1 className="text-3xl font-bold text-[var(--luxury-navy)] mb-2">Location Not Found</h1>
              <p className="text-gray-600 mb-6">
                The location you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
            </div>
            <Link href="/properties" className="luxury-button inline-block">
              Browse All Properties
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-[var(--luxury-cream)]">
        {/* Hero Section */}
        <LocationHero
          name={location.name}
          description={location.description}
          featured_image={location.featured_image}
          propertyCount={pagination?.total || 0}
        />

        {/* Breadcrumb & Controls */}
        <div className="luxury-section bg-white border-b border-[var(--luxury-border)]">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Link href="/properties" className="flex items-center gap-1 text-[var(--luxury-navy)] hover:text-[var(--luxury-gold)] transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">All Properties</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-600">Locations</span>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-[var(--luxury-navy)] font-semibold">{location.name}</span>
            </div>

            {/* Filter Controls */}
            <div className="bg-card border border-border rounded-xl mb-6">
              {/* Main Filter Row */}
              <div className="p-4 flex flex-col md:flex-row gap-3">
                <div className="flex gap-2 flex-wrap flex-1">
                  <select
                    value={filters.property_type}
                    onChange={(e) => updateFilter('property_type', e.target.value)}
                    className="px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All Types</option>
                    {PROPERTY_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>

                  <select
                    value={filters.project_status}
                    onChange={(e) => updateFilter('project_status', e.target.value)}
                    className="px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Any Status</option>
                    {PROJECT_STATUS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>

                  <select
                    value={filters.minPrice && filters.maxPrice ? `${filters.minPrice}-${filters.maxPrice}` : filters.minPrice ? `${filters.minPrice}-` : ''}
                    onChange={(e) => {
                      const { min, max } = parseBudgetRange(e.target.value)
                      if (min || max) {
                        updateFilter('minPrice', min ? String(min) : '')
                        updateFilter('maxPrice', max ? String(max) : '')
                      } else {
                        updateFilter('minPrice', '')
                        updateFilter('maxPrice', '')
                      }
                    }}
                    className="px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Any Budget</option>
                    {BUDGET_RANGES.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={cn(
                      "bg-transparent gap-2",
                      showAdvanced && "bg-primary/5 border-primary/30"
                    )}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Advanced
                    {activeFilterCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-primary text-primary-foreground rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                    {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>

                  {activeFilterCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvanced && (
                <div className="px-4 pb-4 border-t border-border pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Segment</label>
                      <select
                        value={filters.segment}
                        onChange={(e) => updateFilter('segment', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                      >
                        <option value="">All Segments</option>
                        {SEGMENTS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Min Price</label>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Max Price</label>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Min Area (sqft)</label>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minArea}
                        onChange={(e) => updateFilter('minArea', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Max Area (sqft)</label>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxArea}
                        onChange={(e) => updateFilter('maxArea', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.rera_registered === 'true'}
                          onChange={(e) => updateFilter('rera_registered', e.target.checked ? 'true' : '')}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-muted-foreground">RERA Verified Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-[var(--luxury-border)]">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--luxury-gold)]" />
                <span className="text-sm font-semibold text-[var(--luxury-navy)]">
                  {pagination?.total || 0} Premium Properties
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white border border-[var(--luxury-border)] rounded-lg p-1">
                <button
                  onClick={() => handleViewChange('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[var(--luxury-navy)] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewChange('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[var(--luxury-navy)] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="luxury-section max-w-7xl mx-auto">
          {properties.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <LuxuryPropertyCard key={property._id} {...property} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <Link key={property._id} href={getPropertyUrl(property)}>
                      <div className="luxury-card p-0 flex overflow-hidden h-48 hover:shadow-lg transition-shadow">
                        {/* Image */}
                        <div className="relative w-56 flex-shrink-0 bg-gray-100 overflow-hidden">
                          <img
                            src={property.main_thumbnail || '/images/placeholder.jpg'}
                            alt={property.property_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-[var(--luxury-navy)] mb-2 line-clamp-2">
                              {property.property_name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                              <MapPin className="h-4 w-4 text-[var(--luxury-gold)]" />
                              {property.address || property.city}
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              {property.bedrooms > 0 && <span>{property.bedrooms} BHK</span>}
                              {property.bathrooms > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{property.bathrooms} Baths</span>
                                </>
                              )}
                              {property.area_sqft > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{Math.round(property.area_sqft)} Sqft</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-[var(--luxury-border)]">
                            <p className="text-2xl font-bold text-[var(--luxury-navy)]">
                              {property.price_range || formatPriceToIndian(property.lowest_price)}
                            </p>
                            <span className="text-sm font-semibold text-[var(--luxury-gold)]">View More →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-[var(--luxury-border)]">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 text-[var(--luxury-navy)] border border-[var(--luxury-border)] rounded-lg hover:bg-[var(--luxury-navy)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(pagination.totalPages, 5) },
                      (_, i) => {
                        let pageNum: number
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={cn(
                              'w-8 h-8 rounded-lg font-semibold transition-colors',
                              currentPage === pageNum
                                ? 'bg-[var(--luxury-navy)] text-white'
                                : 'border border-[var(--luxury-border)] text-[var(--luxury-navy)] hover:border-[var(--luxury-navy)]'
                            )}
                          >
                            {pageNum}
                          </button>
                        )
                      }
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="p-2 text-[var(--luxury-navy)] border border-[var(--luxury-border)] rounded-lg hover:bg-[var(--luxury-navy)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
              <p className="text-gray-500 mb-6">
                We don&apos;t have any properties available in {location.name} matching your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="luxury-button inline-block mb-4"
              >
                Clear Filters
              </button>
              <br />
              <Link href="/properties" className="luxury-button inline-block">
                Browse All Properties
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
