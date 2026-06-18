'use client'

import { useEffect, useState, useMemo } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatPriceToIndian } from '@/lib/utils'
import LocationHero from '@/components/property/location-hero'
import LuxuryPropertyCard from '@/components/property/luxury-property-card'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import useSWR from 'swr'

// Rich location components
import {
  LocationRichHero,
  LocationFilterPills,
  WhyPremiumSection,
  PriceTrendsSection,
  ConnectivitySection,
  NearbyInfrastructureSection,
  FAQSection,
  SectorBreakdownSection,
} from '@/components/location'
import { getLocationContent, type LocationContent } from '@/data/location-content'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Location slugs
const LOCATION_SLUGS = ['golf-course-road', 'golf-course-extn-road', 'dwarka-expressway', 'southern-peripheral-road', 'sohna', 'new-gurgaon', 'nh-48', 'manesar']

// Type slug to query filter mapping - Enhanced for comprehensive matching
const TYPE_SLUG_MAP: Record<string, { 
  field: string; 
  value: string | string[] | boolean;
  altField?: string;
  altValue?: string | string[];
  categoryMatch?: string[];
}> = {
  'ready-to-move': { 
    field: 'project_status', 
    value: 'ready_to_move',
    altField: 'possession_type',
    altValue: 'ready'
  },
  'new-launch': { 
    field: 'listing_type', 
    value: 'new',
    altField: 'project_status',
    altValue: 'launched'
  },
  'upcoming': { 
    field: 'project_status', 
    value: 'under_construction'
  },
  'luxury-apartments': { 
    field: 'property_type', 
    value: ['apartment', 'penthouse', 'villa', 'duplex', 'triplex'],
    altField: 'target_segment',
    altValue: ['luxury', 'ultra_luxury', 'premium']
  },
  'plots-and-lands': { 
    field: 'property_type', 
    value: ['plot', 'land', 'agricultural', 'industrial_land', 'farmland', 'residential_plot', 'commercial_plot']
  },
  'commercial-properties': { 
    field: 'property_type', 
    value: ['office', 'shop', 'commercial', 'sco', 'scf', 'warehouse', 'showroom', 'retail', 'multiplex', 'office_space', 'coworking', 'managed_office'],
    categoryMatch: ['commercial', 'mixed_use']
  },
  'furnished-flats': { 
    field: 'furnished_type', 
    value: 'fully_furnished'
  },
  'office-space': { 
    field: 'property_type', 
    value: ['office', 'office_space', 'coworking', 'managed_office', 'virtual_office', 'private_office', 'sco']
  },
}

// Nice display names for property types
const TYPE_DISPLAY_NAMES: Record<string, string> = {
  'ready-to-move': 'Ready to Move',
  'new-launch': 'New Launch',
  'upcoming': 'Upcoming Projects',
  'luxury-apartments': 'Luxury Apartments',
  'plots-and-lands': 'Plots and Lands',
  'commercial-properties': 'Commercial Properties',
  'furnished-flats': 'Furnished Flats',
  'office-space': 'Office Spaces',
}

const TYPE_DESCRIPTIONS: Record<string, string> = {
  'ready-to-move': 'Ready to move in properties available now. Move to your dream home immediately.',
  'new-launch': 'Recently launched projects from top developers. Be among the first to own.',
  'upcoming': 'Upcoming projects launching soon. Book and invest early at pre-launch prices.',
  'luxury-apartments': 'Premium luxury apartments with world-class amenities and fine living.',
  'plots-and-lands': 'Prime plots and land parcels for your dream home or investment.',
  'commercial-properties': 'Premium commercial spaces for offices, shops, and businesses.',
  'furnished-flats': 'Fully furnished apartments ready to move in with complete furnishing.',
  'office-space': 'Premium office spaces including coworking, managed offices, and private offices for businesses of all sizes.',
}

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
  price_range?: string
  is_featured?: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
]

export default function SlugPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const currentPage = parseInt(searchParams.get('page') || '1')
  const sortBy = searchParams.get('sort') || 'featured'
  const viewMode = searchParams.get('view') || 'grid'

  const [location, setLocation] = useState<Location | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>(viewMode as 'grid' | 'list')
  const [pageType, setPageType] = useState<'location' | 'type' | 'invalid'>('location')

  // Get rich location content if available
  const richContent = useMemo(() => getLocationContent(slug), [slug])

  // Check if the slug is valid (either a location or a property type)
  const isValidSlug = LOCATION_SLUGS.includes(slug) || TYPE_SLUG_MAP[slug]

  // Determine if this is a location or property type
  useEffect(() => {
    if (LOCATION_SLUGS.includes(slug)) {
      setPageType('location')
    } else if (TYPE_SLUG_MAP[slug]) {
      setPageType('type')
    } else {
      setPageType('invalid')
    }
  }, [slug])

  // Fetch location data and properties together
  useEffect(() => {
    if (pageType !== 'location') return

    const fetchLocationData = async () => {
      try {
        setLoading(true)
        // The API returns both location and properties in a single response
        const response = await fetch(`/api/locations/${slug}?page=${currentPage}&limit=12`)
        if (!response.ok) throw new Error('Failed to fetch location')
        const data = await response.json()
        setLocation(data.location)
        setProperties(data.properties || [])
        setPagination(data.pagination)
      } catch (error) {
        console.error('[v0] Error fetching location:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocationData()
  }, [slug, currentPage, pageType])

  // Build query string from type slug with enhanced filtering support
  const buildTypeQueryString = () => {
    const typeConfig = TYPE_SLUG_MAP[slug]
    if (!typeConfig) return ''

    const params: string[] = []
    
    // Primary field filtering - these will be OR'd together by the API
    if (Array.isArray(typeConfig.value)) {
      params.push(...typeConfig.value.map((v) => `${typeConfig.field}=${v}`))
    } else {
      params.push(`${typeConfig.field}=${typeConfig.value}`)
    }
    
    // Category matching - add as separate params (OR'd within same field)
    if (typeConfig.categoryMatch) {
      params.push(...typeConfig.categoryMatch.map((c) => `property_category=${c}`))
    }
    
    return params.join('&')
  }

  const typeQueryString = buildTypeQueryString()
  const { data: typeData, isLoading: typeLoading } = useSWR(
    pageType === 'type' && typeQueryString ? `/api/properties?${typeQueryString}&sort=${sortBy}&limit=20` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const typeProperties: Property[] = typeData?.properties || []

  // Get display info
  const displayName = pageType === 'type' ? TYPE_DISPLAY_NAMES[slug] : location?.name
  const description = pageType === 'type' ? TYPE_DESCRIPTIONS[slug] : location?.description

  // Redirect to homepage for invalid slugs
  useEffect(() => {
    if (!isValidSlug || pageType === 'invalid') {
      router.push('/')
    }
  }, [isValidSlug, pageType, router])

  // Show nothing while redirecting for invalid slugs
  if (!isValidSlug || pageType === 'invalid') {
    return null
  }

  // Show location page with rich content
  if (pageType === 'location') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-[var(--luxury-cream)]">
          {/* Hero - Use Rich Hero if content available */}
          {richContent ? (
            <LocationRichHero
              content={richContent}
              propertyCount={pagination?.total || 0}
              backgroundImage={location?.featured_image}
            />
          ) : location && (
            <LocationHero
              name={location.name}
              description={location.description}
              featured_image={location.featured_image}
              propertyCount={pagination?.total || 0}
            />
          )}

          {/* Filter Pills - Only if rich content */}
          {richContent && (
            <div className="max-w-7xl mx-auto px-4 py-6">
              <LocationFilterPills filters={richContent.filterPills} />
            </div>
          )}

          {/* Properties Section */}
          <div id="properties" className="luxury-section max-w-7xl mx-auto">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--luxury-navy)] hover:text-[var(--luxury-gold)] transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            {/* Section Title */}
            {richContent && (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--luxury-navy)]">
                  Available Properties
                </h2>
                <p className="text-[var(--luxury-dark)]/70 mt-2">
                  Browse {pagination?.total || 0} premium properties in {richContent.h1}
                </p>
              </div>
            )}

            {/* Filters & Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 p-6 bg-white rounded-xl border border-[var(--luxury-border)]">
              <div>
                <p className="text-sm text-gray-600">Showing {properties.length} of {pagination?.total || 0} properties</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const query = new URLSearchParams(searchParams.toString())
                    query.set('sort', e.target.value)
                    query.set('page', '1')
                    router.push(`/${slug}?${query.toString()}`)
                  }}
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
                      const query = new URLSearchParams(searchParams.toString())
                      query.set('view', 'grid')
                      router.push(`/${slug}?${query.toString()}`)
                    }}
                    className={`p-1.5 rounded transition-colors ${viewLayout === 'grid' ? 'bg-[var(--luxury-navy)] text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setViewLayout('list')
                      const query = new URLSearchParams(searchParams.toString())
                      query.set('view', 'list')
                      router.push(`/${slug}?${query.toString()}`)
                    }}
                    className={`p-1.5 rounded transition-colors ${viewLayout === 'list' ? 'bg-[var(--luxury-navy)] text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
                <p className="text-gray-500">No properties available in {location?.name} at the moment.</p>
              </div>
            ) : viewLayout === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <LuxuryPropertyCard key={property._id} {...property} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property._id} className="luxury-card p-0 flex overflow-hidden h-48">
                    <div className="relative w-56 flex-shrink-0 bg-gray-100">
                      <img src={property.main_thumbnail || '/images/placeholder.jpg'} alt={property.property_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <Link href={`/properties/${property.slug || property._id}`}>
                          <h3 className="text-lg font-bold text-[var(--luxury-navy)] hover:text-[var(--luxury-gold)] transition-colors mb-2">
                            {property.property_name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 text-[var(--luxury-gold)]" />
                          {property.address || property.city}
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          {property.bedrooms && <span>{property.bedrooms} BHK</span>}
                          {property.bathrooms && <span>•</span>}
                          {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                          {property.area_sqft && <span>•</span>}
                          {property.area_sqft && <span>{Math.round(property.area_sqft)} Sqft</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-[var(--luxury-navy)]">{property.price_range || formatPriceToIndian(property.lowest_price)}</p>
                        <Link href={`/properties/${property.slug || property._id}`} className="luxury-button">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  onClick={() => {
                    if (currentPage > 1) {
                      const query = new URLSearchParams(searchParams.toString())
                      query.set('page', String(currentPage - 1))
                      router.push(`/${slug}?${query.toString()}`)
                    }
                  }}
                  disabled={currentPage === 1}
                  className="luxury-button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1
                  const isActive = pageNum === currentPage
                  const isVisible = Math.abs(pageNum - currentPage) <= 2 || pageNum === 1 || pageNum === pagination.totalPages

                  if (!isVisible) return null

                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        const query = new URLSearchParams(searchParams.toString())
                        query.set('page', String(pageNum))
                        router.push(`/${slug}?${query.toString()}`)
                      }}
                      className={cn(
                        'px-3 py-2 rounded-lg font-medium transition-colors',
                        isActive
                          ? 'bg-[var(--luxury-navy)] text-white'
                          : 'bg-white border border-[var(--luxury-border)] text-[var(--luxury-navy)] hover:border-[var(--luxury-navy)]'
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <Button
                  onClick={() => {
                    if (currentPage < pagination.totalPages) {
                      const query = new URLSearchParams(searchParams.toString())
                      query.set('page', String(currentPage + 1))
                      router.push(`/${slug}?${query.toString()}`)
                    }
                  }}
                  disabled={currentPage === pagination.totalPages}
                  className="luxury-button"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Rich Content Sections - Only if rich content available */}
          {richContent && (
            <>
              {/* Why Premium */}
              {richContent.whyPremium && (
                <WhyPremiumSection
                  title={richContent.whyPremium.title}
                  cards={richContent.whyPremium.cards}
                />
              )}

              {/* Price Trends */}
              {richContent.priceTrends && (
                <PriceTrendsSection
                  trends={richContent.priceTrends.data}
                  summaryStats={richContent.priceTrends.summaryStats}
                  locationName={richContent.h1}
                />
              )}

              {/* Connectivity */}
              {richContent.connectivity && richContent.connectivity.length > 0 && (
                <ConnectivitySection
                  connectivity={richContent.connectivity}
                  locationName={richContent.h1}
                />
              )}

              {/* Sector Breakdown */}
              {richContent.sectorBreakdown && richContent.sectorBreakdown.length > 0 && (
                <SectorBreakdownSection
                  sectors={richContent.sectorBreakdown}
                  locationName={richContent.h1}
                />
              )}

              {/* Nearby Infrastructure */}
              {richContent.nearbyInfrastructure && richContent.nearbyInfrastructure.length > 0 && (
                <NearbyInfrastructureSection
                  infrastructure={richContent.nearbyInfrastructure}
                  locationName={richContent.h1}
                />
              )}

              {/* FAQs */}
              {richContent.faqs && richContent.faqs.length > 0 && (
                <FAQSection
                  faqs={richContent.faqs}
                  locationName={richContent.h1}
                />
              )}
            </>
          )}
        </main>
      </>
    )
  }

  // Show property type page
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
              <span className="text-sm text-gray-600">{displayName}</span>
            </div>

            {/* Title & Description */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-16 bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--luxury-navy)] rounded-full" />
                <span className="text-[var(--luxury-gold)] text-sm font-semibold uppercase tracking-wider">Premium Selection</span>
              </div>
              <h1 className="luxury-heading mb-3">{displayName}</h1>
              <p className="luxury-subheading max-w-2xl">{description}</p>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-[var(--luxury-border)]">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--luxury-gold)]" />
                <span className="text-sm font-semibold text-[var(--luxury-navy)]">
                  {typeLoading ? 'Loading...' : `${typeProperties.length} Properties Found`}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const query = new URLSearchParams(searchParams.toString())
                    query.set('sort', e.target.value)
                    router.push(`/${slug}?${query.toString()}`)
                  }}
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
                      const query = new URLSearchParams(searchParams.toString())
                      query.set('view', 'grid')
                      router.push(`/${slug}?${query.toString()}`)
                    }}
                    className={`p-1.5 rounded transition-colors ${viewLayout === 'grid'
                        ? 'bg-[var(--luxury-navy)] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setViewLayout('list')
                      const query = new URLSearchParams(searchParams.toString())
                      query.set('view', 'list')
                      router.push(`/${slug}?${query.toString()}`)
                    }}
                    className={`p-1.5 rounded transition-colors ${viewLayout === 'list'
                        ? 'bg-[var(--luxury-navy)] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        <div className="luxury-section max-w-7xl mx-auto">
          {typeLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="luxury-card h-96 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
              ))}
            </div>
          ) : typeProperties.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
              <p className="text-gray-500 mb-6">
                We don&apos;t have any {displayName?.toLowerCase()} available right now.
              </p>
              <Link href="/" className="luxury-button inline-block">
                Browse Other Properties
              </Link>
            </div>
          ) : viewLayout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typeProperties.map((property) => (
                <LuxuryPropertyCard key={property._id} {...property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {typeProperties.map((property) => (
                <div key={property._id} className="luxury-card p-0 flex overflow-hidden h-48">
                  {/* Image */}
                  <div className="relative w-56 flex-shrink-0 bg-gray-100">
                    <img
                      src={property.main_thumbnail || '/images/placeholder.jpg'}
                      alt={property.property_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <Link href={`/properties/${property.slug || property._id}`}>
                        <h3 className="text-lg font-bold text-[var(--luxury-navy)] hover:text-[var(--luxury-gold)] transition-colors mb-2">
                          {property.property_name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 text-[var(--luxury-gold)]" />
                        {property.address || property.city}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        {property.bedrooms && <span>{property.bedrooms} BHK</span>}
                        {property.bathrooms && <span>•</span>}
                        {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                        {property.area_sqft && <span>•</span>}
                        {property.area_sqft && <span>{Math.round(property.area_sqft)} Sqft</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-[var(--luxury-navy)]">
                        {property.price_range || formatPriceToIndian(property.lowest_price)}
                      </p>
                      <Link href={`/properties/${property.slug || property._id}`} className="luxury-button">
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
