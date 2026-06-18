'use client'

import { 
  Plane, 
  Train, 
  Car, 
  Building2,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react'
import type { ConnectivityCard as ConnectivityCardType } from '@/data/location-content'

interface ConnectivitySectionProps {
  connectivity: ConnectivityCardType[]
  locationName: string
}

const modeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Metro': Train,
  'Drive': Car,
  'Metro/Drive': Train,
  'Flight': Plane,
}

export default function ConnectivitySection({ connectivity, locationName }: ConnectivitySectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--luxury-gold)] text-sm uppercase tracking-widest font-medium">
            Connectivity
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mt-2 mb-4">
            Strategic Location Advantage
          </h2>
          <p className="text-[var(--luxury-dark)]/70 max-w-2xl mx-auto">
            Excellent connectivity to key destinations from {locationName}
          </p>
        </div>

        {/* Connectivity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectivity.map((item) => (
            <ConnectivityCard key={item.destination} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ConnectivityCard({ item }: { item: ConnectivityCardType }) {
  const IconComponent = modeIconMap[item.mode] || Car

  return (
    <div className="group p-6 rounded-xl bg-[var(--luxury-cream)] hover:bg-[var(--luxury-navy)] transition-all duration-300">
      {/* Icon & Mode */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:bg-[var(--luxury-gold)] transition-colors">
          <IconComponent className="h-6 w-6 text-[var(--luxury-navy)]" />
        </div>
        <span className="text-xs uppercase tracking-wider text-[var(--luxury-dark)]/60 group-hover:text-white/60 transition-colors">
          {item.mode}
        </span>
      </div>

      {/* Destination */}
      <h3 className="text-lg font-bold text-[var(--luxury-navy)] group-hover:text-white mb-2 transition-colors">
        {item.destination}
      </h3>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[var(--luxury-dark)]/70 group-hover:text-white/80 transition-colors">
          <Clock className="h-4 w-4" />
          <span>{item.travelTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--luxury-dark)]/70 group-hover:text-white/80 transition-colors">
          <ArrowRight className="h-4 w-4" />
          <span>{item.route}</span>
        </div>
      </div>
    </div>
  )
}
