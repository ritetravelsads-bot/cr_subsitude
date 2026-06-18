"use client"

import { useState, useEffect, useRef, startTransition, useCallback } from "react"
import { Search, Building2, Home, MapPin, Sparkles, ArrowRight, Mic, MicOff, Loader2, X, Navigation, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn, BUDGET_RANGES, formatPriceToIndian, getPropertyUrl } from "@/lib/utils"
import { useVoiceSearch } from "@/hooks/use-voice-search"
import { useGeolocation, type GeoLocation } from "@/hooks/use-geolocation"

const PLACEHOLDER_SUGGESTIONS = [
  "3 BHK in Gurgaon",
  "2 BHK near me",
  "Luxury apartments Sector 65",
  "Properties near metro",
  "4 BHK with swimming pool",
  "Ready to move in DLF Phase 5",
  "Villas close to airport",
  "Golf Course Road",
  "Under 2 Cr apartments",
  "New launch projects near me",
  "3 BHK with gym nearby",
  "SCO Plots Dwarka Expressway",
]

const CATEGORIES = [
  { name: "Apartments", icon: Building2, href: "/properties?category=apartment", color: "bg-blue-500/10 text-blue-600" },
  { name: "Villas", icon: Home, href: "/properties?category=villa", color: "bg-emerald-500/10 text-emerald-600" },
  { name: "Plots", icon: MapPin, href: "/properties?category=plot", color: "bg-amber-500/10 text-amber-600" },
  { name: "SCO", icon: Building2, href: "/properties?category=sco", color: "bg-purple-500/10 text-purple-600" },
  { name: "Commercial", icon: Building2, href: "/properties?category=commercial", color: "bg-rose-500/10 text-rose-600" },
  { name: "Floors", icon: Home, href: "/properties?category=independent_floor", color: "bg-cyan-500/10 text-cyan-600" },
]

// Budget categories for quick selection
const BUDGET_CATEGORIES = BUDGET_RANGES.slice(0, 6).map((range) => ({
  name: range.label,
  href: `/properties?minPrice=${range.min}${range.max ? `&maxPrice=${range.max}` : ''}`,
}))

const locations = [
  "Dwarka Expressway",
  "Golf Course Road",
  "Sohna Road",
  "Sushant Lok",
  "New Gurgaon",
  "Southern Peripheral Road",
  "Golf Course Extn Road",
  "NH-48",
]

const projectTypes = [
  "SCO Plots",
  "Plots In Gurugram",
  "Luxury Apartment",
  "Residential Projects",
  "Commercial Projects",
  "Independent Floors",
]

const projectStatus = ["Upcoming Projects", "New Launch Projects", "Under Construction", "Ready To Move"]

// Near me search patterns to detect
const NEAR_ME_PATTERNS = [
  /near\s*(?:me|by|here)/i,
  /nearby/i,
  /close\s*(?:to\s*me|by)/i,
  /around\s*(?:me|here)/i,
  /in\s*my\s*(?:area|location|vicinity)/i,
  /closest/i,
  /nearest/i,
]

function isNearMeQuery(query: string): boolean {
  return NEAR_ME_PATTERNS.some(pattern => pattern.test(query))
}

interface VoiceSearchResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  parsed: {
    locations: string[]
    propertyTypes: string[]
    bhk: number | null
    budget: { min: number | null; max: number | null } | null
    status: string[]
    segments: string[]
    developers: string[]
    keywords: string[]
    isNearMeSearch?: boolean
    maxDistanceKm?: number | null
    // New fields
    amenities?: string[]
    connectivityTypes?: string[]
    possessionYear?: string | null
    sectors?: string[]
    nearbyLandmarks?: string[]
  }
  location?: {
    latitude: number
    longitude: number
    source: string
    city?: string
  } | null
}

export default function AdvancedSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [properties, setProperties] = useState<any[]>([])
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("3 BHK in Gurgaon")
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Voice search specific states
  const [voiceSearchResults, setVoiceSearchResults] = useState<VoiceSearchResult | null>(null)
  const [isVoiceSearching, setIsVoiceSearching] = useState(false)
  const [showVoiceResults, setShowVoiceResults] = useState(false)
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle")
  const voiceSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Geolocation hook
  const { 
    location: userLocation, 
    isLoading: isGettingLocation, 
    error: locationError,
    requestLocation,
    permissionState 
  } = useGeolocation()

  // Perform voice search API call with optional location
  const performVoiceSearch = useCallback(async (query: string, location?: GeoLocation | null) => {
    if (!query.trim()) return
    
    setIsVoiceSearching(true)
    try {
      // Build URL with location params if available
      let url = `/api/search/voice?q=${encodeURIComponent(query)}&limit=6`
      
      if (location) {
        url += `&lat=${location.latitude}&lng=${location.longitude}`
        url += `&loc_source=${location.source}`
        if (location.city) {
          url += `&city=${encodeURIComponent(location.city)}`
        }
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setVoiceSearchResults(data)
        setShowVoiceResults(true)
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error("[v0] Voice search error:", error)
    } finally {
      setIsVoiceSearching(false)
    }
  }, [])
  
  // Handle voice search with location detection for "near me" queries
  const handleVoiceResult = useCallback(async (text: string) => {
    setSearchTerm(text)
    
    // Check if this is a "near me" type query
    const isNearMe = isNearMeQuery(text)
    
    if (isNearMe) {
      // We need location for this query
      setLocationStatus("requesting")
      
      try {
        const location = await requestLocation()
        setLocationStatus(location ? "granted" : "denied")
        
        // Debounce and perform search with location
        if (voiceSearchTimeoutRef.current) {
          clearTimeout(voiceSearchTimeoutRef.current)
        }
        voiceSearchTimeoutRef.current = setTimeout(() => {
          performVoiceSearch(text, location)
        }, 300)
      } catch {
        setLocationStatus("error")
        // Still perform search without location
        if (voiceSearchTimeoutRef.current) {
          clearTimeout(voiceSearchTimeoutRef.current)
        }
        voiceSearchTimeoutRef.current = setTimeout(() => {
          performVoiceSearch(text, null)
        }, 300)
      }
    } else {
      // Regular search without location
      setLocationStatus("idle")
      if (voiceSearchTimeoutRef.current) {
        clearTimeout(voiceSearchTimeoutRef.current)
      }
      voiceSearchTimeoutRef.current = setTimeout(() => {
        performVoiceSearch(text, userLocation)
      }, 500)
    }
  }, [requestLocation, performVoiceSearch, userLocation])

  const { isListening, isSupported: voiceSupported, startListening, stopListening, error: voiceError } = useVoiceSearch({
    lang: "en-IN", // Use Indian English for better recognition
    onResult: handleVoiceResult,
  })
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (voiceSearchTimeoutRef.current) {
        clearTimeout(voiceSearchTimeoutRef.current)
      }
    }
  }, [])

  // Typewriter effect for placeholder - deferred to not block LCP
  const [animationReady, setAnimationReady] = useState(false)

  // Defer animation start until after LCP
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => {
        startTransition(() => setAnimationReady(true))
      }, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    } else {
      const timeout = setTimeout(() => {
        startTransition(() => setAnimationReady(true))
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (searchTerm || !animationReady) return // Don't animate if user is typing or not ready

    const currentSuggestion = PLACEHOLDER_SUGGESTIONS[placeholderIndex]
    let charIndex = 0
    let isDeleting = false

    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        if (charIndex <= currentSuggestion.length) {
          setDisplayedPlaceholder(currentSuggestion.slice(0, charIndex))
          charIndex++
        } else {
          setTimeout(() => {
            isDeleting = true
          }, 2000)
        }
      } else {
        if (charIndex > 0) {
          charIndex--
          setDisplayedPlaceholder(currentSuggestion.slice(0, charIndex))
        } else {
          isDeleting = false
          setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearInterval(typeInterval)
  }, [placeholderIndex, searchTerm, animationReady])

  // Defer property fetching to not block initial render - only fetch when user focuses on search
  useEffect(() => {
    if (!showSuggestions || properties.length > 0) return

    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties?limit=50&fields=property_name,address,neighborhood")
        const data = await response.json()
        setProperties(data.properties || [])
      } catch {
        // Silently fail - suggestions will work with static data
      }
    }

    // Use requestIdleCallback to not block main thread
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(fetchProperties)
    } else {
      setTimeout(fetchProperties, 200)
    }
  }, [showSuggestions, properties.length])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setShowVoiceResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    const allSuggestions = [
      ...locations,
      ...projectTypes,
      ...projectStatus,
      ...properties.map((p) => p.property_name),
      ...properties.map((p) => p.address),
      ...properties.map((p) => p.neighborhood),
    ]

    const filtered = allSuggestions
      .filter((item) => item && item.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((item, index, self) => self.indexOf(item) === index)
      .slice(0, 8)

    setSuggestions(filtered)
  }, [searchTerm, properties])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShowVoiceResults(false)
      setVoiceSearchResults(null)
      router.push(`/properties?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    setShowVoiceResults(false)
    router.push(`/properties?search=${encodeURIComponent(suggestion)}`)
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleVoiceResultClick = (property: any) => {
    setShowVoiceResults(false)
    setVoiceSearchResults(null)
    router.push(getPropertyUrl(property))
  }
  
  const closeVoiceResults = () => {
    setShowVoiceResults(false)
    setVoiceSearchResults(null)
    setLocationStatus("idle")
  }
  
  // Get location source badge text
  const getLocationBadge = (source: string) => {
    switch (source) {
      case "browser":
        return "GPS Location"
      case "ip":
        return "Approximate Location"
      case "default":
        return "Default Location"
      default:
        return "Location"
    }
  }

  return (
    <div className="relative -mt-10 z-10 max-w-5xl mx-auto px-4">
      {/* Fixed min-height to prevent CLS */}
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[220px] md:min-h-[200px]"
        ref={searchRef}
      >
        {/* Main Search Area */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">Luxury Properties in Gurgaon</h2>
              <p className="text-xs text-muted-foreground">Explore RERA-verified apartments, villas & plots across Dwarka Expressway, Golf Course Road & SPR. Zero brokerage. Trusted developers only. </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                ref={inputRef}
                type="text"
                placeholder={searchTerm ? "" : `Search "${displayedPlaceholder}|"`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(true)
                  setIsTyping(e.target.value.length > 0)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
                className={cn(
                  "w-full h-14 pl-12 pr-12 text-base rounded-xl",
                  "border-2 border-border bg-muted/30",
                  "focus:outline-none focus:border-primary focus:bg-background",
                  "transition-all duration-300",
                  "placeholder:text-muted-foreground/60"
                )}
              />

              {/* Voice Search Button */}
              {voiceSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-300",
                    isListening
                      ? "bg-destructive/10 text-destructive voice-pulse"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  )}
                  aria-label={isListening ? "Stop voice search" : "Start voice search"}
                  title={isListening ? 'Listening... Try "2 BHK near me"' : 'Search by voice - Try "2 BHK near me"'}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}

              {/* Voice Error Message */}
              {voiceError && (
                <p className="absolute -bottom-6 left-0 text-xs text-destructive">{voiceError}</p>
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && !showVoiceResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Suggestions</p>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 group"
                      >
                        <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                          <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{suggestion}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Location Request / Voice Search Loading Indicator */}
              {(isVoiceSearching || locationStatus === "requesting" || isGettingLocation) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-3">
                    {locationStatus === "requesting" || isGettingLocation ? (
                      <>
                        <div className="relative">
                          <Navigation className="h-5 w-5 text-primary" />
                          <Loader2 className="h-3 w-3 text-primary animate-spin absolute -bottom-1 -right-1" />
                        </div>
                        <div>
                          <span className="text-sm text-foreground font-medium">Getting your location...</span>
                          <p className="text-xs text-muted-foreground">This helps find properties near you</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        <span className="text-sm text-muted-foreground">Searching for properties...</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Voice Search Results Dropdown */}
              {showVoiceResults && voiceSearchResults && !isVoiceSearching && !isGettingLocation && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl max-h-[450px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3">
                    {/* Header with parsed info */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          {voiceSearchResults.parsed?.isNearMeSearch ? (
                            <Navigation className="h-4 w-4 text-primary" />
                          ) : (
                            <Mic className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {voiceSearchResults.parsed?.isNearMeSearch ? "Properties Near You" : "Voice Search Results"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Found {voiceSearchResults.pagination.total} properties
                            {voiceSearchResults.parsed?.isNearMeSearch && voiceSearchResults.parsed?.maxDistanceKm && (
                              <span> within {voiceSearchResults.parsed.maxDistanceKm} km</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={closeVoiceResults}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    
                    {/* Location Info Banner (for near-me searches) */}
                    {voiceSearchResults.location && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100 mb-3">
                        <Navigation className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-blue-700 font-medium">
                            {getLocationBadge(voiceSearchResults.location.source)}
                          </p>
                          {voiceSearchResults.location.city && (
                            <p className="text-[10px] text-blue-600 truncate">
                              {voiceSearchResults.location.city}
                            </p>
                          )}
                        </div>
                        {voiceSearchResults.location.source === "ip" && (
                          <div className="flex items-center gap-1 text-[9px] text-blue-500">
                            <AlertCircle className="h-3 w-3" />
                            <span>~5km accuracy</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Parsed Filters Tags */}
                    {voiceSearchResults.parsed && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {voiceSearchResults.parsed.isNearMeSearch && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                            <Navigation className="h-2.5 w-2.5" />
                            Near Me
                          </span>
                        )}
                        {voiceSearchResults.parsed.locations.map((loc, i) => (
                          <span key={`loc-${i}`} className="px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-full">
                            {loc}
                          </span>
                        ))}
                        {voiceSearchResults.parsed.propertyTypes.map((type, i) => (
                          <span key={`type-${i}`} className="px-2 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-700 rounded-full">
                            {type}
                          </span>
                        ))}
                        {voiceSearchResults.parsed.bhk && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-700 rounded-full">
                            {voiceSearchResults.parsed.bhk} BHK
                          </span>
                        )}
                        {voiceSearchResults.parsed.budget && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded-full">
                            {voiceSearchResults.parsed.budget.max 
                              ? `Under ${formatPriceToIndian(voiceSearchResults.parsed.budget.max)}`
                              : voiceSearchResults.parsed.budget.min 
                                ? `From ${formatPriceToIndian(voiceSearchResults.parsed.budget.min)}`
                                : ""}
                          </span>
                        )}
                        {voiceSearchResults.parsed.status.map((st, i) => (
                          <span key={`st-${i}`} className="px-2 py-0.5 text-[10px] font-medium bg-cyan-100 text-cyan-700 rounded-full">
                            {st.replace(/_/g, " ")}
                          </span>
                        ))}
                        {voiceSearchResults.parsed.developers.map((dev, i) => (
                          <span key={`dev-${i}`} className="px-2 py-0.5 text-[10px] font-medium bg-rose-100 text-rose-700 rounded-full">
                            {dev}
                          </span>
                        ))}
                        {voiceSearchResults.parsed.sectors?.map((sector, i) => (
                          <span key={`sector-${i}`} className="px-2 py-0.5 text-[10px] font-medium bg-indigo-100 text-indigo-700 rounded-full capitalize">
                            {sector}
                          </span>
                        ))}
                        {voiceSearchResults.parsed.amenities?.map((amenity, i) => (
                          <span key={`amenity-${i}`} className="px-2 py-0.5 text-[10px] font-medium bg-teal-100 text-teal-700 rounded-full capitalize">
                            {amenity}
                          </span>
                        ))}
                        {voiceSearchResults.parsed.connectivityTypes?.map((type, i) => (
                          <span key={`conn-${i}`} className="px-2 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-700 rounded-full capitalize flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {type}
                          </span>
                        ))}
                        {voiceSearchResults.parsed.nearbyLandmarks?.map((landmark, i) => (
                          <span key={`landmark-${i}`} className="px-2 py-0.5 text-[10px] font-medium bg-sky-100 text-sky-700 rounded-full capitalize">
                            Near {landmark}
                          </span>
                        ))}
                        {voiceSearchResults.parsed.possessionYear && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-lime-100 text-lime-700 rounded-full">
                            {voiceSearchResults.parsed.possessionYear === "immediate" 
                              ? "Ready to Move" 
                              : `Possession ${voiceSearchResults.parsed.possessionYear}`}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Property Results */}
                    {voiceSearchResults.properties.length > 0 ? (
                      <div className="space-y-2">
                        {voiceSearchResults.properties.map((property) => (
                          <button
                            key={property._id}
                            onClick={() => handleVoiceResultClick(property)}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-muted transition-colors flex items-center gap-3 group border border-transparent hover:border-border"
                          >
                            {/* Property Thumbnail */}
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              {property.main_thumbnail ? (
                                <img 
                                  src={property.main_thumbnail} 
                                  alt={property.property_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Building2 className="h-5 w-5 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            
                            {/* Property Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {property.property_name}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="h-3 w-3" />
                                  {property.city || property.address?.split(",")[0]}
                                </span>
                                {property.bedrooms > 0 && (
                                  <span className="px-1.5 py-0.5 bg-muted rounded">
                                    {property.bedrooms} BHK
                                  </span>
                                )}
                                {/* Distance badge for near-me searches */}
                                {property.distanceText && (
                                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded flex items-center gap-0.5">
                                    <Navigation className="h-2.5 w-2.5" />
                                    {property.distanceText}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-semibold text-primary">
                                {formatPriceToIndian(property.lowest_price)}
                              </p>
                              {property.max_price && property.max_price !== property.lowest_price && (
                                <p className="text-[10px] text-muted-foreground">onwards</p>
                              )}
                            </div>
                            
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </button>
                        ))}
                        
                        {/* View All Results Button */}
                        {voiceSearchResults.pagination.total > 6 && (
                          <button
                            onClick={handleSearch}
                            className="w-full p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            View all {voiceSearchResults.pagination.total} results
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <Building2 className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No properties found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {voiceSearchResults.parsed?.isNearMeSearch 
                            ? "Try increasing the search radius or search in a different area"
                            : "Try a different search term"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSearch}
              size="lg"
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="border-t border-border bg-muted/20 px-6 md:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Explore Properties by Category</p>
            <Link
              href="/properties"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap",
                  "border border-border bg-background",
                  "hover:border-primary/30 hover:shadow-sm",
                  "transition-all duration-200",
                  "group"
                )}
              >
                <div className={cn("p-1 rounded-md", category.color)}>
                  <category.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
