"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Developer {
  _id: string
  name: string
  slug?: string
  logo_url?: string
  property_count: number
}

export default function FeaturedDevelopers() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch("/api/developers")
        const data = await response.json()

        const developersWithProperties = (Array.isArray(data) ? data : [])
          .filter((dev: Developer) => dev.property_count > 0)
          .sort((a: Developer, b: Developer) => b.property_count - a.property_count)

        setDevelopers(developersWithProperties)
      } catch (error) {
        console.error("Error fetching developers:", error)
        setDevelopers([])
      } finally {
        setLoading(false)
      }
    }

    fetchDevelopers()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-20 md:py-28 border-y border-slate-200 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded mx-auto mb-4" />
            <div className="h-12 w-64 bg-slate-200 rounded mx-auto mb-6" />
            <div className="h-4 w-96 bg-slate-200 rounded mx-auto mb-16" />
            <div className="flex gap-8 overflow-hidden justify-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[220px] h-[110px] bg-slate-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (developers.length === 0) return null

  // Split developers into rows for the marquee effect
  const rowSize = Math.ceil(developers.length / 3)
  const row1 = developers.slice(0, rowSize)
  const row2 = developers.slice(rowSize, rowSize * 2)
  const row3 = developers.slice(rowSize * 2)

  // Duplicate each row for seamless infinite scroll
  const duplicateRow = (row: Developer[]) => [...row, ...row]

  return (
    <section
      className={cn(
        "w-full py-20 md:py-28 border-y border-slate-200 overflow-hidden",
        "bg-[#fcfcfc]",
        // Architectural grid background
        "bg-[linear-gradient(#f1f5f9_1px,transparent_1px),linear-gradient(90deg,#f1f5f9_1px,transparent_1px)]",
        "bg-[size:32px_32px]"
      )}
    >
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        {/* Sharp Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white text-xs font-bold tracking-widest uppercase mb-8 shadow-md rounded-sm">
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
          Elite Partners
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-slate-900 uppercase">
          Our Trusted <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">
            Developer Partners
          </span>
        </h2>

        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium mt-6">
          Every developer we feature is RERA-approved and delivery-verified.
        </p>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative z-10 flex flex-col gap-8 py-8">
        {/* Edge Fades */}
        <div className="absolute left-0 top-0 w-[150px] h-full bg-gradient-to-r from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-[150px] h-full bg-gradient-to-l from-[#fcfcfc] to-transparent z-10 pointer-events-none" />

        {/* Row 1: Scrolls Right */}
        {row1.length > 0 && (
          <MarqueeRow developers={duplicateRow(row1)} direction="right" />
        )}

        {/* Row 2: Scrolls Left */}
        {row2.length > 0 && (
          <MarqueeRow developers={duplicateRow(row2)} direction="left" />
        )}

        {/* Row 3: Scrolls Right */}
        {row3.length > 0 && (
          <MarqueeRow developers={duplicateRow(row3)} direction="right" />
        )}
      </div>

      {/* View All Button */}
      <div className="relative z-10 text-center mt-12">
        <Link
          href="/developers"
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3",
            "bg-slate-900 text-white rounded-sm",
            "font-bold text-sm uppercase tracking-wider",
            "hover:bg-slate-800",
            "transition-all duration-200",
            "shadow-[4px_4px_0px_0px_#cbd5e1]",
            "hover:shadow-[6px_6px_0px_0px_#0ea5e9]",
            "hover:translate-x-[-2px] hover:translate-y-[-2px]"
          )}
        >
          View All Developers
        </Link>
      </div>
    </section>
  )
}

// Marquee Row Component
function MarqueeRow({
  developers,
  direction
}: {
  developers: Developer[]
  direction: "left" | "right"
}) {
  return (
    <div className="flex w-full overflow-hidden group/row">
      <div
        className={cn(
          "flex gap-8 pr-8 w-max",
          direction === "right" ? "animate-scroll-right" : "animate-scroll-left",
          "group-hover/row:[animation-play-state:paused]"
        )}
      >
        {developers.map((developer, index) => (
          <DeveloperCard key={`${developer._id}-${index}`} developer={developer} />
        ))}
      </div>
    </div>
  )
}

// Developer Card Component
function DeveloperCard({ developer }: { developer: Developer }) {
  return (
    <Link
      href={`/properties?developer_name=${encodeURIComponent(developer.name)}`}
      title={developer.name}
      className={cn(
        "flex-shrink-0 w-[220px] h-[110px]",
        "bg-white rounded-[4px]",
        "flex items-center justify-center",
        "border-2 border-slate-200",
        "shadow-[4px_4px_0px_0px_#cbd5e1]",
        "transition-all duration-200 ease-out",
        // Light blue hover effect
        "hover:translate-x-[-3px] hover:translate-y-[-3px]",
        "hover:shadow-[7px_7px_0px_0px_#0ea5e9]",
        "hover:border-sky-500",
        "hover:z-20",
        // Mobile adjustments
        "max-md:w-[160px] max-md:h-[85px] max-md:p-4",
        "max-md:shadow-[3px_3px_0px_0px_#cbd5e1]",
        "max-md:hover:translate-x-[-2px] max-md:hover:translate-y-[-2px]",
        "max-md:hover:shadow-[5px_5px_0px_0px_#0ea5e9]"
      )}
    >
      {developer.logo_url ? (
        <img
          src={developer.logo_url}
          alt={developer.name}
          width={180}
          height={80}
          loading="lazy"
          decoding="async"
          className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-200"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Building2 className="h-8 w-8 text-slate-400" />
          <span className="text-xs text-slate-600 font-medium text-center line-clamp-2">
            {developer.name}
          </span>
        </div>
      )}
    </Link>
  )
}
