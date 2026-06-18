"use client"

import { useState, useEffect } from "react"
import {
  MapPin, Building2, Users, Clock, Phone, Mail, 
  ChevronLeft, ChevronRight, Share2, Heart, 
  Check, ArrowLeft, Shield, Wifi, Coffee,
  Car, Zap, Wind, ImageIcon, X, User, Loader2,
  ChevronRight as ChevronRightIcon, Star, Calendar,
  Monitor, DollarSign, Layers, FileText, MessageCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn, formatPriceToIndian } from "@/lib/utils"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { HeroBanner } from "@/components/property/hero-banner"
import { LocationConnectivity } from "@/components/property/location-connectivity"
import { PropertyFaq } from "@/components/property/property-faq"

// Company contact info for lead generation
const COMPANY_PHONE = "+91 98737 02365"
const COMPANY_WHATSAPP = "919873702365"
const COMPANY_EMAIL = "contact@countryroof.in"

// Space type labels
const SPACE_TYPE_LABELS: Record<string, string> = {
  coworking: 'Coworking Space',
  managed_office: 'Managed Office',
  private_office: 'Private Office',
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  meeting_room: 'Meeting Room',
  training_room: 'Training Room',
}

const SEAT_TYPE_LABELS: Record<string, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  open_desk: 'Open Desk',
  private_cabin: 'Private Cabin',
  team_cabin: 'Team Cabin',
  manager_cabin: 'Manager Cabin',
  executive_cabin: 'Executive Cabin',
}

const BUILDING_GRADE_LABELS: Record<string, string> = {
  grade_a_plus: 'Grade A+',
  grade_a: 'Grade A',
  grade_b: 'Grade B',
  premium: 'Premium',
}

const FIT_OUT_LABELS: Record<string, string> = {
  bare_shell: 'Bare Shell',
  warm_shell: 'Warm Shell',
  fully_fitted: 'Fully Fitted',
  plug_and_play: 'Plug and Play',
}

const ACCESS_HOURS_LABELS: Record<string, string> = {
  '24_7': '24/7 Access',
  'business_hours': '9 AM - 6 PM',
  'extended_hours': '7 AM - 10 PM',
  'custom': 'Custom Hours',
}

// Amenity icons mapping
const AMENITY_ICONS: Record<string, any> = {
  'High-Speed WiFi': Wifi,
  'WiFi': Wifi,
  'Reception Services': User,
  'Mail Handling': Mail,
  'Pantry/Cafeteria': Coffee,
  'Coffee/Tea': Coffee,
  'Security': Shield,
  'CCTV': Shield,
  'Parking': Car,
  'Power Backup': Zap,
  'Air Conditioning': Wind,
  'Video Conferencing': Monitor,
  'Meeting Rooms': Users,
}

interface OfficeSpaceDetailClientProps {
  property: any
  developer: any
}

export function OfficeSpaceDetailClient({ property, developer }: OfficeSpaceDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addProperty: addToRecentlyViewed } = useRecentlyViewed()

  const officeSpace = property.office_space || {}
  const commercialLease = property.commercial_lease || {}

  // Track as recently viewed
  useEffect(() => {
    if (property) {
      addToRecentlyViewed({
        id: property._id,
        slug: property.slug,
        typeSlug: 'office-space',
        name: property.property_name || "Office Space",
        thumbnail: property.main_thumbnail || "",
        price: officeSpace.price_per_seat_monthly 
          ? `₹${officeSpace.price_per_seat_monthly.toLocaleString()}/seat` 
          : formatPriceToIndian(property.lowest_price) || "",
        address: `${property.address || ""}, ${property.city || ""}`.replace(/^, |, $/g, ""),
        timestamp: Date.now(),
      })
    }
  }, [property, addToRecentlyViewed, officeSpace.price_per_seat_monthly])

  const images = [property.main_banner || property.main_thumbnail, ...(property.multiple_images || [])].filter(Boolean)
  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length)

  // Get space type label
  const spaceTypeLabel = SPACE_TYPE_LABELS[officeSpace.space_type] || officeSpace.space_type?.replace(/_/g, ' ') || 'Office Space'

  // All amenities
  const allAmenities = [
    ...(officeSpace.office_amenities || []),
    ...(property.amenities || []),
    ...(property.facilities || []),
  ]

  // Quick stats for office space
  const quickStats = [
    { label: 'Available Seats', value: officeSpace.available_seats, icon: Users, show: !!officeSpace.available_seats },
    { label: 'Total Seats', value: officeSpace.total_seats, icon: Users, show: !!officeSpace.total_seats && !officeSpace.available_seats },
    { label: 'Cabins', value: officeSpace.cabin_count, icon: Building2, show: !!officeSpace.cabin_count },
    { label: 'Meeting Rooms', value: officeSpace.meeting_rooms_count, icon: Monitor, show: !!officeSpace.meeting_rooms_count },
    { label: 'Area', value: property.area_sqft ? `${property.area_sqft.toLocaleString()} sqft` : null, icon: Layers, show: !!property.area_sqft },
    { label: 'Access', value: ACCESS_HOURS_LABELS[officeSpace.access_hours] || officeSpace.access_hours, icon: Clock, show: !!officeSpace.access_hours },
  ].filter(stat => stat.show && stat.value)

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto">
            <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">Home</Link>
            <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
            <Link href="/office-space" className="hover:text-primary transition-colors whitespace-nowrap">Office Spaces</Link>
            <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{property.property_name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section with Image Gallery */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Image Gallery */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[activeImage]}
                    alt={property.property_name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.slice(0, 5).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all",
                              idx === activeImage ? "bg-white w-4" : "bg-white/50"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    {images.length} Photos
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-muted-foreground" />
                </div>
              )}

              {/* Space Type Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {spaceTypeLabel}
                </span>
              </div>
            </div>

            {/* Property Info & CTA */}
            <div className="flex flex-col">
              {/* Title & Location */}
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                  {property.property_name}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {officeSpace.building_grade && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {BUILDING_GRADE_LABELS[officeSpace.building_grade] || officeSpace.building_grade}
                  </span>
                )}
                {officeSpace.fit_out_status && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                    {FIT_OUT_LABELS[officeSpace.fit_out_status] || officeSpace.fit_out_status}
                  </span>
                )}
                {property.rera_registered && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                    <Shield className="h-3 w-3" /> RERA
                  </span>
                )}
              </div>

              {/* Quick Stats */}
              {quickStats.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {quickStats.slice(0, 6).map((stat, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-xl text-center">
                      <stat.icon className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-lg font-bold text-foreground">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  {officeSpace.price_per_seat_monthly ? (
                    <>
                      <span className="text-2xl font-bold text-foreground">
                        ₹{officeSpace.price_per_seat_monthly.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/seat/month</span>
                    </>
                  ) : property.lowest_price ? (
                    <>
                      <span className="text-2xl font-bold text-foreground">
                        {formatPriceToIndian(property.lowest_price)}
                      </span>
                      {property.max_price && property.max_price !== property.lowest_price && (
                        <span className="text-sm text-muted-foreground">
                          - {formatPriceToIndian(property.max_price)}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xl font-semibold text-foreground">Contact for Pricing</span>
                  )}
                </div>
                {officeSpace.price_per_seat_daily && (
                  <p className="text-sm text-muted-foreground">
                    Day Pass: ₹{officeSpace.price_per_seat_daily.toLocaleString()}/day
                  </p>
                )}
              </div>

              {/* CTA Buttons - Lead Generation */}
              <div className="space-y-3">
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Now: {COMPANY_PHONE}</span>
                </a>

                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP}?text=Hi, I'm interested in ${property.property_name} - ${spaceTypeLabel} in ${property.city}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp Enquiry</span>
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors border",
                      isLiked 
                        ? "bg-rose-50 border-rose-200 text-rose-600" 
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                    {isLiked ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-card border border-border hover:border-primary/50 rounded-xl font-medium transition-colors">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Contact Bar (Mobile) */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3">
        <div className="flex gap-2">
          <a
            href={`tel:${COMPANY_PHONE}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl font-semibold"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <a
            href={`https://wa.me/${COMPANY_WHATSAPP}?text=Hi, I'm interested in ${property.property_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* About Section */}
      {property.about_project && (
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">About {property.property_name}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-4xl">
              {property.about_project}
            </p>
          </div>
        </section>
      )}

      {/* Seat/Cabin Configurations */}
      {officeSpace.seat_configurations && officeSpace.seat_configurations.length > 0 && (
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
                <Users className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-foreground">Available Workspaces</h2>
                <p className="text-xs text-muted-foreground">Choose the workspace that fits your needs</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {officeSpace.seat_configurations.map((config: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {SEAT_TYPE_LABELS[config.type] || config.type}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {config.capacity} {config.capacity === 1 ? 'seat' : 'seats'} capacity
                      </p>
                    </div>
                    <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {config.count} available
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    {config.price_per_seat ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-foreground">
                          ₹{config.price_per_seat.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /{config.price_type || 'month'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">Contact for pricing</span>
                    )}
                  </div>

                  <a
                    href={`tel:${COMPANY_PHONE}`}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-lg text-sm font-medium transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Book Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Office Amenities */}
      {allAmenities.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-foreground">Amenities & Facilities</h2>
                <p className="text-xs text-muted-foreground">{allAmenities.length} amenities included</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {allAmenities.map((amenity: string, idx: number) => {
                const Icon = AMENITY_ICONS[amenity] || Check
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground truncate">{amenity}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Space Specifications */}
      {(officeSpace.floor_plate_sqft || officeSpace.ceiling_height_ft || officeSpace.power_load_kva || officeSpace.ac_type) && (
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">Space Specifications</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {officeSpace.floor_plate_sqft && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Floor Plate</p>
                  <p className="text-lg font-bold text-foreground">{officeSpace.floor_plate_sqft.toLocaleString()} sqft</p>
                </div>
              )}
              {officeSpace.ceiling_height_ft && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Ceiling Height</p>
                  <p className="text-lg font-bold text-foreground">{officeSpace.ceiling_height_ft} ft</p>
                </div>
              )}
              {officeSpace.power_load_kva && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Power Load</p>
                  <p className="text-lg font-bold text-foreground">{officeSpace.power_load_kva} KVA</p>
                </div>
              )}
              {officeSpace.ac_type && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">AC Type</p>
                  <p className="text-lg font-bold text-foreground capitalize">{officeSpace.ac_type.replace(/_/g, ' ')}</p>
                </div>
              )}
              {officeSpace.internet_speed_mbps && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Internet Speed</p>
                  <p className="text-lg font-bold text-foreground">{officeSpace.internet_speed_mbps} Mbps</p>
                </div>
              )}
              {officeSpace.workstation_density && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Density</p>
                  <p className="text-lg font-bold text-foreground capitalize">{officeSpace.workstation_density}</p>
                </div>
              )}
            </div>

            {/* Boolean features */}
            <div className="flex flex-wrap gap-2 mt-4">
              {officeSpace.natural_lighting && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Check className="h-3 w-3" /> Natural Lighting
                </span>
              )}
              {officeSpace.fire_safety_compliant && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Check className="h-3 w-3" /> Fire Safety Compliant
                </span>
              )}
              {officeSpace.wheelchair_accessible && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Check className="h-3 w-3" /> Wheelchair Accessible
                </span>
              )}
              {officeSpace.maintenance_included && (
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Check className="h-3 w-3" /> Maintenance Included
                </span>
              )}
              {officeSpace.electricity_included && (
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Check className="h-3 w-3" /> Electricity Included
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quick Enquiry Form */}
      <section id="enquiry" className="py-8 md:py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Contact Info */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to find your perfect workspace?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our workspace experts are here to help you find the ideal office solution. 
                Get in touch for a personalized tour and exclusive offers.
              </p>

              <div className="space-y-4">
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Call Us</p>
                    <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{COMPANY_PHONE}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP}?text=Hi, I'm interested in ${property.property_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                    <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Chat Now</p>
                  </div>
                </a>

                <a
                  href={`mailto:${COMPANY_EMAIL}?subject=Enquiry for ${property.property_name}`}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{COMPANY_EMAIL}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Enquiry Form */}
            <div className="lg:pl-8">
              <CompactEnquiryForm
                propertyId={property._id}
                propertyName={property.property_name}
                propertySlug={property.slug}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location & Connectivity */}
      <LocationConnectivity
        connectivity={property.location_connectivity}
        nearby={property.nearby}
        googleMapLink={property.google_map_link}
        address={property.address}
        city={property.city}
        state={property.state}
      />

      {/* FAQs */}
      <PropertyFaq faqs={property.faqs || []} />

      {/* Image Gallery Modal */}
      {showFullscreen && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"
          >
            <X className="h-6 w-6" />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={images[activeImage]}
            alt={property.property_name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}
    </main>
  )
}

// Compact Enquiry Form Component
function CompactEnquiryForm({ 
  propertyId, 
  propertyName, 
  propertySlug 
}: { 
  propertyId?: string
  propertyName?: string
  propertySlug?: string
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/property-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          company_name: companyName,
          team_size: teamSize,
          property_id: propertyId,
          property_name: propertyName,
          property_slug: propertySlug,
          enquiry_type: 'office_space'
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setName("")
        setPhone("")
        setCompanyName("")
        setTeamSize("")
      } else {
        setError(data.error || "Failed to submit enquiry")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-lg">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="font-bold text-foreground mb-1">Thank You!</h3>
        <p className="text-sm text-muted-foreground mb-4">Our team will contact you within 30 minutes.</p>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Submit Another Enquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-lg">
      <div className="text-center mb-2">
        <h3 className="font-bold text-foreground">Get a Free Consultation</h3>
        <p className="text-xs text-muted-foreground">Our experts will call you back</p>
      </div>

      {error && (
        <div className="p-2.5 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Phone <span className="text-destructive">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit number"
            required
            pattern="[6-9][0-9]{9}"
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Your company"
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">Team Size</label>
          <select
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">Select team size</option>
            <option value="1-5">1-5 people</option>
            <option value="6-10">6-10 people</option>
            <option value="11-25">11-25 people</option>
            <option value="26-50">26-50 people</option>
            <option value="50+">50+ people</option>
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full py-5 text-sm font-semibold rounded-xl" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Get Free Consultation"
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground">
        By submitting, you agree to our{" "}
        <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
      </p>
    </form>
  )
}
