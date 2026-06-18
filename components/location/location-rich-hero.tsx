'use client'

import Image from 'next/image'
import { MapPin, Home, TrendingUp, IndianRupee, Building2 } from 'lucide-react'
import type { LocationContent } from '@/data/location-content'

interface LocationRichHeroProps {
  content: LocationContent
  propertyCount: number
  backgroundImage?: string
}

export default function LocationRichHero({ content, propertyCount, backgroundImage }: LocationRichHeroProps) {
  const { h1, subheading, heroStats } = content

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={h1}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--luxury-navy)] to-[var(--luxury-dark)]" />
      )}

      {/* Luxury Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--luxury-gold)] via-[var(--luxury-gold)] to-transparent opacity-80" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--luxury-gold)]/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="p-6 md:p-10 lg:p-14 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-[var(--luxury-gold)]" />
            <span className="text-white/80 text-sm uppercase tracking-widest font-light">
              Premium Location
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight text-balance">
            {h1}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 font-light mb-8 max-w-3xl line-clamp-3">
            {subheading}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {heroStats.map((stat, index) => (
              <StatCard 
                key={index}
                icon={getStatIcon(stat.label)}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href={content.ctaButtons.primary.action}
              className="px-6 py-3 bg-[var(--luxury-gold)] text-[var(--luxury-navy)] font-semibold rounded-lg hover:bg-white transition-colors"
            >
              {content.ctaButtons.primary.label}
            </a>
            <a
              href={content.ctaButtons.secondary.action}
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[var(--luxury-navy)] transition-colors"
            >
              {content.ctaButtons.secondary.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatIcon(label: string) {
  const labelLower = label.toLowerCase()
  if (labelLower.includes('price') || labelLower.includes('cr')) return <IndianRupee className="h-5 w-5" />
  if (labelLower.includes('project') || labelLower.includes('propert')) return <Building2 className="h-5 w-5" />
  if (labelLower.includes('appreciation') || labelLower.includes('growth')) return <TrendingUp className="h-5 w-5" />
  return <Home className="h-5 w-5" />
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-[var(--luxury-gold)]">{icon}</div>
        <span className="text-white/70 text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xl md:text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
