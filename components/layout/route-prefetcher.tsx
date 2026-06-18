"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Routes to prefetch on app load for faster navigation
const ROUTES_TO_PREFETCH = [
  "/properties",
  "/about",
  "/contact",
  "/blogs",
  "/developers",
]

export default function RoutePrefetcher() {
  const router = useRouter()

  useEffect(() => {
    // Prefetch common routes after initial render
    const prefetchRoutes = () => {
      ROUTES_TO_PREFETCH.forEach(route => {
        router.prefetch(route)
      })
    }

    // Use requestIdleCallback or setTimeout as fallback
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetchRoutes)
    } else {
      setTimeout(prefetchRoutes, 1000)
    }
  }, [router])

  return null
}
