'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize2, CheckCircle2, Zap } from 'lucide-react'
import { formatPriceToIndian, getPropertyUrl } from '@/lib/utils'



interface LuxuryPropertyCardProps {
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

export default function LuxuryPropertyCard({
  _id,
  property_name,
  slug = _id,
  main_thumbnail,
  address,
  city,
  bedrooms,
  bathrooms,
  carpet_area,
  super_area,
  area_sqft,
  lowest_price,
  max_price,
  price_range,
  project_status,
  listing_type,
  property_type,
  rera_registered,
  is_featured,
}: LuxuryPropertyCardProps) {
  const area = carpet_area || super_area || area_sqft
  const priceDisplay = price_range || (lowest_price ? formatPriceToIndian(lowest_price) : 'POA')
  const propertyUrl = getPropertyUrl({ _id, slug: slug || _id, property_type: property_type || "" })
  
  // Validate and process image URL
  const getImageUrl = () => {
    if (!main_thumbnail) return '/images/placeholder.jpg'
    
    // If it's a full URL (http/https), use it directly
    if (main_thumbnail.startsWith('http://') || main_thumbnail.startsWith('https://')) {
      return main_thumbnail
    }
    
    // If it's a relative path without leading slash, add one
    if (!main_thumbnail.startsWith('/')) {
      return `/${main_thumbnail}`
    }
    
    return main_thumbnail
  }
  
  const getStatusBadge = () => {
    if (project_status === 'ready_to_move') return 'Ready to Move'
    if (listing_type === 'new') return 'New Launch'
    if (project_status === 'under_construction') return 'Under Construction'
    return null
  }

  const statusBadge = getStatusBadge()
  const imageUrl = getImageUrl()

  return (
    <Link href={propertyUrl}>
      <div className="luxury-card group h-full flex flex-col overflow-hidden">
        {/* Image Container */}
        <div className="relative overflow-hidden h-64 md:h-72 bg-gray-100">
          <Image
            src={imageUrl}
            alt={property_name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement
              img.src = '/images/placeholder.jpg'
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            {/* Featured Badge */}
            {is_featured && (
              <div className="luxury-badge">
                <Zap className="h-3 w-3" />
                Featured
              </div>
            )}
            
            {/* Status Badge */}
            {statusBadge && (
              <div className="ml-auto luxury-badge bg-[var(--luxury-navy)]/10 text-[var(--luxury-navy)]">
                {statusBadge}
              </div>
            )}
          </div>

          {/* RERA Badge */}
          {rera_registered && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-green-500/90 text-white rounded-full text-xs font-semibold">
              <CheckCircle2 className="h-3 w-3" />
              RERA Registered
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Property Name */}
          <h3 className="text-base md:text-lg font-bold text-[var(--luxury-navy)] mb-2 line-clamp-2 group-hover:text-[var(--luxury-gold)] transition-colors">
            {property_name}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-1.5 mb-3 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0 text-[var(--luxury-gold)] mt-0.5" />
            <span className="line-clamp-2">{address || city || 'Location not specified'}</span>
          </div>

          {/* Price */}
          <div className="mb-3 pb-3 border-b border-[var(--luxury-border)]">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Starting Price</p>
            <p className="text-xl md:text-2xl font-bold text-[var(--luxury-navy)]">
              {priceDisplay}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 text-xs md:text-sm mb-4">
            {bedrooms && (
              <div className="flex flex-col items-center p-2 bg-[var(--luxury-cream)] rounded-lg">
                <Bed className="h-4 w-4 text-[var(--luxury-gold)] mb-1" />
                <span className="font-semibold text-[var(--luxury-navy)]">{bedrooms}</span>
                <span className="text-gray-600 text-xs">BHK</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex flex-col items-center p-2 bg-[var(--luxury-cream)] rounded-lg">
                <Bath className="h-4 w-4 text-[var(--luxury-gold)] mb-1" />
                <span className="font-semibold text-[var(--luxury-navy)]">{bathrooms}</span>
                <span className="text-gray-600 text-xs">Baths</span>
              </div>
            )}
            {area && (
              <div className="flex flex-col items-center p-2 bg-[var(--luxury-cream)] rounded-lg">
                <Maximize2 className="h-4 w-4 text-[var(--luxury-gold)] mb-1" />
                <span className="font-semibold text-[var(--luxury-navy)]">{Math.round(area)}</span>
                <span className="text-gray-600 text-xs">Sqft</span>
              </div>
            )}
          </div>

          {/* Property Type */}
          {property_type && (
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {property_type.replace(/_/g, ' ')}
            </p>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 pt-0 border-t border-[var(--luxury-border)] bg-gradient-to-r from-white to-[var(--luxury-cream)]/30">
          <button className="w-full py-2.5 text-sm font-semibold text-[var(--luxury-navy)] border border-[var(--luxury-navy)] rounded-lg hover:bg-[var(--luxury-navy)] hover:text-white transition-all duration-300">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
