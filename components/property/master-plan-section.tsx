"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { Map, ZoomIn, ZoomOut, X, Maximize2, RotateCcw } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MasterPlanSectionProps {
  masterPlan?: string
  propertyName?: string
}

export function MasterPlanSection({ masterPlan, propertyName }: MasterPlanSectionProps) {
  const [showLightbox, setShowLightbox] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mounted, setMounted] = useState(false)

  // For portal - ensure we only render on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showLightbox) return
    if (e.key === "Escape") {
      setShowLightbox(false)
      setZoomLevel(1)
    } else if (e.key === "+" || e.key === "=") {
      setZoomLevel(prev => Math.min(prev + 0.25, 3))
    } else if (e.key === "-") {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
    } else if (e.key === "0") {
      setZoomLevel(1)
    }
  }, [showLightbox])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [showLightbox])

  const openLightbox = () => {
    setZoomLevel(1)
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    setZoomLevel(1)
  }

  const zoomInHandler = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
  }

  const zoomOutHandler = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(1)
  }

  if (!masterPlan) return null

  // Lightbox component rendered via portal
  const lightboxContent = showLightbox && mounted ? (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.97)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={closeLightbox}
    >
      {/* Top Controls Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image info */}
        <div>
          <p style={{ color: 'white', fontWeight: 600, fontSize: '16px', margin: 0 }}>
            Master Plan
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', margin: '4px 0 0 0' }}>
            {propertyName || "Project"} - Complete Layout
          </p>
        </div>

        {/* Center: Zoom Controls */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '6px',
          }}
        >
          <button
            onClick={zoomOutHandler}
            disabled={zoomLevel <= 0.5}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: zoomLevel <= 0.5 ? 'not-allowed' : 'pointer',
              opacity: zoomLevel <= 0.5 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Zoom out (-)"
          >
            <ZoomOut style={{ width: '22px', height: '22px' }} />
          </button>
          <span 
            style={{
              padding: '8px 16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              minWidth: '70px',
              textAlign: 'center',
            }}
          >
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={zoomInHandler}
            disabled={zoomLevel >= 3}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: zoomLevel >= 3 ? 'not-allowed' : 'pointer',
              opacity: zoomLevel >= 3 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Zoom in (+)"
          >
            <ZoomIn style={{ width: '22px', height: '22px' }} />
          </button>
          <button
            onClick={resetZoom}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Reset zoom (0)"
          >
            <RotateCcw style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Right: Close button */}
        <button
          onClick={closeLightbox}
          style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close lightbox"
        >
          <X style={{ width: '26px', height: '26px' }} />
        </button>
      </div>

      {/* Main Image Area */}
      <div 
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container with zoom */}
        <div 
          style={{ 
            position: 'relative',
            transition: 'transform 0.2s ease-out',
            transform: `scale(${zoomLevel})`,
            width: '75vw',
            height: '70vh',
            maxWidth: '1100px',
          }}
        >
          <Image
            src={masterPlan}
            alt={`Master Plan - ${propertyName || "Project"}`}
            fill
            style={{ objectFit: 'contain' }}
            sizes="85vw"
            priority
          />
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div 
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <a
          href={masterPlan}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Maximize2 style={{ width: '18px', height: '18px' }} />
          Open Full Size
        </a>
      </div>

      {/* Keyboard hint */}
      <div 
        style={{
          position: 'absolute',
          bottom: '85px',
          left: '20px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
        }}
      >
        +/-: zoom | 0: reset | ESC: close
      </div>
    </div>
  ) : null

  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 tracking-wide">
            <Map className="h-3 w-3" />
            MASTER PLAN
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Project Master Plan</h2>
          <p className="text-muted-foreground text-xs mt-1">
            Complete layout overview of {propertyName || "the project"}
          </p>
        </div>

        {/* Master Plan Image Container with max height */}
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg" style={{ maxHeight: "550px" }}>
          {/* Image Container */}
          <div 
            className="relative bg-muted/50 cursor-zoom-in group"
            style={{ height: "450px" }}
            onClick={openLightbox}
          >
            <Image
              src={masterPlan}
              alt={`Master Plan - ${propertyName || "Project"}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            
            {/* Action buttons - always visible on mobile */}
            <div className="absolute top-3 right-3 flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openLightbox()
                }}
                className="p-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-lg text-white transition-colors"
                title="View fullscreen"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>

            {/* Corner label */}
            <div className="absolute top-3 left-3 px-3 py-1.5 bg-blue-500/90 rounded-lg text-white text-xs font-semibold">
              Master Layout
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Project Master Plan</p>
              <p className="text-xs text-muted-foreground">
                Overall project layout and amenities placement
              </p>
            </div>
            <button
              onClick={openLightbox}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 text-xs font-medium transition-colors"
            >
              <ZoomIn className="h-3.5 w-3.5" />
              View Full Size
            </button>
          </div>
        </div>
      </div>

      {/* Render lightbox via portal to document.body */}
      {mounted && showLightbox && createPortal(lightboxContent, document.body)}
    </section>
  )
}
