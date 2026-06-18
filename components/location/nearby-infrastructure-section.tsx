'use client'

import { 
  GraduationCap, 
  Stethoscope, 
  ShoppingBag, 
  Utensils,
  Building,
  Hotel,
  CheckCircle2
} from 'lucide-react'
import type { NearbyInfrastructure } from '@/data/location-content'

interface NearbyInfrastructureSectionProps {
  infrastructure: NearbyInfrastructure[]
  locationName: string
}

const categoryConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  'Schools': { icon: GraduationCap, color: 'blue' },
  'Healthcare': { icon: Stethoscope, color: 'red' },
  'Retail & Malls': { icon: ShoppingBag, color: 'purple' },
  'Dining & Clubs': { icon: Utensils, color: 'orange' },
  'Hotels': { icon: Hotel, color: 'teal' },
  'Business': { icon: Building, color: 'green' },
}

const colorClasses: Record<string, { bg: string; text: string; dot: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  red: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
  green: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
}

export default function NearbyInfrastructureSection({ 
  infrastructure, 
  locationName 
}: NearbyInfrastructureSectionProps) {
  return (
    <section className="py-16 bg-[var(--luxury-cream)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--luxury-gold)] text-sm uppercase tracking-widest font-medium">
            Neighborhood
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mt-2 mb-4">
            Nearby Infrastructure
          </h2>
          <p className="text-[var(--luxury-dark)]/70 max-w-2xl mx-auto">
            World-class amenities and facilities around {locationName}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infrastructure.map((item) => (
            <CategoryCard key={item.category} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ item }: { item: NearbyInfrastructure }) {
  const config = categoryConfig[item.category] || { icon: Building, color: 'green' }
  const colors = colorClasses[config.color] || colorClasses.green
  const IconComponent = config.icon

  return (
    <div className="p-6 rounded-xl bg-white border border-[var(--luxury-border)] shadow-sm">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <IconComponent className={`h-5 w-5 ${colors.text}`} />
        </div>
        <h3 className="text-lg font-bold text-[var(--luxury-navy)]">
          {item.category}
        </h3>
      </div>

      {/* Items List */}
      <ul className="space-y-2">
        {item.items.map((name) => (
          <li key={name} className="flex items-start gap-2">
            <CheckCircle2 className={`h-4 w-4 ${colors.text} mt-0.5 flex-shrink-0`} />
            <span className="text-sm text-[var(--luxury-dark)]/80">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
