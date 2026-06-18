"use client"

import { Home, CheckCircle, XCircle, IndianRupee, Ruler, ArrowRight, Layers, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface Unit {
  type: string
  size_range?: string
  price_range?: string
  available?: boolean
}

interface Configuration {
  type: string
  super_area_min?: number
  super_area_max?: number
  base_price_range?: string
  availability?: "available" | "sold_out" | "enquire"
}

interface UnitsSectionProps {
  units?: Unit[]
  configurations?: Configuration[]
}

export function UnitsSection({ units, configurations }: UnitsSectionProps) {
  // Use units if available, otherwise convert configurations to units format
  const displayUnits: Unit[] = units && units.length > 0 
    ? units 
    : configurations?.map(c => ({
        type: c.type,
        size_range: c.super_area_min && c.super_area_max 
          ? `${c.super_area_min} - ${c.super_area_max} sqft` 
          : c.super_area_min 
            ? `${c.super_area_min} sqft` 
            : undefined,
        price_range: c.base_price_range,
        available: c.availability !== "sold_out"
      })) || []

  if (displayUnits.length === 0) return null

  const availableCount = displayUnits.filter(u => u.available !== false).length

  return (
    <section className="py-10 md:py-14 relative overflow-hidden bg-gradient-to-b from-primary/[0.03] to-muted/30">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">Available Units</h2>
              <p className="text-muted-foreground text-xs">Choose your perfect configuration</p>
            </div>
          </div>
          {/* Stats badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {availableCount} {availableCount === 1 ? 'Unit' : 'Units'} Available
            </span>
          </div>
        </div>

        {/* Units Grid - Table-like layout */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Header Row - Desktop */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 px-5 py-3 bg-muted/50 border-b border-border">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Configuration</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Size Range</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price Range</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Status</div>
          </div>

          {/* Units Rows */}
          <div className="divide-y divide-border">
            {displayUnits.map((unit, index) => (
              <div
                key={index}
                className={cn(
                  "group relative grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 px-5 py-4",
                  "hover:bg-primary/[0.02] transition-colors duration-200",
                  !unit.available && "opacity-60"
                )}
              >
                {/* Configuration Type */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold",
                    unit.available !== false
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    <Home className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="md:hidden text-[10px] text-muted-foreground uppercase tracking-wider">Config</span>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {unit.type}
                    </h3>
                  </div>
                </div>

                {/* Size Range */}
                <div className="flex items-center gap-2 md:gap-3">
                  <Ruler className="h-3.5 w-3.5 text-muted-foreground md:hidden" />
                  <div>
                    <span className="md:hidden text-[10px] text-muted-foreground uppercase tracking-wider mr-2">Size:</span>
                    <span className="text-sm font-medium text-foreground">
                      {unit.size_range || "-"}
                    </span>
                  </div>
                </div>

                {/* Price Range */}
                <div className="flex items-center gap-2 md:gap-3">
                  <IndianRupee className="h-3.5 w-3.5 text-primary md:hidden" />
                  <div>
                    <span className="md:hidden text-[10px] text-muted-foreground uppercase tracking-wider mr-2">Price:</span>
                    <span className="text-sm font-bold text-primary">
                      {unit.price_range || "On Request"}
                    </span>
                  </div>
                </div>

                {/* Status & CTA */}
                <div className="flex items-center justify-between md:justify-end gap-3">
                  {unit.available !== undefined && (
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full",
                      unit.available 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {unit.available ? (
                        <><CheckCircle className="h-3 w-3" /> Available</>
                      ) : (
                        <><XCircle className="h-3 w-3" /> Sold Out</>
                      )}
                    </span>
                  )}
                  
                  {unit.available && (
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/btn">
                      <span>Details</span>
                      <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>

                {/* Hover indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center rounded-r" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick info footer */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3 w-3" />
            <span>Prices are indicative</span>
          </div>
          <span className="hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-3 w-3" />
            <span>GST & charges extra</span>
          </div>
        </div>
      </div>
    </section>
  )
}
