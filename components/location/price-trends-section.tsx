'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { PriceTrend, SummaryStatBox } from '@/data/location-content'
import { cn } from '@/lib/utils'

interface PriceTrendsSectionProps {
  trends: PriceTrend[]
  summaryStats: SummaryStatBox[]
  locationName: string
}

export default function PriceTrendsSection({ trends, summaryStats, locationName }: PriceTrendsSectionProps) {
  return (
    <section id="price-trends" className="py-16 bg-[var(--luxury-cream)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--luxury-gold)] text-sm uppercase tracking-widest font-medium">
            Market Analysis
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mt-2 mb-4">
            Price Trends & Investment Data
          </h2>
          <p className="text-[var(--luxury-dark)]/70 max-w-2xl mx-auto">
            Real-time market insights for {locationName} properties
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {summaryStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-[var(--luxury-dark)]/60 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-[var(--luxury-navy)]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Price Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {trends.length === 0 ? (
            <div className="px-6 py-10 text-center text-[var(--luxury-dark)]/50 text-sm">
              Detailed project-level price data coming soon. Contact us for a personalised investment report.
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--luxury-navy)] text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Project</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Segment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price / Sqft</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Base Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Current Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Appreciation</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rental Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--luxury-border)]">
                {trends.map((trend, index) => (
                  <tr 
                    key={trend.project} 
                    className={cn(
                      "hover:bg-[var(--luxury-cream)] transition-colors",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    )}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-[var(--luxury-navy)]">
                        {trend.project}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        trend.segment.includes('Ultra') || trend.segment.includes('Branded') ? "bg-purple-100 text-purple-700" :
                        trend.segment.includes('Luxury') ? "bg-blue-100 text-blue-700" :
                        trend.segment.includes('New') || trend.segment.includes('Launch') ? "bg-green-100 text-green-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {trend.segment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--luxury-dark)]">
                      {trend.pricePSF}
                    </td>
                    <td className="px-6 py-4 text-[var(--luxury-dark)]">
                      {trend.price2022}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[var(--luxury-navy)]">
                      {trend.price2024}
                    </td>
                    <td className="px-6 py-4">
                      <AppreciationBadge appreciation={trend.appreciation} />
                    </td>
                    <td className="px-6 py-4 text-[var(--luxury-dark)]">
                      {trend.rentalYield}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {/* Market Note */}
        <p className="text-center text-sm text-[var(--luxury-dark)]/60 mt-6">
          * Data based on recent transactions and market analysis. Actual prices may vary.
        </p>
      </div>
    </section>
  )
}

function AppreciationBadge({ appreciation }: { appreciation: string }) {
  const isPositive = appreciation.includes('↑') || appreciation.includes('+')
  const isNegative = appreciation.includes('↓') || appreciation.includes('-')

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
        isPositive && "bg-green-100 text-green-700",
        isNegative && "bg-red-100 text-red-700",
        !isPositive && !isNegative && "bg-blue-100 text-blue-700"
      )}
    >
      {isPositive && <TrendingUp className="h-3 w-3" />}
      {isNegative && <TrendingDown className="h-3 w-3" />}
      {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
      {appreciation}
    </span>
  )
}
