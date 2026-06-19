'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, ChevronRight, ChevronDown, ChevronUp, SlidersHorizontal,
  X, Grid3X3, List, Star, TrendingUp, Shield, Building2, CheckCircle2,
  Phone, MessageCircle, ArrowRight, Home, Zap
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
    name: 'Golf Course Road',
    slug: 'golf-course-road',
    price: '₹15,000 – ₹25,000/sqft',
    highlight: "Gurgaon's apex luxury address",
    description: 'DLF Magnolias, The Crest, Aralias, and Camellias set the benchmark. Closest commute to DLF Cyber City, deepest secondary market liquidity.',
    rightFor: 'Cyber City professionals, premium address seekers, high-liquidity investors.',
  },
  {
    name: 'Golf Course Extension Road',
    slug: 'golf-course-extension-road',
    price: '₹12,000 – ₹18,000/sqft',
    highlight: "Gurgaon's most active luxury corridor",
    description: 'M3M, Godrej, Sobha, Elan and Anant Raj define modern luxury here. Newer construction, larger amenity clusters, strong senior executive rental demand.',
    rightFor: 'Modern construction seekers, investors targeting rental market, Golf Course Road adjacency at lower entry.',
  },
  {
    name: 'Dwarka Expressway',
    slug: 'dwarka-expressway',
    price: '₹9,000 – ₹14,000/sqft',
    highlight: "Strongest investment corridor in 2026",
    description: 'Fully operational since 2024. IGI Airport under 15 minutes. 35–50% appreciation already delivered. Gap to GCER has not yet closed.',
    rightFor: '4–7 year investors, airport-proximity buyers, maximum specifications per rupee.',
  },
  {
    name: 'Sohna Road',
    slug: 'sohna-road',
    price: '₹7,000 – ₹12,000/sqft',
    highlight: 'Premium living at comparative value',
    description: 'Vatika, Tata Housing, Bestech, and Emaar delivered some of Gurgaon\'s most thoughtfully designed communities here. Mature schools and hospitals nearby.',
    rightFor: 'Premium quality seekers, families prioritising social infrastructure, value buyers.',
  },
  {
    name: 'New Gurgaon',
    slug: 'new-gurgaon',
    price: '₹6,000 – ₹10,000/sqft',
    highlight: 'The long-term frontier',
    description: 'Sectors 76–95, anchored by KMP Expressway. Adani, M3M, Central Park executing township-scale projects. Global City project as future anchor.',
    rightFor: '7–10 year investors with patience and risk appetite, long-horizon appreciation buyers.',
  },
]

const MARKET_STATS = [
  { label: 'Price Range', value: '₹3 Cr – ₹40 Cr+' },
  { label: 'Configurations', value: '3 BHK, 4 BHK, Penthouses, Sky Villas' },
  { label: 'Rental Yield', value: '2.5% – 4% p.a.' },
  { label: 'Top Developers', value: 'DLF, Sobha, Godrej, M3M, Emaar' },
]

const PRICE_TIERS = [
  {
    label: 'Premium',
    range: '₹3 Cr – ₹6 Cr',
    description: 'Large 3 BHK homes from credible developers in well-located sectors. The entry point to genuinely quality residential living in Gurgaon.',
  },
  {
    label: 'Luxury',
    range: '₹6 Cr – ₹12 Cr',
    description: 'Low-density projects with full amenity infrastructure along Golf Course Road, GCER, or Sohna Road. Most active segment in 2025–2026.',
    featured: true,
  },
  {
    label: 'Ultra Luxury',
    range: '₹12 Cr+',
    description: 'Address-defining sky villas, duplex penthouses, and limited-inventory towers from DLF, Sobha, Emaar and M3M. Buyers purchase exclusivity.',
  },
]

const DEVELOPERS = [
  { name: 'DLF Limited', strength: 'Benchmark delivery + in-house facility management. Every Golf Course Road project they built still performs as premium.' },
  { name: 'Sobha Developer', strength: 'Backward-integrated: controls concrete, steel, finishing in-house. Measurably more consistent build quality.' },
  { name: 'Godrej Properties', strength: '125+ years of group reputation. Best-in-class RERA compliance and escrow discipline.' },
  { name: 'M3M India', strength: "Gurgaon's most prolific active luxury developer. Large amenity clusters, integrated retail, consistent absorption." },
  { name: 'Emaar India', strength: "Dubai heritage brings international standards. Particularly valued by Gulf NRI buyers." },
  { name: 'Tata Housing', strength: "Tata Group's institutional credibility at the premium tier. Strong choice when developer trustworthiness is the primary criterion." },
]

const FAQS = [
  {
    q: 'What is the price range for luxury apartments in Gurgaon in 2026?',
    a: 'Luxury apartments in Gurgaon span ₹3 crore to well above ₹40 crore. Premium apartments start from ₹3 crore for 3 BHK. Mid-luxury 3 and 4 BHK homes range from ₹6 crore to ₹12 crore. Ultra luxury configurations start at ₹12 crore and reach ₹40 crore and above.',
  },
  {
    q: 'Which location is best for luxury apartments in Gurgaon?',
    a: 'Golf Course Road offers the most established address and deepest liquidity at the highest price points. Golf Course Extension Road offers modern construction and strong rental demand at lower per-sqft costs. Dwarka Expressway is the best investment entry in 2026. Sohna Road for premium value in a mature neighbourhood. New Gurgaon for the longest-horizon appreciation story.',
  },
  {
    q: 'Which developers build the best luxury apartments in Gurgaon?',
    a: 'DLF leads by delivery track record and post-delivery facility management. Sobha is the most technically rigorous for construction quality. Godrej Properties offers the strongest institutional governance. M3M has the broadest active luxury portfolio. For any purchase above ₹3 crore, restrict evaluation to developers with verifiable, completed project references in Gurgaon specifically.',
  },
  {
    q: 'Are luxury apartments in Gurgaon RERA registered?',
    a: 'All legitimate luxury projects from established developers are registered with HRERA — Haryana Real Estate Regulatory Authority. RERA registration requires developers to maintain a dedicated project escrow account, disclose approved plans and timelines, and obtain buyer consent before material changes. Verify any project on the HRERA portal before making any payment.',
  },
  {
    q: 'What is the rental income potential for luxury apartments in Gurgaon?',
    a: 'Premium 3 BHK units generate ₹75,000 – ₹1.5 lakh monthly. Mid-luxury 3 and 4 BHK homes on Golf Course Road and GCER generate ₹1.5 lakh – ₹3 lakh. Ultra luxury configurations generate ₹3 lakh – ₹7 lakh and above. Rental yields on current market values range from 2.5 to 4 percent.',
  },
  {
    q: 'What stamp duty is payable on luxury apartments in Gurgaon?',
    a: 'Stamp duty in Haryana is 7% for male buyers and 5% for female buyers. Registration charges add approximately 0.5–1%. On a ₹5 crore apartment, stamp duty and registration together add ₹35–40 lakh. Transactions above ₹1 crore also require TDS at 1% of the consideration.',
  },
]

const PROJECT_STATUS_OPTIONS = [
  { value: 'new_launch', label: 'New Launch' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready_to_move', label: 'Ready to Move' },
]

// ─── Component ────────────────────────────────────────────────────────────────

function LuxuryApartmentsGurgaonInner() {
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
    project_status: searchParams.get('project_status') || '',
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
      params.set('segment', 'luxury')
      params.set('limit', '12')
      params.set('page', String(currentPage))
      if (filters.project_status) params.set('project_status', filters.project_status)
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
    router.push(`/gurgaon/luxury-apartments?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setFilters({ project_status: '', minPrice: '', maxPrice: '', bedrooms: '', rera_registered: '' })
    router.push('/gurgaon/luxury-apartments')
  }

  const handlePage = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    params.set('page', String(page))
    params.set('view', viewMode)
    router.push(`/gurgaon/luxury-apartments?${params.toString()}`)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <>
      <Header />

      <EnquiryPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        pageContext="Luxury Apartments in Gurgaon"
        corridorName={popupCorridor}
      />

      {/* ── SEO Head content inline ── */}
      <main className="min-h-screen bg-white">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative bg-[var(--luxury-navy)] overflow-hidden min-h-[520px] flex items-end">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80"
              alt="Luxury apartments in Gurgaon"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--luxury-navy)] via-[var(--luxury-navy)]/80 to-transparent" />
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--luxury-gold)] to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/properties" className="hover:text-white transition-colors">Properties</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[var(--luxury-gold)]">Luxury Apartments in Gurgaon</span>
            </nav>

            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-[var(--luxury-gold)] fill-[var(--luxury-gold)]" />
              <span className="text-white/70 text-sm uppercase tracking-widest font-light">Premium Segment</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              Luxury Apartments in Gurgaon:<br className="hidden md:block" />
              <span className="text-[var(--luxury-gold)]"> Premium Flats, Top Projects</span>
              <br className="hidden md:block" /> & Complete Buyer&apos;s Guide 2026
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
              Explore verified luxury apartments across Golf Course Road, GCER and Dwarka Expressway — real prices, RERA-registered projects, and expert guidance on CountryRoof.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--luxury-gold)] text-[var(--luxury-navy)] font-semibold rounded-lg hover:bg-[var(--luxury-gold)]/90 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                View Luxury Projects
              </button>
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Get Expert Recommendations
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-10">
              {MARKET_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY GURGAON ──────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mb-6 text-balance">
              Why Buyers Are Choosing Gurgaon for Luxury Living Right Now
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                Gurgaon is not a market that needs to be sold. Anyone evaluating luxury apartments in this city already knows what it offers — India&apos;s deepest corporate employment base, world-class social infrastructure, airport proximity unmatched by any other NCR location, and a residential product pipeline that is genuinely competitive with the best of Mumbai and Bangalore.
              </p>
              <p>
                Gurgaon&apos;s luxury residential market has absorbed three consecutive years of strong demand without a correction. New launch projects from credible developers in established corridors are selling 60 to 80 percent of inventory within months. Ready-to-move luxury apartments are transacting at all-time high prices in the secondary market. The NRI buyer cohort is the most active it has been in a decade.
              </p>
              <p>
                The opportunity is real. So is the risk of buying the wrong project from the wrong developer in the wrong location. This guide helps you tell the difference.
              </p>
            </div>
          </div>
        </section>

        {/* ── PRICE TIERS ──────────────────────────────────────────────────── */}
        <section className="py-12 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--luxury-navy)] mb-2">
              Market Snapshot 2026 — Three Price Tiers
            </h2>
            <p className="text-gray-600 mb-8">The three-tier price segmentation in Gurgaon&apos;s luxury market:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICE_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className={cn(
                    'rounded-xl border p-6 flex flex-col gap-3 transition-shadow',
                    tier.featured
                      ? 'bg-[var(--luxury-navy)] border-[var(--luxury-gold)] text-white shadow-xl'
                      : 'bg-white border-[var(--luxury-border)] hover:shadow-md'
                  )}
                >
                  {tier.featured && (
                    <span className="text-xs font-bold text-[var(--luxury-gold)] uppercase tracking-widest">Most Active Segment</span>
                  )}
                  <h3 className={cn('text-xl font-bold', tier.featured ? 'text-white' : 'text-[var(--luxury-navy)]')}>
                    {tier.label}
                  </h3>
                  <p className={cn('text-2xl font-bold', tier.featured ? 'text-[var(--luxury-gold)]' : 'text-[var(--luxury-gold)]')}>
                    {tier.range}
                  </p>
                  <p className={cn('text-sm leading-relaxed', tier.featured ? 'text-white/80' : 'text-gray-600')}>
                    {tier.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CORRIDORS ────────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mb-2 text-balance">
              Top Locations for Luxury Apartments in Gurgaon
            </h2>
            <p className="text-gray-600 mb-10">Choose the corridor that matches your workplace, family, investment horizon, and budget.</p>
            <div className="space-y-6">
              {CORRIDORS.map((corridor, i) => (
                <div key={corridor.name} className="flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-[var(--luxury-border)] bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--luxury-navy)] text-white font-bold text-lg flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-[var(--luxury-navy)]">{corridor.name}</h3>
                      <span className="text-xs font-semibold text-[var(--luxury-gold)] bg-[var(--luxury-gold)]/10 px-3 py-1 rounded-full">
                        {corridor.price}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--luxury-gold)] mb-2 italic">{corridor.highlight}</p>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{corridor.description}</p>
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-[var(--luxury-navy)]">Right for you if:</span> {corridor.rightFor}
                    </p>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <button
                      type="button"
                      onClick={() => openEnquiryPopup(corridor.name)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--luxury-navy)] border border-[var(--luxury-navy)] px-4 py-2 rounded-lg hover:bg-[var(--luxury-navy)] hover:text-white transition-colors"
                    >
                      View Projects <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONNECTIVITY ─────────────────────────────────────────────────── */}
        <section className="py-16 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-8">Connectivity & Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <MapPin className="h-6 w-6 text-[var(--luxury-gold)]" />,
                  title: 'Road Connectivity',
                  points: ['NH-48 — India\'s best-maintained national highway', 'Dwarka Expressway (NH-248BB) — fully operational since 2024', 'Southern Peripheral Road & Northern Peripheral Road', 'KMP Expressway — encircles Gurgaon\'s western/southern edge'],
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-[var(--luxury-gold)]" />,
                  title: 'Metro Connectivity',
                  points: ['Delhi Metro Yellow Line: HUDA City Centre to Rajiv Chowk', 'Rapid Metro through DLF Cyber City and Golf Course Road', 'Extension lines to GCER and Dwarka Expressway in planning', 'Direct connectivity to Central Delhi'],
                },
                {
                  icon: <Zap className="h-6 w-6 text-[var(--luxury-gold)]" />,
                  title: 'Airport Access',
                  points: ['15 minutes from Dwarka Expressway corridor', 'Under 25 minutes from Golf Course Road', 'Best NCR airport access at luxury residential quality', 'Strategic for NRI buyers and frequent business travellers'],
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-[var(--luxury-border)] hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {item.icon}
                    <h3 className="text-lg font-bold text-[var(--luxury-navy)]">{item.title}</h3>
                  </div>
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
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-8">Employment, Schools, Hospitals & Lifestyle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Employment Hubs',
                  content: 'DLF Cyber City and Cyber Park form one of India\'s largest Grade A office destinations — Google, Amazon, Microsoft, McKinsey, Goldman Sachs. Udyog Vihar, Golf Course Road offices, and Manesar\'s IMT anchor multi-corridor demand. Gurgaon\'s multi-node employment protects the market from single-industry risk.',
                },
                {
                  title: 'Educational Institutions',
                  content: 'The Shri Ram School (Moulsari & Aravali), GD Goenka World School, Pathways World School, Scottish High International, DPS (multiple campuses), Amity International and Heritage School collectively cover IB, Cambridge, and CBSE. Critical for NRI buyers requiring curriculum flexibility.',
                },
                {
                  title: 'Healthcare Facilities',
                  content: 'Medanta — The Medicity (Sector 38), Fortis Memorial Research Institute (Sector 44), Artemis Hospital (Sector 51), Max Hospital (Sector 56), and Paras Hospital. Medanta is a tertiary care institution of international calibre, attracting medical tourism from across South Asia.',
                },
                {
                  title: 'Retail & Lifestyle',
                  content: 'DLF Cyber Hub — North India\'s most sophisticated F&B destination (100+ restaurants). The Galleria Market in DLF Phase IV. Ambience Mall, MGF Metropolitan, and South Point Mall. The DLF Golf and Country Club, Aravalli Biodiversity Park, and a high-net-worth residential community that creates a lifestyle ecosystem unmatched in Indian real estate.',
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-[var(--luxury-border)] hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-[var(--luxury-navy)] mb-3">{item.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEVELOPERS ───────────────────────────────────────────────────── */}
        <section className="py-16 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-2">Developer Highlights</h2>
            <p className="text-gray-600 mb-8">Who builds the best luxury apartments in Gurgaon</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEVELOPERS.map((dev) => (
                <div key={dev.name} className="bg-white rounded-xl p-5 border border-[var(--luxury-border)] hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--luxury-navy)] flex items-center justify-center text-white font-bold text-sm">
                      {dev.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-[var(--luxury-navy)]">{dev.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{dev.strength}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS LISTING ─────────────────────────────────────────────── */}
        <section id="projects" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-2">Featured Luxury Projects in Gurgaon</h2>
                <p className="text-gray-600">RERA-verified listings with real prices and expert guidance</p>
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
                  Get Expert Advice
                </Link>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-[var(--luxury-cream)] rounded-xl border border-[var(--luxury-border)] p-5 mb-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Project Status</label>
                    <select
                      value={filters.project_status}
                      onChange={(e) => updateFilter('project_status', e.target.value)}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none"
                    >
                      <option value="">Any Status</option>
                      {PROJECT_STATUS_OPTIONS.map((s) => (
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
                {loading ? 'Loading...' : `${pagination?.total || 0} Luxury Properties`}
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
                <h3 className="text-xl font-semibold text-[var(--luxury-navy)] mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <Button onClick={clearAllFilters} variant="outline">Clear Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePage(currentPage - 1)}
                >
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
                <Button
                  variant="outline"
                  disabled={currentPage === pagination.pages}
                  onClick={() => handlePage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}

            {/* CTA below listings */}
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link
                href="/properties?segment=luxury&project_status=new_launch&city=Gurgaon"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--luxury-navy)] text-[var(--luxury-navy)] rounded-lg text-sm font-medium hover:bg-[var(--luxury-navy)] hover:text-white transition-colors"
              >
                Browse New Launch Projects
              </Link>
              <Link
                href="/properties?segment=luxury&project_status=under_construction&city=Gurgaon"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--luxury-navy)] text-[var(--luxury-navy)] rounded-lg text-sm font-medium hover:bg-[var(--luxury-navy)] hover:text-white transition-colors"
              >
                Under-Construction Projects
              </Link>
              <Link
                href="/properties?segment=luxury&project_status=ready_to_move&city=Gurgaon"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--luxury-navy)] text-[var(--luxury-navy)] rounded-lg text-sm font-medium hover:bg-[var(--luxury-navy)] hover:text-white transition-colors"
              >
                Ready-to-Move Apartments
              </Link>
            </div>
          </div>
        </section>

        {/* ── BUYER CHECKLIST ───────────────────────────────────────────────── */}
        <section className="py-16 bg-[var(--luxury-navy)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-2">Things Buyers Must Verify Before Purchasing</h2>
            <p className="text-white/70 mb-8">Non-negotiable due diligence checklist for luxury apartment buyers in Gurgaon</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'HRERA Registration', desc: 'Search the project on the HRERA portal, confirm registration number, review escrow account details, and check the disclosed completion timeline. Non-negotiable before any payment.' },
                { title: 'Developer Delivery Record', desc: "Verify in Gurgaon specifically — not other cities. A developer's completion history in other markets is less relevant. Visit completed projects, speak with residents." },
                { title: 'Carpet Area Calculation', desc: 'Always calculate cost per sqft on carpet area, not super built-up area. Loading factors run 1.25–1.45 in the luxury segment. RERA mandates carpet area disclosure.' },
                { title: 'OC and CC Status', desc: 'For ready units: the Occupancy Certificate and Completion Certificate from GMDA confirm legal approval for habitation. No OC = do not make final payment.' },
                { title: 'Total Acquisition Cost', desc: 'Base price + stamp duty (7% / 5%) + registration + GST (5% under-construction) + club membership (₹5–25 lakh) + maintenance deposit (24 months) + fit-out. Adds 12–20% above listed price.' },
                { title: 'Title Verification', desc: 'Gurgaon has a complex land title history. Legal verification by a qualified property lawyer is essential before executing any agreement. A fixed cost trivial relative to the transaction.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
                  <Shield className="h-6 w-6 text-[var(--luxury-gold)] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARKET OUTLOOK ───────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-6">2026 Market Outlook</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                Gurgaon&apos;s luxury residential market enters 2026 with better fundamentals than at any prior point in the city&apos;s history. Demand is structural rather than speculative. Supply from credible developers is being absorbed faster than it is being launched. Infrastructure investments continue to expand the city&apos;s attractive geography.
              </p>
              <p>
                The primary caution is corridor and developer concentration risk. GCER and Dwarka Expressway are both seeing multiple large projects launch simultaneously. The flight to quality is real and ongoing — established developers in established or demonstrably improving corridors are performing well.
              </p>
              <p>
                The five-year outlook is positive and grounded in structural factors. The buyers who will perform best are those who buy the right product from the right developer in the right corridor.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--luxury-navy)] text-white rounded-lg font-medium hover:bg-[var(--luxury-navy)]/90 transition-colors">
                <MessageCircle className="h-4 w-4" />
                Get Investment Advice
              </Link>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--luxury-navy)] text-[var(--luxury-navy)] rounded-lg font-medium hover:bg-[var(--luxury-navy)] hover:text-white transition-colors"
              >
                Browse Verified Projects
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-16 bg-[var(--luxury-cream)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-8">
              Frequently Asked Questions About Luxury Apartments in Gurgaon
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[var(--luxury-border)] overflow-hidden"
                >
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
            <h2 className="text-xl font-bold text-[var(--luxury-navy)] mb-5">Explore Related Pages</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'New Launch Projects in Gurgaon', href: '/gurgaon/new-launch-projects' },
                { label: '3 BHK Apartments in Gurgaon', href: '/gurgaon/3-bhk-apartments' },
                { label: 'Golf Course Extension Road Properties', href: '/properties?location=golf+course+extension+road' },
                { label: 'Dwarka Expressway Projects', href: '/properties?location=dwarka+expressway' },
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
            <h2 className="text-3xl font-bold text-white mb-4">
              Making the Right Luxury Property Decision in Gurgaon
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Browse luxury apartments across Gurgaon&apos;s top corridors on CountryRoof. Compare verified listings by location, developer, configuration, and price. Access RERA details, pricing history, and possession timelines to make the most informed luxury property decision in Gurgaon&apos;s 2026 market.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--luxury-gold)] text-[var(--luxury-navy)] font-bold rounded-lg hover:bg-[var(--luxury-gold)]/90 transition-colors"
              >
                Browse Verified Projects
              </button>
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Schedule Site Visit
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

export default function LuxuryApartmentsGurgaon() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LuxuryApartmentsGurgaonInner />
    </Suspense>
  )
}
