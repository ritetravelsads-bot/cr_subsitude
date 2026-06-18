'use client'

import { 
  Building2, 
  Car, 
  Leaf, 
  Shield, 
  TrendingUp, 
  Users, 
  MapPin, 
  Wifi,
  Briefcase,
  GraduationCap,
  Heart,
  ShoppingBag,
  Plane,
  Train,
  Home,
  Trees
} from 'lucide-react'
import type { WhyPremiumCard } from '@/data/location-content'

interface WhyPremiumSectionProps {
  title: string
  cards: WhyPremiumCard[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2: Building2,
  building: Building2,
  car: Car,
  Car: Car,
  leaf: Leaf,
  Leaf: Leaf,
  shield: Shield,
  Shield: Shield,
  trending: TrendingUp,
  TrendingUp: TrendingUp,
  users: Users,
  Users: Users,
  mapPin: MapPin,
  MapPin: MapPin,
  wifi: Wifi,
  Wifi: Wifi,
  briefcase: Briefcase,
  Briefcase: Briefcase,
  graduation: GraduationCap,
  GraduationCap: GraduationCap,
  heart: Heart,
  Heart: Heart,
  shopping: ShoppingBag,
  ShoppingBag: ShoppingBag,
  plane: Plane,
  Plane: Plane,
  train: Train,
  Train: Train,
  home: Home,
  Home: Home,
  trees: Trees,
  Trees: Trees,
}

export default function WhyPremiumSection({ title, cards }: WhyPremiumSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--luxury-gold)] text-sm uppercase tracking-widest font-medium">
            Location Advantages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mt-2 mb-4">
            {title}
          </h2>
          <p className="text-[var(--luxury-dark)]/70 max-w-2xl mx-auto">
            Discover what makes this location one of the most sought-after addresses
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ card }: { card: WhyPremiumCard }) {
  const IconComponent = iconMap[card.icon] || Building2

  return (
    <div className="group p-6 rounded-xl border border-[var(--luxury-border)] hover:border-[var(--luxury-gold)] bg-white hover:shadow-lg transition-all duration-300">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-[var(--luxury-cream)] flex items-center justify-center mb-4 group-hover:bg-[var(--luxury-gold)]/20 transition-colors">
        <IconComponent className="h-7 w-7 text-[var(--luxury-navy)] group-hover:text-[var(--luxury-gold)] transition-colors" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-[var(--luxury-navy)] mb-2">
        {card.title}
      </h3>
      <p className="text-[var(--luxury-dark)]/70 text-sm leading-relaxed">
        {card.description}
      </p>
    </div>
  )
}
