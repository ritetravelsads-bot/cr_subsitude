"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Reset on route change complete
    setIsNavigating(false)
    setProgress(100)
    
    const timeout = setTimeout(() => setProgress(0), 200)
    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  useEffect(() => {
    let progressInterval: NodeJS.Timeout

    const handleNavigationStart = () => {
      setIsNavigating(true)
      setProgress(0)
      
      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)
    }

    // Listen for click events on links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")
      
      if (link && link.href && !link.href.startsWith("#") && !link.target && link.origin === window.location.origin) {
        // Internal navigation detected
        if (link.pathname !== pathname) {
          handleNavigationStart()
        }
      }
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [pathname])

  if (progress === 0 && !isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-200 ease-out"
        style={{ 
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1
        }}
      />
    </div>
  )
}
