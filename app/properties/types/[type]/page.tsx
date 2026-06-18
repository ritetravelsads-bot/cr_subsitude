'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Grid3X3, List, Zap, ChevronDown } from 'lucide-react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import LuxuryPropertyCard from '@/components/property/luxury-property-card'
import useSWR from 'swr'
import { getPropertyUrl } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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
  'plots-land': {
    field: 'property_type',
    value: ['plot', 'land', 'agricultural', 'industrial_land', 'farmland', 'residential_plot', 'commercial_plot']
  },
  'commercial-spaces': {
    field: 'property_type',
    value: ['office', 'shop', 'commercial', 'sco', 'scf', 'warehouse', 'showroom', 'retail', 'multiplex', 'office_space', 'coworking', 'managed_office'],
    categoryMatch: ['commercial', 'mixed_use']
  },
  'office-space': {
    field: 'property_type',
    value: ['office', 'office_space', 'coworking', 'managed_office', 'virtual_office', 'private_office', 'sco']
  },
}

// Nice display names
const TYPE_DISPLAY_NAMES: Record<string, string> = {
  'ready-to-move': 'Ready to Move',
  'new-launch': 'New Launch',
  'upcoming': 'Upcoming Projects',
  'luxury-apartments': 'Luxury Apartments',
  'plots-land': 'Plots & Land',
  'office-spaces': 'Office Spaces',
  'commercial-spaces': 'Commercial Spaces',
  'office-space': 'Office Spaces',
}

const TYPE_DESCRIPTIONS: Record<string, string> = {
  'ready-to-move': 'Ready to move in properties available now. Move to your dream home immediately.',
  'new-launch': 'Recently launched projects from top developers. Be among the first to own.',
  'upcoming': 'Upcoming projects launching soon. Book and invest early at pre-launch prices.',
  'luxury-apartments': 'Premium luxury apartments with world-class amenities and fine living.',
  'plots-land': 'Prime plots and land parcels for your dream home or investment.',
  'commercial-spaces': 'Premium commercial spaces for offices, shops, and businesses.',
  'office-space': 'Premium office spaces including coworking, managed offices, and private offices for businesses of all sizes.',
}

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
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
]

export default function PropertyTypePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const slug = (params.type as string) || ''
  const sortBy = searchParams.get('sort') || 'featured'
  const viewMode = searchParams.get('view') || 'grid'

  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>(viewMode as 'grid' | 'list')

  // Build query string from type slug with enhanced filtering support
  const buildQueryString = () => {
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

  const queryString = buildQueryString()
  const { data, isLoading } = useSWR(
    queryString ? `/api/properties?${queryString}&sort=${sortBy}&limit=20` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const properties: Property[] = data?.properties || []
  const displayName = TYPE_DISPLAY_NAMES[slug] || 'Properties'
  const description = TYPE_DESCRIPTIONS[slug] || 'Browse our exclusive collection of properties'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-[var(--luxury-cream)]">
        {/* Hero Section */}
        <div className="luxury-section bg-white border-b border-[var(--luxury-border)]">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Link href="/properties" className="flex items-center gap-1 text-[var(--luxury-navy)] hover:text-[var(--luxury-gold)] transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">All Properties</span>
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
                  {isLoading ? 'Loading...' : `${properties.length} Properties Found`}
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
                    router.push(`/properties/types/${slug}?${query.toString()}`)
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
                      router.push(`/properties/types/${slug}?${query.toString()}`)
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
                      router.push(`/properties/types/${slug}?${query.toString()}`)
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="luxury-card h-96 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
              <p className="text-gray-500 mb-6">
                We don&apos;t have any {displayName.toLowerCase()} available right now.
              </p>
              <Link href="/properties" className="luxury-button inline-block">
                Browse All Properties
              </Link>
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
                      <Link href={getPropertyUrl(property)}>
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
                        {property.price_range || `₹${(property.lowest_price || 0) / 10000000}Cr`}
                      </p>
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
