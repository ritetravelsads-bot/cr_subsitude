"use client"

import { useState, useRef, useEffect, memo, useCallback } from "react"
import {
  Building2,
  Users,
  Clock,
  Wifi,
  Coffee,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Zap,
  Monitor,
  Phone,
  Shield,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Office space categories with premium data
const OFFICE_SPACES = [
  {
    id: 1,
    type: "Coworking",
    tagline: "Collaborate & Create",
    description: "Flexible hot desks and dedicated spaces for individuals and small teams who thrive in community",
    seats: "50+",
    price: "8,000",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    gradient: "from-cyan-500 via-blue-500 to-indigo-600",
    glowColor: "rgba(6, 182, 212, 0.4)",
    borderGlow: "cyan-500",
    features: ["High-Speed WiFi", "24/7 Access", "Meeting Rooms", "Community Events"],
    url: "/office-space?space_type=coworking",
    stats: { rating: 4.9, reviews: 284 }
  },
  {
    id: 2,
    type: "Managed Office",
    tagline: "Your Brand, Our Space",
    description: "Fully customized private offices tailored to your brand identity with enterprise-grade support",
    seats: "100+",
    price: "15,000",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&auto=format&fit=crop&q=80",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    glowColor: "rgba(16, 185, 129, 0.4)",
    borderGlow: "emerald-500",
    features: ["Custom Branding", "Private Space", "IT Support", "Dedicated Manager"],
    url: "/office-space?space_type=managed_office",
    stats: { rating: 4.8, reviews: 156 }
  },
  {
    id: 3,
    type: "Private Office",
    tagline: "Executive Excellence",
    description: "Premium private cabins for focused work, confidential meetings and executive leadership",
    seats: "20+",
    price: "25,000",
    image: "https://images.unsplash.com/photo-1606836576983-8b458e75221d?w=800&auto=format&fit=crop&q=80",
    gradient: "from-amber-500 via-orange-500 to-rose-600",
    glowColor: "rgba(245, 158, 11, 0.4)",
    borderGlow: "amber-500",
    features: ["Private Cabin", "Premium Amenities", "Concierge", "Priority Support"],
    url: "/office-space?space_type=private_office",
    stats: { rating: 5.0, reviews: 89 }
  },
]

// Feature icons mapping
const FEATURE_ICONS: Record<string, typeof Wifi> = {
  "High-Speed WiFi": Wifi,
  "24/7 Access": Clock,
  "Meeting Rooms": Monitor,
  "Community Events": Users,
  "Custom Branding": Sparkles,
  "Private Space": Shield,
  "IT Support": Monitor,
  "Dedicated Manager": Users,
  "Private Cabin": Building2,
  "Premium Amenities": Coffee,
  "Concierge": Phone,
  "Priority Support": Zap,
}

// 3D Tilt Card with Magnetic Effect
const OfficeSpaceCard = memo(function OfficeSpaceCard({
  space,
  index,
}: {
  space: typeof OFFICE_SPACES[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 50, y: 50 })

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "50px" }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // 3D Tilt effect handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12

    setMousePosition({ x: rotateY, y: rotateX })

    // Spotlight position (percentage)
    setSpotlightPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
    setSpotlightPosition({ x: 50, y: 50 })
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative group cursor-pointer",
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
      style={{
        transitionDelay: `${index * 150}ms`,
        perspective: "1000px"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Container with 3D Transform */}
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "h-[420px] md:h-[480px]",
          "transition-all duration-300 ease-out",
          "will-change-transform",
          "border border-white/10"
        )}
        style={{
          transform: isHovered
            ? `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale(1.02)`
            : "rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `0 25px 50px -12px ${space.glowColor}, 0 0 80px ${space.glowColor}`
            : "0 10px 40px -15px rgba(0,0,0,0.3)"
        }}
      >
        {/* Background Image with Parallax */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            "transition-transform duration-500 ease-out"
          )}
          style={{
            backgroundImage: `url(${space.image})`,
            transform: isHovered ? "scale(1.1)" : "scale(1)"
          }}
        />

        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
          space.gradient,
          isHovered && "opacity-60"
        )} />

        {/* Spotlight Effect */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
          style={{
            background: `radial-gradient(600px circle at ${spotlightPosition.x}% ${spotlightPosition.y}%, rgba(255,255,255,0.15), transparent 40%)`
          }}
        />

        {/* Animated Border Glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100"
          )}
          style={{
            background: `linear-gradient(135deg, transparent 40%, ${space.glowColor} 50%, transparent 60%)`,
            backgroundSize: "200% 200%",
            animation: isHovered ? "shimmer 2s linear infinite" : "none"
          }}
        />

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col justify-between p-6" style={{ transform: "translateZ(20px)" }}>

          {/* Top Section - Badges */}
          <div className="flex items-start justify-between">
            {/* Type Badge with Glassmorphism */}
            <div className={cn(
              "px-4 py-2 rounded-2xl",
              "bg-white/10 backdrop-blur-xl",
              "border border-white/20",
              "shadow-lg",
              "transition-all duration-300",
              isHovered && "bg-white/20 scale-105"
            )}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  `bg-${space.borderGlow}`
                )}
                  style={{ backgroundColor: space.glowColor.replace('0.4', '1') }}
                />
                <span className="text-white text-sm font-bold tracking-wide">
                  {space.type}
                </span>
              </div>
            </div>

            {/* Rating Badge */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "bg-white/10 backdrop-blur-xl border border-white/20",
              "transition-all duration-300",
              isHovered && "bg-white/20"
            )}>
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-semibold">{space.stats.rating}</span>
              <span className="text-white/60 text-xs">({space.stats.reviews})</span>
            </div>
          </div>

          {/* Bottom Section - Content */}
          <div className="space-y-4">
            {/* Tagline */}
            <div className={cn(
              "inline-flex items-center gap-2",
              "transition-all duration-500",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-70"
            )}>
              <Sparkles className="h-3.5 w-3.5 text-white/80" />
              <span className="text-white/80 text-xs font-semibold tracking-[0.2em] uppercase">
                {space.tagline}
              </span>
            </div>

            {/* Description */}
            <p className={cn(
              "text-white/90 text-sm leading-relaxed max-w-xs",
              "transition-all duration-500 delay-75",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}>
              {space.description}
            </p>

            {/* Features Grid */}
            <div className={cn(
              "grid grid-cols-2 gap-2",
              "transition-all duration-500 delay-100",
              isHovered ? "translate-y-0 opacity-100 max-h-40" : "translate-y-4 opacity-0 max-h-0 overflow-hidden"
            )}>
              {space.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[feature] || CheckCircle2
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl",
                      "bg-white/10 backdrop-blur-sm border border-white/10",
                      "transition-all duration-300",
                      "hover:bg-white/20"
                    )}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <Icon className="h-3.5 w-3.5 text-white/80 flex-shrink-0" />
                    <span className="text-white/90 text-xs font-medium truncate">{feature}</span>
                  </div>
                )
              })}
            </div>

            {/* Price & CTA Row */}
            <div className={cn(
              "flex items-center justify-between gap-4 pt-2",
              "transition-all duration-500 delay-150",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}>
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-white/60 text-xs">From</span>
                <span className="text-white text-2xl font-bold">₹{space.price}</span>
                <span className="text-white/60 text-xs">/seat</span>
              </div>

              {/* CTA Button */}
              <Link
                href={space.url}
                className={cn(
                  "inline-flex items-center gap-2",
                  "px-5 py-2.5 rounded-xl",
                  "bg-white text-slate-900 font-semibold text-sm",
                  "hover:bg-white/90 transition-all duration-300",
                  "shadow-lg shadow-black/20",
                  "group/btn"
                )}
              >
                Explore
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Shine Sweep Effect */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-gradient-to-r from-transparent via-white/30 to-transparent",
            "translate-x-[-100%]",
            isHovered && "animate-shine"
          )}
        />
      </div>

      {/* Floating Seat Count Badge */}
      <div
        className={cn(
          "absolute -bottom-3 left-6",
          "px-4 py-2 rounded-xl",
          "bg-white shadow-xl shadow-black/10",
          "border border-slate-100",
          "transition-all duration-500",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-600" />
          <span className="text-slate-900 text-sm font-bold">{space.seats}</span>
          <span className="text-slate-500 text-xs">seats available</span>
        </div>
      </div>
    </div>
  )
})


export default function FeaturedOfficeSpaces() {
  return (
    <section className="w-full md:pb-10 px-4 md:px-6 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shine {
          animation: shine 1s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Premium Workspaces
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Where Work Meets Excellence
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              From coworking desks to managed offices, find the perfect workspace that scales with your ambition
            </p>
          </div>

          <Link
            href="/properties?segment=luxury"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-primary/5 hover:bg-primary/10 border border-primary/20",
              "text-primary font-medium text-sm",
              "transition-all duration-300",
              "hover:gap-3 group"
            )}
          >
            View All Luxury
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Office Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {OFFICE_SPACES.map((space, index) => (
            <OfficeSpaceCard
              key={space.id}
              space={space}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
