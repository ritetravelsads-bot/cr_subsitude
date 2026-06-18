"use client"

import { useState, useCallback } from "react"

export interface GeoLocation {
  latitude: number
  longitude: number
  accuracy?: number
  source: "browser" | "ip" | "default"
  city?: string
  region?: string
  country?: string
}

export interface UseGeolocationReturn {
  location: GeoLocation | null
  isLoading: boolean
  error: string | null
  permissionState: PermissionState | null
  requestLocation: () => Promise<GeoLocation | null>
  clearLocation: () => void
}

// Default location for Gurgaon (fallback)
const DEFAULT_LOCATION: GeoLocation = {
  latitude: 28.4595,
  longitude: 77.0266,
  source: "default",
  city: "Gurugram",
  region: "Haryana",
  country: "India",
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`
  }
  return `${Math.round(km)} km`
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeoLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null)

  // Check permission state
  const checkPermission = useCallback(async (): Promise<PermissionState | null> => {
    if (typeof navigator === "undefined" || !navigator.permissions) {
      return null
    }
    try {
      const result = await navigator.permissions.query({ name: "geolocation" })
      setPermissionState(result.state)
      result.addEventListener("change", () => {
        setPermissionState(result.state)
      })
      return result.state
    } catch {
      return null
    }
  }, [])

  // Get location from browser's Geolocation API
  const getBrowserLocation = useCallback((): Promise<GeoLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const geoLocation: GeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: "browser",
          }

          // Try to get city name from coordinates (reverse geocoding)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10`
            )
            if (response.ok) {
              const data = await response.json()
              geoLocation.city = data.address?.city || data.address?.town || data.address?.village
              geoLocation.region = data.address?.state
              geoLocation.country = data.address?.country
            }
          } catch {
            // Silently fail - location still valid without city name
          }

          resolve(geoLocation)
        },
        (err) => {
          let errorMessage = "Unable to retrieve your location"
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Location permission was denied"
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable"
              break
            case err.TIMEOUT:
              errorMessage = "Location request timed out"
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      )
    })
  }, [])

  // Get location from IP address as fallback
  const getIPLocation = useCallback(async (): Promise<GeoLocation> => {
    try {
      // Try multiple IP geolocation services
      const services = [
        "https://ipapi.co/json/",
        "https://ip-api.com/json/?fields=lat,lon,city,regionName,country",
      ]

      for (const serviceUrl of services) {
        try {
          const response = await fetch(serviceUrl, { 
            cache: "force-cache",
            signal: AbortSignal.timeout(5000)
          })
          
          if (response.ok) {
            const data = await response.json()
            
            // Handle ipapi.co format
            if (data.latitude && data.longitude) {
              return {
                latitude: data.latitude,
                longitude: data.longitude,
                source: "ip",
                city: data.city,
                region: data.region,
                country: data.country_name,
              }
            }
            
            // Handle ip-api.com format
            if (data.lat && data.lon) {
              return {
                latitude: data.lat,
                longitude: data.lon,
                source: "ip",
                city: data.city,
                region: data.regionName,
                country: data.country,
              }
            }
          }
        } catch {
          // Try next service
          continue
        }
      }

      throw new Error("All IP geolocation services failed")
    } catch (err) {
      throw new Error("Could not determine location from IP address")
    }
  }, [])

  // Main function to request location
  const requestLocation = useCallback(async (): Promise<GeoLocation | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // First check permission state
      const permission = await checkPermission()

      // If permission is denied, skip browser geolocation and go straight to IP
      if (permission === "denied") {
        try {
          const ipLocation = await getIPLocation()
          setLocation(ipLocation)
          return ipLocation
        } catch {
          // Fall back to default location
          setLocation(DEFAULT_LOCATION)
          setError("Using default location (Gurugram)")
          return DEFAULT_LOCATION
        }
      }

      // Try browser geolocation first
      try {
        const browserLocation = await getBrowserLocation()
        setLocation(browserLocation)
        return browserLocation
      } catch (browserError) {
        // Browser geolocation failed, try IP-based
        console.log("[v0] Browser geolocation failed, trying IP-based:", browserError)
        
        try {
          const ipLocation = await getIPLocation()
          setLocation(ipLocation)
          return ipLocation
        } catch {
          // Both failed, use default
          setLocation(DEFAULT_LOCATION)
          setError("Using default location (Gurugram)")
          return DEFAULT_LOCATION
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get location"
      setError(errorMessage)
      // Still return default location so search can proceed
      setLocation(DEFAULT_LOCATION)
      return DEFAULT_LOCATION
    } finally {
      setIsLoading(false)
    }
  }, [checkPermission, getBrowserLocation, getIPLocation])

  const clearLocation = useCallback(() => {
    setLocation(null)
    setError(null)
  }, [])

  return {
    location,
    isLoading,
    error,
    permissionState,
    requestLocation,
    clearLocation,
  }
}
