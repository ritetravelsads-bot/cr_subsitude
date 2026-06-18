"use client"

import { Check, Sparkles, Star, Trophy, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectHighlightsProps {
  highlights: string[]
}

export function ProjectHighlights({ highlights }: ProjectHighlightsProps) {
  if (!highlights || highlights.length === 0) return null

  // Icons for variety
  const getHighlightIcon = (index: number) => {
    const icons = [Trophy, Zap, Star, Check]
    return icons[index % icons.length]
  }

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.03]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Section Header with Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold mb-3 tracking-wide">
            <Sparkles className="h-3 w-3" />
            KEY FEATURES
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Project Highlights</h2>
          <p className="text-muted-foreground text-xs mt-1">What makes this property exceptional</p>
        </div>

        {/* Highlights Grid - Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {highlights.map((highlight, index) => {
            const Icon = getHighlightIcon(index)
            const isFeature = index < 99

            return (
              <div
                key={index}
                className={cn(
                  "group relative overflow-hidden rounded-xl transition-all duration-300",
                  isFeature
                    ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 hover:border-primary/40"
                    : "bg-card border border-border hover:border-primary/30 hover:shadow-md",
                  "hover:-translate-y-0.5"
                )}
              >
                {/* Content */}
                <div className="relative flex items-start gap-3 p-4">
                  {/* Number badge */}
                  <div className={cn(
                    "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                    isFeature
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    {index + 1}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed font-medium">
                      {highlight}
                    </p>
                  </div>

                  {/* Feature icon for top highlights */}
                  {isFeature && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )
          })}
        </div>

        {/* Bottom accent line */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
          <Star className="h-3 w-3 text-primary/40" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
        </div>
      </div>
    </section>
  )
}
