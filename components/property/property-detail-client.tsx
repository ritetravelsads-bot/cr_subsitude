"use client"

import { useState, useEffect } from "react"
import {
  MapPin, Bed, Bath, Square, Building2,
  ChevronLeft, ChevronRight, Car, Compass, Layers,
  IndianRupee, Warehouse, Building, Home,
  Share2, Heart, Video, ImageIcon,
  Check, Phone, Mail, Calendar, ArrowLeft,
  Shield, Clock, TreePine, Dumbbell,
  Waves, Wifi, Zap, Wind, Sun, FileText,
  ExternalLink, Ruler, Grid3X3, Users, Mountain, X,
  User, Loader2, ChevronRight as ChevronRightIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import { cn, formatPriceToIndian } from "@/lib/utils"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

// Import modular components
import { HeroBanner } from "@/components/property/hero-banner"
import { ProjectHighlights } from "@/components/property/project-highlights"
import { UnitsSection } from "@/components/property/units-section"
import { FloorPlanTabs } from "@/components/property/floor-plan-tabs"
import { MasterPlanSection } from "@/components/property/master-plan-section"
import { LocationConnectivity } from "@/components/property/location-connectivity"
import { DeveloperProjects } from "@/components/property/developer-projects"
import { PropertyFaq } from "@/components/property/property-faq"
import { BrochureDownload } from "@/components/property/brochure-download"
import { SpecialSectionsRenderer } from "@/components/property/special-section"
import OfficeSpaceDetails from "@/components/property/office-space-details"

// Amenity icon mapping
const AMENITY_ICONS: Record<string, any> = {
  "swimming pool": Waves, "pool": Waves, "gym": Dumbbell, "fitness": Dumbbell,
  "wifi": Wifi, "internet": Wifi, "garden": TreePine, "park": TreePine,
  "parking": Car, "security": Shield, "power backup": Zap, "electricity": Zap,
  "ac": Wind, "air conditioning": Wind, "sunlight": Sun, "view": Mountain,
}

function getAmenityIcon(amenity: string) {
  const lowerAmenity = amenity.toLowerCase()
  for (const [key, Icon] of Object.entries(AMENITY_ICONS)) {
    if (lowerAmenity.includes(key)) return Icon
  }
  return Check
}

interface PropertyDetailClientProps {
  property: any
  developer: any
  propertyTypeSlug?: string
  propertyTypeDisplayName?: string
}

export function PropertyDetailClient({ 
  property, 
  developer,
  propertyTypeSlug = "residential",
  propertyTypeDisplayName = "Residential"
}: PropertyDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addProperty: addToRecentlyViewed } = useRecentlyViewed()

  // Track as recently viewed
  useEffect(() => {
    if (property) {
      addToRecentlyViewed({
        id: property._id,
        slug: property.slug,
        typeSlug: propertyTypeSlug,
        name: property.property_name || "Property",
        thumbnail: property.main_thumbnail || "",
        price: formatPriceToIndian(property.lowest_price) || "",
        address: `${property.address || ""}, ${property.city || ""}`.replace(/^, |, $/g, ""),
        timestamp: Date.now(),
      })
    }
  }, [property, addToRecentlyViewed])

  const images = [property.main_banner || property.main_thumbnail, ...(property.multiple_images || [])].filter(Boolean)

  const formatPrice = (price: number) => formatPriceToIndian(price)

  const getPropertyTypeIcon = () => {
    const type = property.property_type?.toLowerCase() || ""
    if (type.includes("apartment") || type.includes("flat")) return Building2
    if (type.includes("villa") || type.includes("house")) return Home
    if (type.includes("plot") || type.includes("land")) return Layers
    if (type.includes("office") || type.includes("commercial") || type.includes("sco")) return Building
    if (type.includes("warehouse")) return Warehouse
    return Home
  }
  const PropertyTypeIcon = getPropertyTypeIcon()

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "ready_to_move": "Ready to Move", "ready": "Ready", "under_construction": "Under Construction",
      "launched": "New Launch", "upcoming": "Upcoming", "resale": "Resale"
    }
    return labels[status] || status?.replace(/_/g, " ")
  }

  const isResidential = ["apartment", "villa", "house", "flat", "penthouse", "duplex", "studio", "independent"].some(
    t => property.property_type?.toLowerCase().includes(t)
  )

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length)

  // Create key-value specs to display
  const allSpecs = [
    { label: "Property Type", value: property.property_type, icon: Building2 },
    { label: "Listing Type", value: property.listing_type?.replace(/_/g, " "), icon: FileText },
    { label: "Category", value: property.property_category, icon: Grid3X3 },
    { label: "Project Status", value: getStatusLabel(property.project_status || property.possession_type), icon: Clock },
    { label: "Bedrooms", value: property.bedrooms, icon: Bed, show: isResidential && property.bedrooms > 0 },
    { label: "Bathrooms", value: property.bathrooms, icon: Bath, show: isResidential && property.bathrooms > 0 },
    { label: "Balconies", value: property.balconies_count, icon: Mountain, show: property.balconies_count > 0 },
    { label: "Carpet Area", value: property.carpet_area ? `${property.carpet_area} sqft` : null, icon: Square },
    { label: "Built-up Area", value: property.built_up_area ? `${property.built_up_area} sqft` : null, icon: Ruler },
    { label: "Super Area", value: property.super_area ? `${property.super_area} sqft` : null, icon: Layers },
    { label: "Area", value: property.area_sqft ? `${property.area_sqft} sqft` : null, icon: Square },
    { label: "Property Size", value: property.property_size, icon: Ruler },
    { label: "Facing", value: property.direction_facing?.replace(/_/g, " "), icon: Compass },
    { label: "Floor", value: property.floor_number ? `${property.floor_number}${property.total_floors ? ` of ${property.total_floors}` : ""}` : null, icon: Layers },
    { label: "Total Floors", value: property.total_floors, icon: Building },
    { label: "Parking", value: property.parking_count ? `${property.parking_count} (${property.parking_type || "Open"})` : null, icon: Car },
    { label: "Furnished", value: property.furnished_type?.replace(/_/g, " "), icon: Home },
    { label: "Possession", value: property.possession || property.possession_year_quarter, icon: Calendar },
    { label: "Developer", value: property.developer_name || developer?.name, icon: Building },
    { label: "Brand Collection", value: property.brand_collection, icon: FileText },
    { label: "Target Segment", value: property.target_segment, icon: Users },
    { label: "Total Towers", value: property.total_towers, icon: Building },
    { label: "Total Units", value: property.total_units, icon: Grid3X3 },
    { label: "Total Acreage", value: property.total_acreage ? `${property.total_acreage} acres` : null, icon: Ruler },
    { label: "Booking Amount", value: property.booking_amount ? `${formatPrice(property.booking_amount)}` : null, icon: IndianRupee },
    { label: "Payment Plan", value: property.payment_plan, icon: FileText },
  ].filter(spec => spec.value && (spec.show === undefined || spec.show))

  // Combine all amenities for display
  const allAmenities = [
    ...(property.amenities || []),
    ...(property.facilities || []),
    ...(property.luxury_amenities || [])
  ]

  // Manager info
  const manager = property.assigned_manager || property.manager || {
    name: property.agent_name || "CountryRoof Expert",
    phone: property.agent_phone || "+91 98737 02365",
    email: property.agent_email || "contact@countryroof.in",
    photo: property.agent_photo
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto">
            <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">Home</Link>
            <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
            <Link href="/properties" className="hover:text-primary transition-colors whitespace-nowrap">Properties</Link>
            <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
            <Link href={`/properties/${propertyTypeSlug}`} className="hover:text-primary transition-colors whitespace-nowrap">
              {propertyTypeDisplayName}
            </Link>
            <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{property.property_name}</span>
          </nav>
        </div>
      </div>

      {/* Section 1: Hero Banner */}
      <HeroBanner property={property} />

      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/properties" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="hidden sm:block">
              <p className="font-semibold text-sm line-clamp-1">{property.property_name}</p>
              <p className="text-xs text-muted-foreground">{property.city}, {property.state}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isLiked ? "bg-rose-100 text-rose-500" : "hover:bg-muted"
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <Button size="sm" asChild>
              <a href="#enquiry">Enquire Now</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2: About Section */}
      {property.about_project && (
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-foreground">About {property.property_name}</h2>
              </div>
            </div>
            <div className="max-w-none">
              {property.about_subheading && (
                <h3 className="text-base md:text-lg font-semibold text-foreground/90 mb-3">
                  {property.about_subheading}
                </h3>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.about_project}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Special Sections - After About */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_about" />

      {/* Section 3: Project Highlights */}
      <ProjectHighlights highlights={property.project_highlights || []} />

      {/* Special Sections - After Highlights */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_highlights" />

      {/* Section 4: Property Details with Manager Contact */}
      {allSpecs.length > 0 && (
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Property Details */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
                    <FileText className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-foreground">Property Details</h2>
                    <p className="text-muted-foreground text-xs">Complete specifications</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {allSpecs.map((spec, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-colors">
                      <spec.icon className="h-4 w-4 text-primary mb-1.5" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{spec.label}</p>
                      <p className="text-xs font-semibold text-foreground capitalize truncate">{spec.value}</p>
                    </div>
                  ))}
                </div>

                {/* RERA Info */}
                {(property.rera_registered || property.rera_id) && (
                  <div className="mt-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-400">RERA Registered</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {property.rera_id && (
                        <p><span className="text-muted-foreground">RERA ID:</span> <span className="font-medium">{property.rera_id}</span></p>
                      )}
                      {property.rera_website_link && (
                        <a href={property.rera_website_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                          <ExternalLink className="h-3 w-3" />View on RERA Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Manager Contact - Highlighted */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-2xl p-5 sticky top-24">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
                      {manager.photo ? (
                        <img src={manager.photo} alt={manager.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="h-7 w-7 text-primary-foreground" />
                      )}
                    </div>
                    <h3 className="font-bold text-foreground">{manager.name}</h3>
                    <p className="text-xs text-muted-foreground">Property Expert</p>
                  </div>

                  <div className="space-y-3">
                    <a 
                      href={`tel:${manager.phone}`}
                      className="flex items-center gap-3 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs opacity-90">Call Now</p>
                        <p className="font-semibold text-sm">{manager.phone}</p>
                      </div>
                    </a>

                    {manager.email && (
                      <a 
                        href={`mailto:${manager.email}?subject=Enquiry for ${property.property_name}`}
                        className="flex items-center gap-3 p-3 bg-card border border-border hover:border-primary/50 rounded-xl transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium text-sm text-foreground truncate">{manager.email}</p>
                        </div>
                      </a>
                    )}

                    <a 
                      href={`https://wa.me/${manager.phone?.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in ${property.property_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs opacity-90">WhatsApp</p>
                        <p className="font-semibold text-sm">Chat Now</p>
                      </div>
                    </a>
                  </div>

                  <p className="text-[10px] text-center text-muted-foreground mt-4">
                    Available Mon-Sat, 9 AM - 7 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Special Sections - After Details */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_details" />

      {/* Section 5: Enquiry Form - Compact */}
      <section id="enquiry" className="py-8 md:py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">Quick Enquiry</h2>
              <p className="text-sm text-muted-foreground">Get callback within 30 minutes</p>
            </div>
            <CompactEnquiryForm 
              propertyId={property._id}
              propertyName={property.property_name}
              propertySlug={property.slug}
            />
          </div>
        </div>
      </section>

      {/* Special Sections - After Enquiry */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_enquiry" />

      {/* Section 6: Units Specified */}
      <UnitsSection units={property.units} configurations={property.configurations} />

      {/* Special Sections - After Units */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_units" />

      {/* Section 7: Amenities */}
      {allAmenities.length > 0 && (
        <section className="py-10 md:py-14 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.02]" />

          <div className="max-w-6xl mx-auto px-4 relative">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold mb-3 tracking-wide">
                <Check className="h-3 w-3" />
                WORLD-CLASS LIVING
              </div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">Amenities & Facilities</h2>
              <p className="text-muted-foreground text-xs mt-1">{allAmenities.length} Premium amenities for modern lifestyle</p>
            </div>

            {/* Amenities Grid - Compact Masonry Style */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {allAmenities.map((amenity: string, idx: number) => {
                const Icon = getAmenityIcon(amenity)
                const isHighlight = idx < 100

                return (
                  <div
                    key={idx}
                    className={cn(
                      "group relative flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200",
                      isHighlight
                        ? "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40"
                        : "bg-card border border-border hover:border-primary/30 hover:shadow-sm",
                      "hover:-translate-y-0.5"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      isHighlight
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium text-foreground truncate">{amenity}</span>

                    {/* Checkmark for highlights */}
                    {isHighlight && (
                      <Check className="h-3 w-3 text-primary ml-auto flex-shrink-0 opacity-60" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Bottom decorative line */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
            </div>
          </div>
        </section>
      )}

      {/* Special Sections - After Amenities */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_amenities" />

      {/* Section 8: Gallery */}
      {images.length > 1 && (
        <section className="py-10 md:py-14 bg-gradient-to-b from-muted/30 to-muted/50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

          <div className="max-w-6xl mx-auto px-4 relative">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <ImageIcon className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-foreground">Project Gallery</h2>
                  <p className="text-muted-foreground text-xs">{images.length} Images</p>
                </div>
              </div>

              {property.walkthrough_video && (
                <a
                  href={property.walkthrough_video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  <Video className="h-3 w-3" />
                  <span>Watch Video</span>
                </a>
              )}
            </div>

            {/* Gallery Grid - Bento Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {images.slice(0, 8).map((img: string, idx: number) => {
                // First image is larger
                const isLarge = idx === 0

                return (
                  <button
                    key={idx}
                    onClick={() => { setActiveImage(idx); setShowFullscreen(true); }}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border-2 border-transparent hover:border-primary/50 transition-all duration-300",
                      isLarge ? "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-square" : "aspect-[4/3]"
                    )}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* View icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <ImageIcon className="h-4 w-4 text-foreground" />
                      </div>
                    </div>

                    {/* Image number badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                      {idx + 1}/{images.length}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Show more if there are more images */}
            {images.length > 8 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => { setActiveImage(0); setShowFullscreen(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  View All {images.length} Images
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Special Sections - After Gallery */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_gallery" />

      {/* Section 9: Floor Plans */}
      <FloorPlanTabs 
        floorPlans={property.floor_plans || []} 
        configurations={property.configurations}
        units={property.units}
      />

      {/* Section 9b: Master Plan */}
      <MasterPlanSection 
        masterPlan={property.master_plan} 
        propertyName={property.property_name}
      />

      {/* Special Sections - After Floor Plans */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_floor_plans" />

      {/* Section 9c: Office Space Details (for commercial/office properties) */}
      {(property.office_space || property.commercial_lease) && (
        <OfficeSpaceDetails 
          officeSpace={property.office_space}
          commercialLease={property.commercial_lease}
        />
      )}

      {/* Section 10: Location & Connectivity */}
      <LocationConnectivity
        connectivity={property.location_connectivity}
        nearby={property.nearby}
        googleMapLink={property.google_map_link}
        address={property.address}
        city={property.city}
        state={property.state}
      />

      {/* Special Sections - After Location */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="after_location" />

      {/* Section 11: About Developer */}
      <DeveloperProjects
        developerId={property.developer_id}
        developerSlug={developer?.slug}
        developerName={property.developer_name || developer?.name}
        excludePropertyId={property._id}
      />

      {/* Section 12: Download Brochure */}
      <BrochureDownload brochureUrl={property.brochure_pdf} propertyName={property.property_name} />

      {/* Special Sections - Before FAQs */}
      <SpecialSectionsRenderer sections={property.special_sections || []} position="before_faq" />

      {/* Section 13: FAQs */}
      <PropertyFaq faqs={property.faqs || []} />

      {/* Fullscreen Gallery */}
      {showFullscreen && (
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
          property_id: propertyId,
          property_name: propertyName,
          property_slug: propertySlug
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setName("")
        setPhone("")
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
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-3">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="font-bold text-foreground mb-1">Thank You!</h3>
        <p className="text-sm text-muted-foreground mb-4">Our team will call you shortly.</p>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Submit Another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-lg">
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
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Phone <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit number"
              required
              pattern="[6-9][0-9]{9}"
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
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
          "Get Callback"
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground">
        By submitting, you agree to our{" "}
        <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
      </p>
    </form>
  )
}
