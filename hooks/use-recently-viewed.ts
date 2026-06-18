"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "countryroof_recently_viewed"
const MAX_ITEMS = 12

export interface RecentlyViewedProperty {
  id: string
  slug: string
  typeSlug?: string
  name: string
  thumbnail: string
  price: string
  address: string
  timestamp: number
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedProperty[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as RecentlyViewedProperty[]
        setItems(parsed)
      }
    } catch {
      // Invalid data, clear it
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const addProperty = useCallback((property: RecentlyViewedProperty) => {
    setItems((prev) => {
      // Remove existing entry with same id
      const filtered = prev.filter((item) => item.id !== property.id)
      // Add to front
      const updated = [{ ...property, timestamp: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
      // Persist
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Storage full or unavailable
      }
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore
    }
  }, [])

  return {
    items,
    addProperty,
    clearAll,
    mounted,
    hasItems: mounted && items.length > 0,
  }
}
