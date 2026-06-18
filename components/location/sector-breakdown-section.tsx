'use client'

import { MapPin } from 'lucide-react'
import type { SectorBreakdown } from '@/data/location-content'

interface SectorBreakdownSectionProps {
  sectors: SectorBreakdown[]
  locationName: string
}

export default function SectorBreakdownSection({ sectors, locationName }: SectorBreakdownSectionProps) {
  if (!sectors || sectors.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--luxury-gold)] text-sm uppercase tracking-widest font-medium">
            Area Guide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mt-2 mb-4">
            Sector-wise Breakdown
          </h2>
          <p className="text-[var(--luxury-dark)]/70 max-w-2xl mx-auto">
            Detailed analysis of different sectors in {locationName}
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector) => (
            <SectorCard key={sector.sector} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SectorCard({ sector }: { sector: SectorBreakdown }) {
  return (
    <div className="bg-[var(--luxury-cream)] rounded-xl p-6 hover:shadow-lg transition-shadow">
      {/* Sector Name */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-[var(--luxury-gold)]" />
        <h3 className="text-xl font-bold text-[var(--luxury-navy)]">{sector.sector}</h3>
      </div>

      {/* Description */}
      <p className="text-[var(--luxury-dark)]/70 text-sm leading-relaxed">
        {sector.description}
      </p>
    </div>
  )
}
