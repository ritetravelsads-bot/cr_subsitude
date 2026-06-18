import { Suspense } from "react"
import dynamic from "next/dynamic"
import BannerSlider from "@/components/sections/banner-slider"

// Lazy load AdvancedSearch but keep it visible above fold with SSR
const AdvancedSearch = dynamic(() => import("@/components/sections/advanced-search"), {
  ssr: true,
  loading: () => (
    <div className="relative -mt-10 z-10 max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[220px] md:min-h-[200px] animate-pulse">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gray-200 rounded-lg" />
            <div>
              <div className="h-5 w-48 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-36 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 h-14 bg-gray-100 rounded-xl" />
            <div className="h-14 w-32 bg-primary/20 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  ),
})

// Force dynamic rendering to ensure fresh data on every page load
export const revalidate = 0

// Lazy load below-the-fold components for better LCP
const RecentlyViewed = dynamic(() => import("@/components/sections/recently-viewed"), {
  ssr: true,
  loading: () => <div className="h-32" />,
})

const FeaturedVideoProperties = dynamic(() => import("@/components/sections/featured-video-properties"), {
  ssr: true,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />,
})

const FeaturedOfficeSpaces = dynamic(() => import("@/components/sections/featured-office-spaces"), {
  ssr: true,
  loading: () => <div className="h-[600px] bg-slate-50 animate-pulse" />,
})

const TrendingLocations = dynamic(() => import("@/components/sections/trending-locations"), {
  ssr: true,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse" />,
})

const DynamicSections = dynamic(() => import("@/components/sections/dynamic-sections"), {
  ssr: true,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />,
})

const FeaturedDevelopers = dynamic(() => import("@/components/sections/featured-developers"), {
  ssr: true,
  loading: () => <div className="h-96 bg-slate-50 animate-pulse" />,
})

const WhyChooseUs = dynamic(() => import("@/components/sections/why-choose-us"), {
  ssr: true,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse" />,
})

const CTA = dynamic(() => import("@/components/sections/cta"), {
  ssr: true,
  loading: () => <div className="h-48 bg-slate-50 animate-pulse" />,
})

const StatsBar = dynamic(() => import("@/components/sections/stats-bar"), {
  ssr: true,
  loading: () => <div className="h-40 bg-[#002366] animate-pulse" />,
})

const Testimonials = dynamic(() => import("@/components/sections/testimonials"), {
  ssr: true,
  loading: () => <div className="h-80 bg-slate-50 animate-pulse" />,
})

const FAQs = dynamic(() => import("@/components/sections/faqs"), {
  ssr: true,
  loading: () => <div className="h-96 bg-white animate-pulse" />,
})

export default function Home() {
  return (
    <main>
      {/* Critical above-the-fold content - loads immediately */}
      <BannerSlider />
      <AdvancedSearch />
      
      {/* Below-the-fold content - lazy loaded */}
      <Suspense fallback={<div className="h-32" />}>
        <RecentlyViewed />
      </Suspense>
<Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse" />}>
        <FeaturedVideoProperties />
      </Suspense>
      <Suspense fallback={<div className="h-[600px] bg-slate-50 animate-pulse" />}>
        <FeaturedOfficeSpaces />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse" />}>
        <TrendingLocations />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse" />}>
        <DynamicSections />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse" />}>
        <FeaturedDevelopers />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse" />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<div className="h-40 bg-[#002366] animate-pulse" />}>
        <StatsBar />
      </Suspense>
      <Suspense fallback={<div className="h-80 bg-slate-50 animate-pulse" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <FAQs />
      </Suspense>
      <Suspense fallback={<div className="h-48 bg-slate-50 animate-pulse" />}>
        <CTA />
      </Suspense>
    </main>
  )
}
