"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

const WHATSAPP_NUMBER = "919873702365"
const DEFAULT_MESSAGE = "Hi, I'm interested in properties on CountryRoof. Please share more details."

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Slide in after LCP to not compete for resources
    // Using requestIdleCallback with longer timeout for non-critical UI
    const showButton = () => setIsVisible(true)
    
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(showButton, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    } else {
      const timer = setTimeout(showButton, 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Show tooltip briefly after button appears
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowTooltip(true), 3000)
      const hideTimer = setTimeout(() => setShowTooltip(false), 8000)
      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
  }, [isVisible])

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-500",
        "bottom-20 right-4 md:bottom-6 md:right-6",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      )}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative bg-foreground text-background text-sm px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-2">
            Need help finding a property?
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowTooltip(false)
              }}
              className="text-background/60 hover:text-background transition-colors"
              aria-label="Dismiss tooltip"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-foreground rotate-45" />
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center justify-center",
          "w-14 h-14 rounded-full",
          "bg-[#25D366] hover:bg-[#20BD5A] text-white",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-300 hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        )}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  )
}

export function PropertyWhatsAppLink({ propertyName }: { propertyName: string }) {
  const message = `Hi, I'm interested in "${propertyName}". Please share more details.`
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "flex items-center justify-center",
        // Minimum 44x44px touch target for accessibility
        "w-10 h-10 min-w-[44px] min-h-[44px] rounded-full",
        "bg-[#25D366] hover:bg-[#20BD5A] text-white",
        "shadow-md hover:shadow-lg",
        "transition-all duration-200 hover:scale-110",
        "opacity-0 group-hover:opacity-100"
      )}
      aria-label={`Chat about ${propertyName} on WhatsApp`}
      title="Enquire on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  )
}
