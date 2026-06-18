'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FilterPillsProps {
  filters: string[]
  onFilterChange?: (activeFilters: string[]) => void
}

export default function LocationFilterPills({ filters, onFilterChange }: FilterPillsProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter]
    
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => toggleFilter(filter)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "border border-[var(--luxury-border)]",
            activeFilters.includes(filter)
              ? "bg-[var(--luxury-navy)] text-white border-[var(--luxury-navy)]"
              : "bg-white text-[var(--luxury-navy)] hover:bg-[var(--luxury-cream)] hover:border-[var(--luxury-navy)]"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
