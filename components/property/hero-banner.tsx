"use client"

import { MapPin, IndianRupee, Calendar, Home, Building2 } from "lucide-react"
import { formatPriceToIndian } from "@/lib/utils"

interface HeroBannerProps {
  property: {
    property_name: string
    main_banner?: string
    main_thumbnail?: string
    address?: string
    city?: string
    state?: string
    lowest_price?: number
    max_price?: number
    possession?: string
    possession_date?: string
    configurations?: Array<{ type: string }>
    units?: Array<{ type: string }>
    payment_plan_details?: string
    payment_plan?: string
  }
}

export function HeroBanner({ property }: HeroBannerProps) {
  const bgImage = property.main_banner || property.main_thumbnail

  // Get unit types from configurations or units
  const rawUnitTypes = property.configurations?.map(c => c.type).filter(Boolean) ||
    property.units?.map(u => u.type).filter(Boolean) || []
  
  // Format unit types to show only BHK numbers combined (e.g., "4 & 5 BHK")
  const formatBHKNumbers = (types: string[]): string => {
    // Extract BHK numbers from strings like "3 BHK Luxury", "4 BHK Ultra Luxury", etc.
    const bhkNumbers: number[] = []
    
    for (const type of types) {
      const match = type.match(/^(\d+)\s*BHK/i)
      if (match) {
        const num = parseInt(match[1], 10)
        if (!bhkNumbers.includes(num)) {
          bhkNumbers.push(num)
        }
      }
    }
    
    if (bhkNumbers.length === 0) {
      // No BHK types found, return original (for non-BHK types like "Penthouse", "Studio")
      return types.slice(0, 3).join(", ") || "Multiple Options"
    }
    
    // Sort numbers
    bhkNumbers.sort((a, b) => a - b)
    
    if (bhkNumbers.length === 1) {
      return `${bhkNumbers[0]} BHK`
    } else if (bhkNumbers.length === 2) {
      return `${bhkNumbers[0]} & ${bhkNumbers[1]} BHK`
    } else {
      // For 3+ numbers: "3, 4 & 5 BHK"
      const last = bhkNumbers.pop()
      return `${bhkNumbers.join(", ")} & ${last} BHK`
    }
  }
  
  const formattedUnitTypes = formatBHKNumbers(rawUnitTypes)

  // Format payment plan
  const paymentPlan = property.payment_plan_details ||
    (property.payment_plan === "clp" ? "Construction Linked" :
      property.payment_plan === "possession_linked" ? "Possession Linked" :
        property.payment_plan === "down_payment" ? "Down Payment" :
          property.payment_plan)

  const formatPrice = (price: number) => formatPriceToIndian(price)

  const fullAddress = [property.address, property.city, property.state].filter(Boolean).join(", ")

  return (
    <section className="relative min-h-[65vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with parallax-like effect */}
      {bgImage ? (
        <>
          <img
            src={bgImage}
            alt={property.property_name}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background" />
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">
        {/* Property Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 text-balance leading-tight drop-shadow-lg">
          {property.property_name}
        </h1>

        {/* Address */}
        {fullAddress && (
          <p className="flex items-center justify-center gap-2 text-white/90 text-base md:text-lg mb-10 drop-shadow-md">
            <MapPin className="h-5 w-5 flex-shrink-0" />
            <span>{fullAddress}</span>
          </p>
        )}

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-4xl mx-auto">
          {/* Price */}
          <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-white/70 mb-1.5 font-medium">Starting Price</p>
            <p className="font-bold text-lg md:text-xl">
              {property.lowest_price ? (
                <>
                  {formatPrice(property.lowest_price)}
                  {property.max_price && property.max_price !== property.lowest_price && (
                    <span className="text-sm text-white/60 font-normal block mt-0.5">onwards</span>
                  )}
                </>
              ) : (
                "Price on Request"
              )}
            </p>
          </div>

          {/* Possession */}
          <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-white/70 mb-1.5 font-medium">Possession</p>
            <p className="font-bold text-lg md:text-xl">
              {property.possession || property.possession_date || "Contact Us"}
            </p>
          </div>

          {/* Unit Types */}
          <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors">
              <Home className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-white/70 mb-1.5 font-medium">Unit Types</p>
            <p className="font-bold text-lg md:text-xl">
              {formattedUnitTypes}
            </p>
          </div>

          {/* Payment Plan */}
          <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-white/70 mb-1.5 font-medium">Payment Plan</p>
            <p className="font-bold text-lg md:text-xl">
              {paymentPlan || "Flexible Plans"}
            </p>
          </div>
        </div>
      </div>

    </section>
  )
}
