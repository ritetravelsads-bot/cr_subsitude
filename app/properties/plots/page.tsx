'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Grid3X3, List, Zap, LandPlot, TreePine } from 'lucide-react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import LuxuryPropertyCard from '@/components/property/luxury-property-card'
import useSWR from 'swr'
import { getPropertyUrl } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Plot property types
const PLOT_TYPES = ['plot', 'land', 'agricultural', 'industrial_land', 'farmland', 'residential_plot', 'commercial_plot']

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
}

export default function PlotsPropertiesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const sortBy = searchParams.get('sort') || 'featured'
  const viewMode = searchParams.get('view') || 'grid'

  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>(viewMode as 'grid' | 'list')

  // Build query string for plot properties
  const buildQueryString = () => {
    const params: string[] = PLOT_TYPES.map((type) => `property_type=${type}`)
    return params.join('&')
  }

  const queryString = buildQueryString()
  const { data, isLoading } = useSWR(
    `/api/properties?${queryString}&sort=${sortBy}&limit=24`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const properties: Property[] = data?.properties || []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-muted/30">
        {/* Hero Section */}
        <div className="bg-card border-b border-border px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Link href="/properties" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">All Properties</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">Plots & Land</span>
            </div>

            {/* Title & Description */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">Investment Opportunities</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Plots & Land</h1>
              <p className="text-muted-foreground max-w-2xl">
                Premium residential and commercial plots in prime locations. Build your dream home or make a smart 
                investment with our curated selection of land parcels.
              </p>
            </div>

            {/* Property Type Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full flex items-center gap-1">
                <LandPlot className="h-3 w-3" />
                Residential Plots
              </span>
              <span className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Commercial Plots</span>
              <span className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full flex items-center gap-1">
                <TreePine className="h-3 w-3" />
                Farmland
              </span>
              <span className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Agricultural Land</span>
              <span className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Industrial Land</span>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">
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
                    router.push(`/properties/plots?${query.toString()}`)
                  }}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:border-primary/50 transition-colors cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
                  <button
                    onClick={() => {
                      setViewLayout('grid')
                      const query = new URLSearchParams(searchParams.toString())
                      query.set('view', 'grid')
                      router.push(`/properties/plots?${query.toString()}`)
                    }}
                    className={`p-1.5 rounded transition-colors ${viewLayout === 'grid'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                      }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setViewLayout('list')
                      const query = new URLSearchParams(searchParams.toString())
                      query.set('view', 'list')
                      router.push(`/properties/plots?${query.toString()}`)
                    }}
                    className={`p-1.5 rounded transition-colors ${viewLayout === 'list'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <LandPlot className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Plots & Land Found</h3>
              <p className="text-muted-foreground mb-6">
                We don&apos;t have any plots or land available right now.
              </p>
              <Link href="/properties" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
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
                <div key={property._id} className="bg-card border border-border rounded-xl p-0 flex overflow-hidden h-48 hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative w-56 flex-shrink-0 bg-muted">
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
                        <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors mb-2">
                          {property.property_name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        {property.address || property.city}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {property.property_type && (
                          <span className="capitalize">{property.property_type.replace(/_/g, ' ')}</span>
                        )}
                        {property.area_sqft && <span>-</span>}
                        {property.area_sqft && <span>{Math.round(property.area_sqft)} Sq.Yd</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">
                        {property.price_range || `₹${(property.lowest_price || 0) / 10000000}Cr`}
                      </p>
                      <Link href={getPropertyUrl(property)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
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
