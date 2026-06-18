"use client"

import { useState, useEffect, useCallback, memo, startTransition } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    image: "/home-banner-7.webp",
    mobileImage: "/banners/home-mob-banner-7.webp",
    title: "",
    subtitle: "",
    tag: "",
  },
  {
    id: 2,
    image: "/home-banner-2.webp",
    mobileImage: "/banners/home-mob-banner-2.webp",
    title: "",
    subtitle: "",
    tag: "",
  },
  {
    id: 3,
    image: "/home-banner-3.webp",
    mobileImage: "/banners/home-mob-banner-3.webp",
    title: "",
    subtitle: "",
    tag: "",
  },
  {
    id: 4,
    image: "/home-banner-4.webp",
    mobileImage: "/banners/home-mob-banner-4.webp",
    title: "",
    subtitle: "",
    tag: "",
  },
]

// Static first slide rendered immediately without JS - critical for LCP
// Using native <picture> element with /_next/image URLs for:
// 1. WebP conversion (saves ~29KB)
// 2. Zero React hydration delay (eliminates 770ms render delay)
// 3. Instant image display without waiting for JS
function FirstSlideStatic() {
  return (
    <div className="absolute inset-0 z-10">
      <div className="absolute inset-0">
        {/* Native picture element using Next.js image optimization URLs */}
        {/* This bypasses React hydration while still getting WebP conversion */}
        <picture>
          {/* Desktop WebP - for screens 768px and wider */}
          <source
            media="(min-width: 768px)"
            type="image/webp"
            srcSet="/_next/image?url=%2Fhome-banner-7.webp&w=1080&q=80 1080w, /_next/image?url=%2Fhome-banner-7.webp&w=1200&q=80 1200w, /_next/image?url=%2Fhome-banner-7.webp&w=1920&q=80 1920w"
            sizes="100vw"
          />
          {/* Mobile WebP - for screens below 768px (LCP element) */}
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet="/_next/image?url=%2Fbanners%2Fhome-mob-banner-7.webp&w=480&q=75 480w, /_next/image?url=%2Fbanners%2Fhome-mob-banner-7.webp&w=640&q=75 640w, /_next/image?url=%2Fbanners%2Fhome-mob-banner-7.webp&w=750&q=75 750w"
            sizes="100vw"
          />
          {/* Fallback img - uses mobile image as default */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/_next/image?url=%2Fbanners%2Fhome-mob-banner-7.webp&w=640&q=75"
            alt="Country Roof Real Estate - Premium Properties in Gurgaon"
            fetchPriority="high"
            decoding="sync"
            loading="eager"
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              inset: 0,
              objectFit: 'cover',
            }}
            className="md:!object-contain"
          />
        </picture>
      </div>
      {/* SEO H1 - Visually hidden but accessible to search engines */}
      <h1 className="sr-only">CountryRoof — Premium Luxury Properties in Gurgaon</h1>
    </div>
  )
}

// Memoized slide component for subsequent slides
const SlideImage = memo(function SlideImage({ 
  slide, 
  index, 
  isActive 
}: { 
  slide: typeof slides[0]
  index: number
  isActive: boolean 
}) {
  // Skip first slide as it's rendered statically
  if (index === 0) return null
  
  // Only render active slide and next slide for smooth transitions
  const shouldRender = isActive || index === 1

  if (!shouldRender) return null

  return (
    <>
      {/* Desktop Image */}
      <Image 
        src={slide.image || "/placeholder.svg"} 
        alt={slide.title || "Banner"} 
        fill
        loading="lazy"
        sizes="(max-width: 767px) 1px, 100vw"
        quality={75}
        fetchPriority="low"
        decoding="async"
        className={cn(
          "object-contain hidden md:block",
          !isActive && "opacity-0"
        )}
      />
      {/* Mobile Image */}
      <Image 
        src={slide.mobileImage || slide.image || "/placeholder.svg"} 
        alt={slide.title || "Banner"} 
        fill
        loading="lazy"
        sizes="(min-width: 768px) 1px, 100vw"
        quality={70}
        fetchPriority="low"
        decoding="async"
        className={cn(
          "object-cover md:hidden",
          !isActive && "opacity-0"
        )}
      />
    </>
  )
})

function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  const nextSlide = useCallback(() => {
    startTransition(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    })
  }, [])

  // Defer hydration using requestIdleCallback to not block LCP
  useEffect(() => {
    const markHydrated = () => {
      startTransition(() => {
        setIsHydrated(true)
      })
    }
    
    // Use requestIdleCallback to defer hydration until browser is idle
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(markHydrated, { timeout: 2000 })
      return () => window.cancelIdleCallback(id)
    } else {
      // Fallback: use setTimeout with longer delay
      const timeout = setTimeout(markHydrated, 100)
      return () => clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isHydrated, nextSlide])

  return (
    <div 
      className="relative w-full overflow-hidden bg-gray-100 aspect-[3/4] md:aspect-[10/3]"
    >
      {/* Static first slide - always visible initially for instant LCP */}
      <FirstSlideStatic />
      
      {/* Dynamic slides - only rendered after hydration */}
      {isHydrated && slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            index === currentSlide 
              ? "opacity-100 z-10" 
              : "opacity-0 z-0"
          )}
        >
          <div className="absolute inset-0">
            <SlideImage 
              slide={slide} 
              index={index} 
              isActive={index === currentSlide} 
            />
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-10">
              <div className="max-w-2xl space-y-6">
                {/* Subtitle */}
                <p 
                  className={cn(
                    "text-lg md:text-xl lg:text-2xl text-white/90 max-w-xl",
                    "transition-all duration-700 delay-300",
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  )}
                >
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(BannerSlider)
