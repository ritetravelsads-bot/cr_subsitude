'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight, ChevronDown, ChevronUp, SlidersHorizontal,
  X, Grid3X3, List, Rocket, TrendingUp, Shield, Building2,
  CheckCircle2, Phone, MessageCircle, ArrowRight, MapPin, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatPriceToIndian, getPropertyUrl, BUDGET_RANGES, parseBudgetRange } from '@/lib/utils'
import LuxuryPropertyCard from '@/components/property/luxury-property-card'
import { EnquiryPopup } from '@/components/property/enquiry-popup'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Property {
  _id: string
  slug?: string
  property_name: string
  main_thumbnail: string
  lowest_price: number
  bedrooms: number
  bathrooms: number
  area_sqft: number
  address: string
  city: string
  listing_type?: string
  project_status?: string
  rera_registered?: boolean
  property_type?: string
  carpet_area?: number
  super_area?: number
  max_price?: number
  price_range?: string
  is_featured?: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

// ─── Static content ───────────────────────────────────────────────────────────

const CORRIDORS = [
  {
    name: 'Golf Course Extension Road',
    sectors: 'Sectors 57, 58, 65, 66, 67, 69',
    price: '₹16,000 – ₹22,000/sqft',
    developers: 'M3M, Godrej, Emaar, Sobha',
    description: 'The highest volume of new luxury development in Gurgaon. Products here are often more architecturally ambitious than older GCR projects — larger amenity clusters, contemporary specifications.',
    link: '/properties?location=golf+course+extension+road&project_status=new_launch',
  },
  {
    name: 'Dwarka Expressway',
    sectors: 'Sectors 99–113',
    price: '₹8,000 – ₹14,000/sqft',
    developers: 'Signature Global, Central Park, Anant Raj, DLF, Sobha',
    description: 'One of the more dramatic turnarounds in Gurgaon\'s history. Fully operational since 2024. Near-to-medium term appreciation strongest of any corridor for investors.',
    link: '/properties?location=dwarka+expressway&project_status=new_launch',
  },
  {
    name: 'Southern Peripheral Road (SPR)',
    sectors: 'Sectors 68, 70, 71, 72, 74A',
    price: '₹12,000 – ₹16,000/sqft',
    developers: 'BPTP, Silverglades, boutique developers',
    description: 'Golf Course Extension Road-level lifestyle profile at a more accessible entry price. Premium, amenity-heavy gated communities in a well-planned corridor.',
    link: '/properties?location=southern+peripheral+road&project_status=new_launch',
  },
  {
    name: 'New Gurgaon',
    sectors: 'Sectors 76–95',
    price: '₹7,000 – ₹12,000/sqft',
    developers: 'Elan Group, Vatika, Hero Realty',
    description: 'Highest volume of new launches. Newer infrastructure, wider roads, better planning. Social infrastructure still maturing — ideal for 3 to 5-year horizon buyers.',
    link: '/properties?location=new+gurgaon&project_status=new_launch',
  },
  {
    name: 'Golf Course Road',
    sectors: 'Sectors 42, 53, 54, 56',
    price: '₹20,000+/sqft',
    developers: 'DLF (limited launches)',
    description: "Gurgaon's most established luxury corridor. New launches here are rare and command top-of-market pricing. DLF inventory when available attracts the most intense pre-launch interest.",
    link: '/properties?location=golf+course+road&project_status=new_launch',
  },
]

const WHY_REASONS = [
  {
    icon: <TrendingUp className="h-5 w-5 text-[var(--luxury-gold)]" />,
    title: 'Entry Pricing Below Completion Value',
    desc: 'Prices at launch are still below anticipated completion-stage values — particularly on Dwarka Expressway and SPR, where infrastructure delivery has been visibly accelerating.',
  },
  {
    icon: <Shield className="h-5 w-5 text-[var(--luxury-gold)]" />,
    title: 'RERA Has Changed the Risk Calculus',
    desc: 'Most reputable developers now launch only after RERA approval is secured. Buyers have a legal framework protecting their timelines and investment through HRERA registration.',
  },
  {
    icon: <Building2 className="h-5 w-5 text-[var(--luxury-gold)]" />,
    title: 'End-User Demand Is the Driver',
    desc: "The speculative investor is less active than before. What's driving absorption today is genuine occupier demand — families relocating, senior professionals upgrading, NRIs with capital and intent.",
  },
]

const PRICE_DATA = [
  { corridor: 'Golf Course Extension Road', range2023: '₹12,000–15,000', range2025: '₹16,000–22,000', change: '+40%' },
  { corridor: 'Dwarka Expressway', range2023: '₹8,000–10,000', range2025: '₹8,000–14,000', change: '+35%' },
  { corridor: 'New Gurgaon', range2023: '₹5,000–8,000', range2025: '₹7,000–12,000', change: '+30%' },
  { corridor: 'Golf Course Road', range2023: '₹15,000–20,000', range2025: '₹20,000+', change: '+25%' },
]

const FAQS = [
  {
    q: 'What is a new launch project in Gurgaon?',
    a: "A new launch is a residential project that has been officially launched for sale by the developer, typically after RERA registration is obtained. It marks the earliest stage of the sales cycle — often at the lowest available price point before construction-period appreciation begins. In Gurgaon's current market, reputable developers typically launch only after HRERA approval.",
  },
  {
    q: 'Which corridors have the most active new launches in 2025–26?',
    a: 'Golf Course Extension Road (sectors 57–69), Dwarka Expressway (sectors 99–113), Southern Peripheral Road (sectors 68–74A), and New Gurgaon (sectors 76–95) have the highest concentration of new launch activity. Golf Course Road sees rare but significant launches when they happen.',
  },
  {
    q: 'Are new launch prices lower than under-construction prices?',
    a: 'Yes, typically. New launch prices represent the earliest entry point, before construction-period appreciation is captured. Under-construction projects at 50–80% completion are typically 10–25% above launch price but below the ready-to-move premium. Buyers who enter at launch bear more delivery risk in exchange for better entry pricing.',
  },
  {
    q: 'What is RERA and why does it matter for new launch buyers?',
    a: 'RERA stands for Real Estate Regulation and Development Act. In Haryana, the regulatory body is HRERA. All new launch projects must be registered with HRERA before marketing or selling units to buyers. RERA registration legally binds the developer to deliver by the declared date, maintain quality standards, and hold funds in a ring-fenced escrow account for that specific project.',
  },
  {
    q: 'How long does it take to get possession of a new launch project?',
    a: 'Most new launches in Gurgaon quote possession timelines of 3 to 5 years from the date of booking or RERA registration, depending on project scale. In practice, delays of 12 to 18 months beyond the declared date are common. Buyers should plan finances assuming a possible 12-month delay and look for projects with a strong construction track record.',
  },
  {
    q: 'What documents should I check before buying a new launch?',
    a: 'The critical documents include the RERA registration certificate, the land title and ownership chain, the approved building plan from DTCP or MCG, the builder-buyer agreement (BBA), the brochure with floor plans and specification sheet, and the developer\'s GST registration. Your legal advisor should verify these independently before you make any payment.',
  },
  {
    q: 'Can NRIs buy new launch projects in Gurgaon?',
    a: 'Yes. NRIs can purchase residential property in India, including new launch projects in Gurgaon, under FEMA regulations. Payments must be made through NRE, NRO, or FCNR accounts. Most major developers have dedicated NRI service desks, and CountryRoof works with NRI buyers regularly to facilitate site visits, virtual walkthroughs, documentation, and transaction support.',
  },
  {
    q: 'Is the luxury new launch segment in Gurgaon overpriced?',
    a: "Compared to equivalent properties in Mumbai's premium submarkets or London and Dubai, Gurgaon luxury is still meaningfully more accessible. Whether specific projects represent fair value depends on location, construction quality, developer brand, and amenity provision. Blanket overpricing characterisations are difficult to sustain given the consistently strong absorption data.",
  },
]

const SEGMENT_OPTIONS = [
  { value: 'luxury', label: 'Luxury' },
  { value: 'premium', label: 'Premium' },
  { value: 'mid', label: 'Mid Range' },
]

// ─── Component ────────────────────────────────────────────────────────────────

function NewLaunchProjectsGurgaonInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1')
  const viewParam = (searchParams.get('view') || 'grid') as 'grid' | 'list'

  const [properties, setProperties] = useState<Property[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(viewParam)
  const [showFilters, setShowFilters] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const [filters, setFilters] = useState({
    segment: searchParams.get('segment') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    rera_registered: searchParams.get('rera_registered') || '',
  })

  const [popupOpen, setPopupOpen] = useState(false)
  const [popupCorridor, setPopupCorridor] = useState<string | undefined>(undefined)

  const openEnquiryPopup = useCallback((corridorName?: string) => {
    setPopupCorridor(corridorName)
    setPopupOpen(true)
  }, [])

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('city', 'Gurgaon')
      params.set('project_status', 'new_launch')
      params.set('limit', '12')
      params.set('page', String(currentPage))
      if (filters.segment) params.set('segment', filters.segment)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
      if (filters.rera_registered) params.set('rera_registered', filters.rera_registered)

      const res = await fetch(`/api/properties?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setProperties(data.properties || [])
        setPagination(data.pagination || null)
      }
    } catch (e) {
      console.error('[v0] fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const updateFilter = (key: string, value: string) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    const params = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
    params.set('page', '1')
    params.set('view', viewMode)
    router.push(`/gurgaon/new-launch-projects?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setFilters({ segment: '', minPrice: '', maxPrice: '', bedrooms: '', rera_registered: '' })
    router.push('/gurgaon/new-launch-projects')
  }

  const handlePage = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    params.set('page', String(page))
    params.set('view', viewMode)
    router.push(`/gurgaon/new-launch-projects?${params.toString()}`)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <>
      <Header />

      <EnquiryPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        pageContext="New Launch Projects in Gurgaon"
        corridorName={popupCorridor}
      />

      <main className="min-h-screen bg-white">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative bg-[var(--luxury-navy)] overflow-hidden min-h-[520px] flex items-end">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80"
              alt="New launch projects in Gurgaon"
              fill
              className="object-cover opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--luxury-navy)] via-[var(--luxury-navy)]/80 to-transparent" />
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--luxury-gold)] to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <nav className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/properties" className="hover:text-white transition-colors">Properties</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[var(--luxury-gold)]">New Launch Projects in Gurgaon</span>
            </nav>

            <div className="flex items-center gap-2 mb-4">
              <Rocket className="h-5 w-5 text-[var(--luxury-gold)]" />
              <span className="text-white/70 text-sm uppercase tracking-widest font-light">New Launches 2025–26</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              New Launch Projects in Gurgaon —<br className="hidden md:block" />
              <span className="text-[var(--luxury-gold)]">What&apos;s Worth Your Attention</span>
              <br className="hidden md:block" /> in 2025–26
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
              We&apos;ve tracked what&apos;s been launched, where, by whom, and what it means for a buyer making a decision today. Not a listing dump — a structured overview written from a buyer-first perspective.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--luxury-gold)] text-[var(--luxury-navy)] font-semibold rounded-lg hover:bg-[var(--luxury-gold)]/90 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                Explore New Launch Projects
              </button>
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Get Expert Advice
              </button>
            </div>
          </div>
        </section>

        {/* ── WHY NOW ──────────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mb-4 text-balance">
              Why New Launch Projects in Gurgaon Are Attracting Serious Buyers Right Now
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl">
              The current wave of new launches is different in character from what was seen five or six years ago. Post-pandemic demand shifts, a maturing infrastructure pipeline, and developer credibility consolidation have combined to create a market where new launches from the right developers, in the right locations, are actually worth taking seriously.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WHY_REASONS.map((reason) => (
                <div key={reason.title} className="p-6 rounded-xl border border-[var(--luxury-border)] bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    {reason.icon}
                    <h3 className="font-bold text-[var(--luxury-navy)]">{reason.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{reason.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARKET LANDSCAPE ─────────────────────────────────────────────── */}
        <section className="py-12 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--luxury-navy)] mb-6">
              Understanding the Gurgaon Real Estate Landscape in 2025
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-[var(--luxury-border)]">
                <h3 className="text-lg font-bold text-[var(--luxury-navy)] mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--luxury-gold)]" />
                  The Luxury Story
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Demand for properties priced above ₹3 crore has remained consistently strong. In some micro-markets, new launches sell out their first phases within weeks. DLF, M3M, Sobha, Godrej Properties, and Signature Global have all released premium inventory that found buyers quickly.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[var(--luxury-border)]">
                <h3 className="text-lg font-bold text-[var(--luxury-navy)] mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--luxury-gold)]" />
                  Entry Point Has Shifted
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The mid-premium segment (₹80 lakh – ₹1.5 crore) is increasingly hard to find in well-located sectors. Developers have consciously moved upmarket — land acquisition and construction input costs make mid-range pricing difficult to sustain without compromising quality.
                </p>
              </div>
            </div>

            {/* Price Trend Table */}
            <h3 className="text-xl font-bold text-[var(--luxury-navy)] mb-4">Property Price Trends 2023 vs 2025</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-xl overflow-hidden border border-[var(--luxury-border)]">
                <thead>
                  <tr className="bg-[var(--luxury-navy)] text-white">
                    <th className="text-left p-4 font-semibold">Corridor</th>
                    <th className="text-left p-4 font-semibold">2023 (₹/sqft)</th>
                    <th className="text-left p-4 font-semibold">2025 (₹/sqft)</th>
                    <th className="text-left p-4 font-semibold">Appreciation</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICE_DATA.map((row, i) => (
                    <tr key={row.corridor} className={cn('border-t border-[var(--luxury-border)]', i % 2 === 0 ? 'bg-white' : 'bg-[var(--luxury-cream)]/40')}>
                      <td className="p-4 font-medium text-[var(--luxury-navy)]">{row.corridor}</td>
                      <td className="p-4 text-gray-600">{row.range2023}</td>
                      <td className="p-4 font-semibold text-[var(--luxury-navy)]">{row.range2025}</td>
                      <td className="p-4">
                        <span className="font-bold text-green-600">{row.change}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">These are broad benchmarks, not precise quotes. Individual project pricing varies based on developer brand, floor level, facing, and amenity provision.</p>
          </div>
        </section>

        {/* ── CORRIDORS ────────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-2">
              Top Corridors for New Launch Projects in Gurgaon
            </h2>
            <p className="text-gray-600 mb-8">Evaluate each corridor by investment horizon, price point, and developer activity.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CORRIDORS.map((corridor) => (
                <div key={corridor.name} className="rounded-xl border border-[var(--luxury-border)] p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[var(--luxury-navy)]">{corridor.name}</h3>
                    <span className="text-xs font-semibold text-[var(--luxury-gold)] bg-[var(--luxury-gold)]/10 px-3 py-1 rounded-full">
                      {corridor.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Sectors: {corridor.sectors}</p>
                  <p className="text-xs text-gray-500 mb-3">Key Developers: {corridor.developers}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{corridor.description}</p>
                  <button
                    type="button"
                    onClick={() => openEnquiryPopup(corridor.name)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--luxury-navy)] border border-[var(--luxury-navy)] px-4 py-2 rounded-lg hover:bg-[var(--luxury-navy)] hover:text-white transition-colors"
                  >
                    View Projects <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONNECTIVITY ─────────────────────────────────────────────────── */}
        <section className="py-12 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--luxury-navy)] mb-6">Connectivity & Infrastructure Driving Demand</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: 'Road Connectivity',
                  points: [
                    'Delhi-Mumbai Expressway interchange near Sector 58',
                    'Dwarka Expressway fully operational since March 2024',
                    'NH-48 widening ongoing — 30–40 mins to IGI Airport',
                    'KMP Expressway opened New Gurgaon to regional connectivity',
                  ],
                },
                {
                  title: 'Metro Connectivity',
                  points: [
                    'Rapid Metro through Sector 29, 42, MG Road, Cyber City',
                    'Integrated with Delhi Metro Yellow Line at HUDA City Centre',
                    'Proposed expansion into New Gurgaon sectors',
                    'Planned extension along Dwarka Expressway corridor',
                  ],
                },
                {
                  title: 'Airport Access',
                  points: [
                    'IGI Airport 30–40 mins under normal conditions',
                    'Dwarka Expressway corridor: under 15 minutes',
                    'Strategic advantage for NRIs and frequent flyers',
                    'Jewar Airport adds second major airport to NCR',
                  ],
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 border border-[var(--luxury-border)]">
                  <h3 className="font-bold text-[var(--luxury-navy)] mb-3">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-[var(--luxury-gold)] flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOCIAL INFRA ─────────────────────────────────────────────────── */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--luxury-navy)] mb-6">Social Infrastructure Near New Launch Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: 'Educational Institutions',
                  content: "The Shri Ram School, DPS Gurgaon, Pathways World School, GD Goenka World School, and Scottish High International School. Golf Course Extension Road and SPR corridors are particularly well-served by premium schools.",
                },
                {
                  title: 'Healthcare Facilities',
                  content: 'Medanta – The Medicity (Sector 38), Artemis Hospital (Sector 51), Fortis Memorial Research Institute (Sector 44), and Columbia Asia Hospital. World-class by any national standard.',
                },
                {
                  title: 'Retail & Entertainment',
                  content: 'Ambience Mall, DLF Mega Mall, MGF Metropolitan, the Cyber Hub dining district, and an extensive network of high street retail across sectors. Residents of most established corridors are never far from quality retail and F&B.',
                },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-[var(--luxury-border)]">
                  <h3 className="font-bold text-[var(--luxury-navy)] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS LISTING ─────────────────────────────────────────────── */}
        <section id="projects" className="py-16 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-2">New Launch Projects in Gurgaon</h2>
                <p className="text-gray-600">RERA-registered launches from established developers — verified listings, real prices</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn('gap-2', showFilters && 'bg-primary/5 border-primary/30')}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-primary text-primary-foreground rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--luxury-navy)] text-white rounded-lg text-sm font-medium hover:bg-[var(--luxury-navy)]/90 transition-colors">
                  <Phone className="h-4 w-4" />
                  Check Prices & Availability
                </Link>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl border border-[var(--luxury-border)] p-5 mb-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Segment</label>
                    <select
                      value={filters.segment}
                      onChange={(e) => updateFilter('segment', e.target.value)}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none"
                    >
                      <option value="">All Segments</option>
                      {SEGMENT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Budget</label>
                    <select
                      value={filters.minPrice && filters.maxPrice ? `${filters.minPrice}-${filters.maxPrice}` : ''}
                      onChange={(e) => {
                        const { min, max } = parseBudgetRange(e.target.value)
                        updateFilter('minPrice', min ? String(min) : '')
                        updateFilter('maxPrice', max ? String(max) : '')
                      }}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none"
                    >
                      <option value="">Any Budget</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => updateFilter('bedrooms', e.target.value)}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none"
                    >
                      <option value="">Any BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                      <option value="5+">5 BHK+</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pb-1">
                    <input
                      type="checkbox"
                      checked={filters.rera_registered === 'true'}
                      onChange={(e) => updateFilter('rera_registered', e.target.checked ? 'true' : '')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-muted-foreground">RERA Verified Only</span>
                  </label>
                  {activeFilterCount > 0 && (
                    <Button variant="outline" onClick={clearAllFilters} className="gap-2">
                      <X className="h-4 w-4" /> Clear All
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Results bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-[var(--luxury-navy)]">
                {loading ? 'Loading...' : `${pagination?.total || 0} New Launch Properties`}
              </p>
              <div className="flex items-center gap-1 bg-white border border-[var(--luxury-border)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-1.5 rounded transition-colors', viewMode === 'grid' ? 'bg-[var(--luxury-navy)] text-white' : 'text-gray-600 hover:bg-gray-100')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('p-1.5 rounded transition-colors', viewMode === 'list' ? 'bg-[var(--luxury-navy)] text-white' : 'text-gray-600 hover:bg-gray-100')}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4')}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4')}>
                {properties.map((property) => (
                  <LuxuryPropertyCard key={property._id} {...property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-[var(--luxury-navy)] mb-2">No new launch properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or browse all properties</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={clearAllFilters} variant="outline">Clear Filters</Button>
                  <Link href="/properties?city=Gurgaon" className="inline-flex items-center px-4 py-2 bg-[var(--luxury-navy)] text-white rounded-lg text-sm font-medium">
                    Browse All Gurgaon Properties
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button variant="outline" disabled={currentPage === 1} onClick={() => handlePage(currentPage - 1)}>
                  Previous
                </Button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    className={cn(page === currentPage && 'bg-[var(--luxury-navy)]')}
                    onClick={() => handlePage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" disabled={currentPage === pagination.pages} onClick={() => handlePage(currentPage + 1)}>
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* ── DEMAND ANALYSIS CTA ───────────────────────────────────────────── */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-8 rounded-2xl bg-[var(--luxury-navy)] text-white">
              <div>
                <h3 className="text-2xl font-bold mb-2">Check Latest Prices & Availability</h3>
                <p className="text-white/80">Connect with a CountryRoof advisor for real-time pricing, floor plan availability, and payment plan details.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0 flex-wrap">
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--luxury-gold)] text-[var(--luxury-navy)] font-bold rounded-lg hover:bg-[var(--luxury-gold)]/90 transition-colors">
                  <Phone className="h-4 w-4" />
                  Get Price List
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 font-semibold rounded-lg hover:bg-white/20 transition-colors">
                  Download Price Sheet
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-16 bg-[var(--luxury-cream)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-8">
              Frequently Asked Questions — New Launch Projects in Gurgaon
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-[var(--luxury-border)] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left gap-4"
                  >
                    <span className="font-semibold text-[var(--luxury-navy)] text-sm md:text-base">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="h-5 w-5 text-[var(--luxury-gold)] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[var(--luxury-gold)] flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED PAGES ────────────────────────────────────────────────── */}
        <section className="py-12 bg-white border-t border-[var(--luxury-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[var(--luxury-navy)] mb-5">Related Pages to Explore</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Luxury Apartments in Gurgaon', href: '/gurgaon/luxury-apartments' },
                { label: '3 BHK Apartments in Gurgaon', href: '/gurgaon/3-bhk-apartments' },
                { label: 'Golf Course Extension Road Properties', href: '/properties?location=golf+course+extension+road' },
                { label: 'Dwarka Expressway Projects', href: '/properties?location=dwarka+expressway' },
                { label: 'New Gurgaon Real Estate', href: '/properties?location=new+gurgaon' },
                { label: 'Under Construction Projects Gurgaon', href: '/properties?project_status=under_construction&city=Gurgaon' },
                { label: 'Ready to Move Apartments Gurgaon', href: '/properties?project_status=ready_to_move&city=Gurgaon' },
                { label: 'RERA Approved Projects Gurgaon', href: '/properties?rera_registered=true&city=Gurgaon' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm border border-[var(--luxury-border)] rounded-full text-gray-700 hover:border-[var(--luxury-navy)] hover:text-[var(--luxury-navy)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="py-14 bg-[var(--luxury-navy)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Make a Smarter Property Decision with CountryRoof</h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              CountryRoof is a Gurgaon-focused luxury real estate advisory. We work exclusively in the premium and luxury segment — our advisors have deep, current, first-hand knowledge of the projects, corridors, and developers that matter. Whether you&apos;re an investor evaluating corridors, an end-user looking for the right home, or an NRI exploring options remotely, we can help you navigate the new launch market with clarity.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--luxury-gold)] text-[var(--luxury-navy)] font-bold rounded-lg hover:bg-[var(--luxury-gold)]/90 transition-colors"
              >
                Explore New Launch Projects
              </button>
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Connect with an Advisor
              </button>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}

export default function NewLaunchProjectsGurgaon() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <NewLaunchProjectsGurgaonInner />
    </Suspense>
  )
}
