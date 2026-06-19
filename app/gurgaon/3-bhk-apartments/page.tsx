'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight, ChevronDown, ChevronUp, SlidersHorizontal,
  X, Grid3X3, List, Home, TrendingUp, Shield, Building2,
  CheckCircle2, Phone, MessageCircle, ArrowRight, Bed, MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, BUDGET_RANGES, parseBudgetRange } from '@/lib/utils'
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
    price3bhk: '₹2.5 Cr – ₹6 Cr',
    developers: 'M3M, Godrej Properties, Emaar India, Sobha, Tata Housing',
    description: 'The address most premium 3 BHK buyers in Gurgaon aspire to. Established, well-planned, and home to some of the city\'s most respected residential projects. Consistent first recommendation for end-users who want a home that will hold its value.',
    link: '/properties?bedrooms=3&location=golf+course+extension+road',
  },
  {
    name: 'Golf Course Road',
    sectors: 'Sectors 42, 53, 54, 56',
    price3bhk: '₹4 Cr – ₹12 Cr+',
    developers: 'DLF (secondary market)',
    description: "Gurgaon's most prestigious residential corridor. 3 BHK availability in new launches is limited, but the secondary resale market carries steady inventory in DLF's landmark projects. For buyers who prioritise address prestige and long-term value preservation.",
    link: '/properties?bedrooms=3&location=golf+course+road',
  },
  {
    name: 'Dwarka Expressway',
    sectors: 'Sectors 99–113',
    price3bhk: '₹1.2 Cr – ₹3 Cr',
    developers: 'Sobha, DLF, M3M, Signature Global',
    description: 'Fully operational expressway, improving metro connectivity. 3 BHK price advantage relative to Golf Course Extension Road remains significant. Strong appreciation potential for buyers who cannot stretch to GCER pricing.',
    link: '/properties?bedrooms=3&location=dwarka+expressway',
  },
  {
    name: 'Southern Peripheral Road (SPR)',
    sectors: 'Sectors 68, 70, 71, 72, 74A',
    price3bhk: '₹1.5 Cr – ₹3.5 Cr',
    developers: 'BPTP, Silverglades, boutique developers',
    description: 'Premium, but slightly more accessible in price than GCER. Predominantly large-format gated communities with generous amenity provision. GCER adjacency at a lower price point.',
    link: '/properties?bedrooms=3&location=southern+peripheral+road',
  },
  {
    name: 'Sohna Road',
    sectors: 'Sectors 47–56',
    price3bhk: '₹80 L – ₹3 Cr',
    developers: 'Tata Housing, Bestech, Vatika, Emaar',
    description: 'Long residential track record with well-developed social infrastructure. Proximate to major employment hubs with consistent demand from both buyers and tenants. Most accessible premium corridor in the city.',
    link: '/properties?bedrooms=3&location=sohna+road',
  },
  {
    name: 'New Gurgaon',
    sectors: 'Sectors 76–95',
    price3bhk: '₹1 Cr – ₹2.2 Cr',
    developers: 'Elan Group, Vatika, Hero Realty',
    description: 'High-volume destination for 3 BHK buyers attracted by relative price advantage and fresh infrastructure. Social infrastructure still maturing — ideal for buyers with a 3 to 5-year settlement perspective.',
    link: '/properties?bedrooms=3&location=new+gurgaon',
  },
]

const TYPE_TIERS = [
  {
    label: 'New Launch 3 BHK',
    range: 'Entry price advantage',
    description: 'Price advantage at entry, choice of floor and unit from available inventory, appreciation potential between booking and possession. Most active corridors: Dwarka Expressway, GCER, and New Gurgaon.',
    cta: 'Explore New Launches',
    href: '/properties?bedrooms=3&project_status=new_launch&city=Gurgaon',
  },
  {
    label: 'Under Construction',
    range: 'Best risk-adjusted entry',
    description: 'Construction has progressed to a visible stage. Price advantage over ready-to-move units is often still present. Projects at 50–80% completion offer the best risk-reward profile for buyers who can wait 12–24 months.',
    cta: 'View Under Construction',
    href: '/properties?bedrooms=3&project_status=under_construction&city=Gurgaon',
    featured: true,
  },
  {
    label: 'Ready to Move',
    range: 'Immediate occupancy',
    description: 'Immediate occupancy, what-you-see certainty, and no GST liability. Higher price relative to new launch, but immediate rental income for investors and fixed move-in timeline for end-users.',
    cta: 'Find Ready to Move',
    href: '/properties?bedrooms=3&project_status=ready_to_move&city=Gurgaon',
  },
]

const PRICE_RANGES = [
  { tier: 'Ultra-Luxury 3 BHK', range: '₹5 Cr+', description: 'DLF on Golf Course Road and GCER, Sobha City in Sector 108, select M3M and Emaar projects. Finest finishes, complete amenity ecosystems.' },
  { tier: 'Premium 3 BHK', range: '₹2 – 5 Cr', description: 'Godrej Properties, Tata Housing, Central Park, M3M across GCER, Dwarka Expressway, and SPR. Most active segment — strong for both end-use and investment.', featured: true },
  { tier: 'Mid-Premium 3 BHK', range: '₹1 – 2 Cr', description: "Dwarka Expressway and New Gurgaon sectors. Signature Global's upper range, Elan, Vatika, and Hero Realty. Wide buyer base, credible quality standards." },
]

const CHECKLIST = [
  { title: 'Configuration & Carpet Area', desc: 'Confirm actual carpet area (not super built-up area) of the unit. A 1,800 sqft unit with well-proportioned rooms is better than a 2,100 sqft unit with an inefficient layout. RERA mandates carpet area disclosure.' },
  { title: 'Floor and Facing', desc: 'Higher floors typically command better views and ventilation. East or north facing is often preferred for natural light without harsh afternoon heat, though this varies by project orientation.' },
  { title: 'Developer Delivery History', desc: 'Research past projects — delivered on time, and what quality compared to brochure promises? For any purchase above ₹1 crore, restrict evaluation to developers with verifiable Gurgaon delivery records.' },
  { title: 'RERA Status', desc: 'For new launches and under-construction projects, verify RERA registration and check projected completion date on the HRERA portal. Non-negotiable before any payment.' },
  { title: 'Maintenance Charges', desc: 'Premium projects charge ₹5–12/sqft/month. On a 2,000 sqft apartment: ₹10,000–24,000/month ongoing. Factor into total cost of ownership calculation.' },
  { title: 'Total Acquisition Cost', desc: 'Stamp duty + registration (approx 7–7.5% of circle rate) + GST (5% for under-construction) + brokerage + mandatory deposits. These additions are not negotiable.' },
]

const RENTAL_DATA = [
  { corridor: 'Golf Course Extension Road', type: 'Furnished 3 BHK', rent: '₹60,000 – ₹1,20,000/month' },
  { corridor: 'Golf Course Road', type: 'Luxury 3 BHK', rent: '₹1,20,000 – ₹3,00,000/month' },
  { corridor: 'Dwarka Expressway & SPR', type: '3 BHK', rent: '₹35,000 – ₹70,000/month' },
  { corridor: 'New Gurgaon', type: '3 BHK', rent: '₹25,000 – ₹50,000/month' },
  { corridor: 'Sohna Road', type: '3 BHK', rent: '₹30,000 – ₹60,000/month' },
]

const FAQS = [
  {
    q: 'What is the price of a 3 BHK apartment in Gurgaon in 2025?',
    a: 'The price varies significantly by corridor and developer. In Golf Course Extension Road sectors, premium 3 BHK units in new launches are priced between ₹2.5 crore and ₹5 crore. On Dwarka Expressway, credible 3 BHK developments range between ₹1.2 crore and ₹3 crore. New Gurgaon sectors offer 3 BHK options from approximately ₹1 crore upwards. Golf Course Road resale 3 BHK units in established luxury projects start from ₹4 crore.',
  },
  {
    q: 'Which is the best location for a 3 BHK apartment in Gurgaon?',
    a: 'The best location depends on your priorities. For premium lifestyle and established social infrastructure, Golf Course Extension Road leads. For investment with strong appreciation potential, Dwarka Expressway offers compelling value. For relative affordability with a growth outlook, New Gurgaon\'s sectors are worth evaluating. For prestige and long-term value retention, Golf Course Road is unmatched.',
  },
  {
    q: 'What is the carpet area of a typical 3 BHK in Gurgaon?',
    a: 'In premium and luxury developments, 3 BHK units typically have carpet areas between 1,400 and 2,200 sqft. Super built-up area (which developers use for pricing) is typically 25–35% higher than carpet area. Always ask for the RERA carpet area figure when evaluating a project, as this is the legally standardised measurement.',
  },
  {
    q: 'Are there ready-to-move 3 BHK apartments available in Gurgaon?',
    a: 'Yes. Ready-to-move 3 BHK apartments are available across most established corridors — Golf Course Road, Golf Course Extension Road, Sohna Road, MG Road, and sectors along NH-48. Ready-to-move units have no GST liability and offer immediate occupancy or rental income.',
  },
  {
    q: 'What is the rental income from a 3 BHK in Gurgaon?',
    a: 'In premium Golf Course Extension Road projects, a well-furnished 3 BHK commands ₹60,000 – ₹1,20,000/month. On Dwarka Expressway and SPR, comparable projects see ₹35,000 – ₹70,000. New Gurgaon 3 BHK units typically rent between ₹25,000 – ₹50,000 as the sector matures. Rental yields average 2.5–3.5% of capital value.',
  },
  {
    q: 'Should I buy a new launch or ready-to-move 3 BHK?',
    a: 'New launches offer price advantage at entry, choice of unit, and appreciation potential during construction. Ready-to-move units offer immediate occupancy, no GST, and what-you-see certainty. If you need a home immediately, ready-to-move is correct. If you have 3 to 5 years of flexibility and are buying from a credible developer, a new launch may offer better long-term returns.',
  },
  {
    q: 'Which developers offer the best 3 BHK projects in Gurgaon?',
    a: 'DLF, Godrej Properties, Sobha, M3M, Emaar India, and Tata Housing are consistently regarded as the most credible developers. Their projects typically deliver on build quality, timeline, and amenity provision. Signature Global has established credibility in the mid-premium segment. Due diligence on any developer remains important regardless of brand reputation.',
  },
  {
    q: 'What are the maintenance charges for premium 3 BHK apartments?',
    a: 'Maintenance charges in premium Gurgaon projects typically range from ₹5 to ₹12 per sqft per month. On a 2,000 sqft 3 BHK, this translates to ₹10,000 to ₹24,000 per month. Ultra-luxury projects with extensive amenities and services may charge more. Buyers should factor maintenance costs into their total cost of ownership calculation.',
  },
]

const PROJECT_STATUS_OPTIONS = [
  { value: 'new_launch', label: 'New Launch' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready_to_move', label: 'Ready to Move' },
]

const SEGMENT_OPTIONS = [
  { value: 'luxury', label: 'Luxury' },
  { value: 'premium', label: 'Premium' },
  { value: 'mid', label: 'Mid Range' },
]

// ─── Component ────────────────────────────────────────────────────────────────

function ThreeBHKApartmentsGurgaonInner() {
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
    segment: searchParams.get('segment') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
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
      params.set('bedrooms', '3')
      params.set('limit', '12')
      params.set('page', String(currentPage))
      if (filters.project_status) params.set('project_status', filters.project_status)
      if (filters.segment) params.set('segment', filters.segment)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
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
    router.push(`/gurgaon/3-bhk-apartments?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setFilters({ project_status: '', segment: '', minPrice: '', maxPrice: '', rera_registered: '' })
    router.push('/gurgaon/3-bhk-apartments')
  }

  const handlePage = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    params.set('page', String(page))
    params.set('view', viewMode)
    router.push(`/gurgaon/3-bhk-apartments?${params.toString()}`)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <>
      <Header />

      <EnquiryPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        pageContext="3 BHK Apartments in Gurgaon"
        corridorName={popupCorridor}
      />

      <main className="min-h-screen bg-white">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative bg-[var(--luxury-navy)] overflow-hidden min-h-[520px] flex items-end">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1600&q=80"
              alt="3 BHK apartments in Gurgaon"
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
              <span className="text-[var(--luxury-gold)]">3 BHK Apartments in Gurgaon</span>
            </nav>

            <div className="flex items-center gap-2 mb-4">
              <Bed className="h-5 w-5 text-[var(--luxury-gold)]" />
              <span className="text-white/70 text-sm uppercase tracking-widest font-light">3 BHK — Most Sought-After Configuration</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              3 BHK Apartments in Gurgaon —<br className="hidden md:block" />
              <span className="text-[var(--luxury-gold)]">A Buyer&apos;s Guide</span>
              <br className="hidden md:block" /> to Finding the Right Home in 2025–26
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
              The 3 BHK sits at the intersection of practical family space and the premium lifestyle Gurgaon buyers expect. This guide gives you honest pricing, the best locations, and the questions worth asking before you commit.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--luxury-gold)] text-[var(--luxury-navy)] font-semibold rounded-lg hover:bg-[var(--luxury-gold)]/90 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                Get 3 BHK Options in Gurgaon
              </button>
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Talk to Property Expert
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8 mt-10">
              {[
                { label: 'Price Range', value: '₹80 L – ₹12 Cr+' },
                { label: 'Carpet Area', value: '1,400 – 2,200 sqft' },
                { label: 'Rental Yield', value: '2.5% – 3.5% p.a.' },
                { label: 'Top Corridors', value: 'GCER, Dwarka, Sohna' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY 3 BHK ────────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mb-6 text-balance">
              Why a 3 BHK Is the Most Sought-After Configuration in Gurgaon Right Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>
                  The 3 BHK has always been Gurgaon&apos;s volume configuration, but the reasons behind that demand have evolved. Post-pandemic, the preference for larger, well-planned living spaces has become pronounced. Remote and hybrid work made the home an office, a school, and a living space simultaneously — and 2 BHKs simply didn&apos;t accommodate that well for families.
                </p>
                <p>
                  The result is sustained demand from buyers who actually intend to live there. A family with two children, ageing parents, or a home office requirement finds the 3 BHK the natural solution. Senior corporate professionals relocating from other cities — a significant buyer segment in Gurgaon — typically enter the market at the 3 BHK level.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Home className="h-5 w-5 text-[var(--luxury-gold)]" />, title: 'End-User Demand', desc: 'Families, WFH professionals, relocating executives' },
                  { icon: <TrendingUp className="h-5 w-5 text-[var(--luxury-gold)]" />, title: 'Investment Appeal', desc: 'Highest rental demand and resale liquidity of any config' },
                  { icon: <MapPin className="h-5 w-5 text-[var(--luxury-gold)]" />, title: 'Corporate Rental', desc: '₹50,000–1,50,000/month from senior professionals' },
                  { icon: <Shield className="h-5 w-5 text-[var(--luxury-gold)]" />, title: 'NRI Demand', desc: 'Most active in ₹2–5 Cr range from Gulf and Western NRIs' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl border border-[var(--luxury-border)] bg-[var(--luxury-cream)]">
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon}
                      <h4 className="font-bold text-[var(--luxury-navy)] text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT DOES IT LOOK LIKE ───────────────────────────────────────── */}
        <section className="py-12 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--luxury-navy)] mb-6">
              What a 3 BHK in Gurgaon Actually Looks Like in 2025
            </h2>
            <div className="bg-white rounded-xl border border-[var(--luxury-border)] p-6 mb-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                A &quot;3 BHK&quot; is not a uniform product. Across the market, 3 BHK units range from compact 1,300 sqft apartments in mid-range developments to sprawling 3,200 sqft residences in ultra-luxury towers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In the premium segment — CountryRoof&apos;s primary focus — 3 BHK apartments typically span <strong>1,800 to 2,500 sqft</strong>. They include three bedrooms with attached bathrooms, a drawing and dining area, kitchen with utility space, and often a servant&apos;s room or study. Balconies, private terraces, and home automation integration are increasingly standard in the luxury band.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PRICE_RANGES.map((tier) => (
                <div
                  key={tier.tier}
                  className={cn(
                    'rounded-xl border p-5 transition-shadow',
                    tier.featured
                      ? 'bg-[var(--luxury-navy)] border-[var(--luxury-gold)] text-white shadow-xl'
                      : 'bg-white border-[var(--luxury-border)] hover:shadow-md'
                  )}
                >
                  {tier.featured && (
                    <span className="text-xs font-bold text-[var(--luxury-gold)] uppercase tracking-widest block mb-2">Most Active</span>
                  )}
                  <h3 className={cn('font-bold mb-1', tier.featured ? 'text-white' : 'text-[var(--luxury-navy)]')}>
                    {tier.tier}
                  </h3>
                  <p className={cn('text-2xl font-bold mb-3', 'text-[var(--luxury-gold)]')}>
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
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-2">Top Locations for 3 BHK Apartments in Gurgaon</h2>
            <p className="text-gray-600 mb-8">From the most established luxury corridors to the emerging value plays.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CORRIDORS.map((corridor) => (
                <div key={corridor.name} className="rounded-xl border border-[var(--luxury-border)] p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-[var(--luxury-navy)]">{corridor.name}</h3>
                    <span className="text-xs font-semibold text-[var(--luxury-gold)] bg-[var(--luxury-gold)]/10 px-3 py-1 rounded-full">
                      {corridor.price3bhk}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Sectors: {corridor.sectors}</p>
                  <p className="text-xs text-gray-500 mb-3">Developers: {corridor.developers}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{corridor.description}</p>
                  <button
                    type="button"
                    onClick={() => openEnquiryPopup(corridor.name)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--luxury-navy)] border border-[var(--luxury-navy)] px-4 py-2 rounded-lg hover:bg-[var(--luxury-navy)] hover:text-white transition-colors"
                  >
                    View 3 BHK Projects <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECT TYPES ────────────────────────────────────────────────── */}
        <section className="py-12 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--luxury-navy)] mb-6">Types of 3 BHK Apartments Available in Gurgaon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TYPE_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className={cn(
                    'rounded-xl border p-6 flex flex-col gap-4',
                    tier.featured
                      ? 'bg-[var(--luxury-navy)] border-[var(--luxury-gold)] shadow-xl'
                      : 'bg-white border-[var(--luxury-border)] hover:shadow-md transition-shadow'
                  )}
                >
                  {tier.featured && (
                    <span className="text-xs font-bold text-[var(--luxury-gold)] uppercase tracking-widest">Best Risk-Adjusted Entry</span>
                  )}
                  <div>
                    <h3 className={cn('text-lg font-bold mb-1', tier.featured ? 'text-white' : 'text-[var(--luxury-navy)]')}>
                      {tier.label}
                    </h3>
                    <p className={cn('text-sm font-semibold', 'text-[var(--luxury-gold)]')}>{tier.range}</p>
                  </div>
                  <p className={cn('text-sm leading-relaxed flex-1', tier.featured ? 'text-white/80' : 'text-gray-600')}>
                    {tier.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => openEnquiryPopup(tier.label)}
                    className={cn(
                      'inline-flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg transition-colors',
                      tier.featured
                        ? 'bg-[var(--luxury-gold)] text-[var(--luxury-navy)] hover:bg-[var(--luxury-gold)]/90'
                        : 'border border-[var(--luxury-navy)] text-[var(--luxury-navy)] hover:bg-[var(--luxury-navy)] hover:text-white'
                    )}
                  >
                    {tier.cta} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RENTAL TABLE ─────────────────────────────────────────────────── */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--luxury-navy)] mb-2">Rental Income from 3 BHK Apartments in Gurgaon</h2>
            <p className="text-gray-600 mb-6">Corporate professionals at senior levels drive a deep, consistently employed tenant pool.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-xl overflow-hidden border border-[var(--luxury-border)]">
                <thead>
                  <tr className="bg-[var(--luxury-navy)] text-white">
                    <th className="text-left p-4 font-semibold">Corridor</th>
                    <th className="text-left p-4 font-semibold">Unit Type</th>
                    <th className="text-left p-4 font-semibold">Monthly Rental</th>
                  </tr>
                </thead>
                <tbody>
                  {RENTAL_DATA.map((row, i) => (
                    <tr key={row.corridor} className={cn('border-t border-[var(--luxury-border)]', i % 2 === 0 ? 'bg-white' : 'bg-[var(--luxury-cream)]/40')}>
                      <td className="p-4 font-medium text-[var(--luxury-navy)]">{row.corridor}</td>
                      <td className="p-4 text-gray-600">{row.type}</td>
                      <td className="p-4 font-semibold text-[var(--luxury-navy)]">{row.rent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">Rental yields on current market values: 2.5–3.5%. Actual rentals vary by floor, furnishing, and project quality.</p>
          </div>
        </section>

        {/* ── PROJECTS LISTING ─────────────────────────────────────────────── */}
        <section id="projects" className="py-16 bg-[var(--luxury-cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-2">3 BHK Apartments in Gurgaon</h2>
                <p className="text-gray-600">Verified listings across all price tiers and corridors</p>
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
                  Check Verified Listings
                </Link>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl border border-[var(--luxury-border)] p-5 mb-6 animate-in slide-in-from-top-2 duration-200">
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
                {loading ? 'Loading...' : `${pagination?.total || 0} Properties with 3 BHK Configuration`}
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
                <h3 className="text-xl font-semibold text-[var(--luxury-navy)] mb-2">No 3 BHK properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={clearAllFilters} variant="outline">Clear Filters</Button>
                  <Link href="/contact" className="inline-flex items-center px-4 py-2 bg-[var(--luxury-navy)] text-white rounded-lg text-sm font-medium">
                    Get Personalised Shortlist
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

        {/* ── BUYER CHECKLIST ───────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-2">Key Things to Evaluate Before Buying a 3 BHK in Gurgaon</h2>
            <p className="text-gray-600 mb-8">This is not a complete legal or financial checklist — buyers should engage qualified advisors before committing.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CHECKLIST.map((item) => (
                <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-[var(--luxury-border)] hover:shadow-md transition-shadow">
                  <Shield className="h-6 w-6 text-[var(--luxury-gold)] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[var(--luxury-navy)] mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUTLOOK ──────────────────────────────────────────────────────── */}
        <section className="py-12 bg-[var(--luxury-navy)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">2026 Market Outlook for 3 BHK Apartments in Gurgaon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Corporate Demand Continues', body: 'Gurgaon\'s position as the preferred location for multinational office expansion in North India shows no signs of reversing. Employment-driven housing demand is the most durable form of residential demand.' },
                { title: 'Supply Is Disciplined', body: 'Developers have become more disciplined about launch volumes, reducing the risk of oversupply in the premium segment. Quality 3 BHK product from credible developers is active but not excessive.' },
                { title: 'Infrastructure Catalysts Ahead', body: 'Metro expansion and road network improvement will selectively unlock value in Dwarka Expressway and New Gurgaon. Price corrections in the premium 3 BHK segment are not a base-case expectation for 2026.' },
              ].map((item) => (
                <div key={item.title} className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-bold text-[var(--luxury-gold)] mb-2">{item.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-16 bg-[var(--luxury-cream)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--luxury-navy)] mb-8">
              Frequently Asked Questions About 3 BHK Apartments in Gurgaon
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
                { label: 'New Launch Projects in Gurgaon', href: '/gurgaon/new-launch-projects' },
                { label: 'Luxury Apartments in Gurgaon', href: '/gurgaon/luxury-apartments' },
                { label: 'Golf Course Extension Road Properties', href: '/properties?location=golf+course+extension+road' },
                { label: 'Dwarka Expressway Apartments', href: '/properties?location=dwarka+expressway' },
                { label: '4 BHK Apartments in Gurgaon', href: '/properties?bedrooms=4&city=Gurgaon' },
                { label: 'Ready to Move Flats Gurgaon', href: '/properties?project_status=ready_to_move&city=Gurgaon' },
                { label: 'Under Construction Projects Gurgaon', href: '/properties?project_status=under_construction&city=Gurgaon' },
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
              Find Your Ideal 3 BHK with CountryRoof
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              CountryRoof is a luxury real estate advisory exclusively focused on Gurgaon. Whether you&apos;re a first-time buyer, an upgrader, an investor, or an NRI exploring remotely, our advisors can help you find the right 3 BHK — not just the one we happen to have listed, but the one that genuinely fits your situation.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--luxury-gold)] text-[var(--luxury-navy)] font-bold rounded-lg hover:bg-[var(--luxury-gold)]/90 transition-colors"
              >
                Get Personalised Shortlist
              </button>
              <button
                type="button"
                onClick={() => openEnquiryPopup()}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to Gurgaon Property Expert
              </button>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}

export default function ThreeBHKApartmentsGurgaon() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ThreeBHKApartmentsGurgaonInner />
    </Suspense>
  )
}
