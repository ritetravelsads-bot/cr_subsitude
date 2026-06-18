'use client'

import Image from 'next/image'
import { MapPin, Home, TrendingUp } from 'lucide-react'

interface LocationHeroProps {
  name: string
  description?: string
  featured_image?: string
  propertyCount: number
}

export default function LocationHero({
  name,
  description,
  featured_image,
  propertyCount,
}: LocationHeroProps) {
  // Validate and process image URL
  const getImageUrl = () => {
    if (!featured_image) return null
    
    // If it's a full URL (http/https), use it directly
    if (featured_image.startsWith('http://') || featured_image.startsWith('https://')) {
      return featured_image
    }
    
    // If it's a relative path without leading slash, add one
    if (!featured_image.startsWith('/')) {
      return `/${featured_image}`
    }
    
    return featured_image
  }
  
  const imageUrl = getImageUrl()
  return (
    <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Fallback Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--luxury-navy)] to-[var(--luxury-dark)]" />
      
      {/* Background Image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement
            img.style.display = 'none'
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--luxury-navy)] to-[var(--luxury-dark)]" />
      )}

      {/* Luxury Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        {/* Gold accent bar */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--luxury-gold)] via-[var(--luxury-gold)] to-transparent opacity-80" />
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--luxury-gold)]/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="p-6 md:p-10 lg:p-14 max-w-3xl">
          {/* Breadcrumb Style */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-[var(--luxury-gold)]" />
            <span className="text-white/80 text-sm uppercase tracking-widest font-light">Luxury Location</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {name}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg md:text-xl text-white/90 font-light mb-6 max-w-2xl line-clamp-3">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--luxury-gold)]/20 rounded-lg">
                <Home className="h-5 w-5 text-[var(--luxury-gold)]" />
              </div>
              <div>
                <p className="text-white/70 text-sm uppercase tracking-wide font-light">Available Properties</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{propertyCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--luxury-gold)]/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[var(--luxury-gold)]" />
              </div>
              <div>
                <p className="text-white/70 text-sm uppercase tracking-wide font-light">Premium Segment</p>
                <p className="text-2xl md:text-3xl font-bold text-white">Featured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
