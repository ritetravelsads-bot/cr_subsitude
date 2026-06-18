import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceEnquiryForm from "@/components/services/service-enquiry-form"
import {
  Building2,
  CheckCircle2,
  ArrowLeft,
  Star,
  Gift,
  Clock,
  Percent,
  Users,
  Shield,
  Award,
  TrendingUp
} from "lucide-react"

export const metadata: Metadata = {
  title: "Builder Partnerships | Exclusive Project Deals | CountryRoof",
  description:
    "Direct partnerships with top developers for exclusive project launches, early bird offers, and channel partner benefits. Get direct builder pricing on premium properties.",
  openGraph: {
    title: "Builder Partnerships | CountryRoof",
    description: "Access exclusive deals through our direct builder partnerships.",
    url: "https://countryroof.in/services/builder-partnerships",
  },
}

const partnerBenefits = [
  {
    icon: Percent,
    title: "Direct Builder Pricing",
    description: "No middlemen, no markups. Get the same pricing offered directly by the developer."
  },
  {
    icon: Clock,
    title: "Early Access",
    description: "Be among the first to know about new project launches before public announcements."
  },
  {
    icon: Gift,
    title: "Exclusive Offers",
    description: "Access special schemes, payment plans, and promotional offers not available elsewhere."
  },
  {
    icon: Star,
    title: "Best Unit Selection",
    description: "Priority access to choose the best floors, views, and unit configurations."
  },
  {
    icon: Shield,
    title: "Verified Projects",
    description: "All partner projects are thoroughly vetted for RERA compliance and developer credibility."
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Direct liaison with builder sales teams for faster resolution of queries."
  },
]

const featuredPartners = [
  { name: "DLF", projects: "15+ Active Projects", type: "Luxury & Premium" },
  { name: "Godrej Properties", projects: "8+ Active Projects", type: "Premium Residential" },
  { name: "M3M", projects: "12+ Active Projects", type: "Commercial & Residential" },
  { name: "Sobha", projects: "6+ Active Projects", type: "Luxury Villas" },
  { name: "Tata Housing", projects: "5+ Active Projects", type: "Affordable & Premium" },
  { name: "Mahindra Lifespaces", projects: "4+ Active Projects", type: "Integrated Townships" },
  { name: "Prestige Group", projects: "7+ Active Projects", type: "Mixed Development" },
  { name: "Emaar India", projects: "10+ Active Projects", type: "Ultra Luxury" },
]

const exclusiveOffers = [
  "Zero booking amount on select projects",
  "Flexi payment plans with extended timelines",
  "Free modular kitchen worth up to 5 Lakhs",
  "Waived registration charges on early bookings",
  "Complimentary club membership",
  "Free car parking slot (worth up to 10 Lakhs)",
]

const process = [
  {
    step: "01",
    title: "Share Requirements",
    description: "Tell us your budget, preferred location, and property type preferences."
  },
  {
    step: "02",
    title: "Project Recommendations",
    description: "We share exclusive partner projects matching your criteria with special offers."
  },
  {
    step: "03",
    title: "Site Visits & Selection",
    description: "Accompanied site visits with detailed project information and comparisons."
  },
  {
    step: "04",
    title: "Exclusive Booking",
    description: "Book through us to avail channel partner benefits and special pricing."
  },
]

export default function BuilderPartnershipsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-orange-900 via-orange-800 to-orange-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-orange-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Building2 className="w-4 h-4" />
                  Exclusive Access
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Builder Partnerships
                </h1>
                <p className="text-lg text-orange-100">
                  Direct partnerships with India&apos;s top developers give you access to exclusive project launches, early bird offers, and the best pricing in the market.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-orange-300" />
                    <span>50+ Developer Partners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-orange-300" />
                    <span>100+ Active Projects</span>
                  </div>
                </div>
              </div>

              <div className="bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl font-semibold mb-2">Get Exclusive Access</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Register to receive updates on exclusive project launches and offers.
                </p>
                <ServiceEnquiryForm serviceName="Builder Partnerships" serviceId="builder-partnerships" />
              </div>
            </div>
          </div>
        </section>

        {/* Partner Benefits */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Book Through Us?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our direct partnerships with developers unlock exclusive benefits you won&apos;t find elsewhere.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerBenefits.map((benefit, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Partners */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Developer Partners</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We work with India&apos;s most trusted developers to bring you the best projects.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredPartners.map((partner, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">{partner.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{partner.projects}</p>
                  <span className="inline-block text-xs px-2 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-full mt-2">
                    {partner.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exclusive Offers */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Current Exclusive Offers
                </h2>
                <p className="text-muted-foreground">
                  Take advantage of limited-time offers available only through our channel partner network.
                </p>
                <ul className="space-y-3">
                  {exclusiveOffers.map((offer, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Gift className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">{offer}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  *Offers vary by project and are subject to availability. Contact us for current promotions.
                </p>
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/contact">Explore Current Offers</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 rounded-2xl p-8 border border-orange-500/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <Award className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">50+</div>
                      <div className="text-sm text-muted-foreground">Developer Partners</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">100+</div>
                      <div className="text-sm text-muted-foreground">Active Projects</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">Save Up To</div>
                      <div className="text-sm text-muted-foreground">15 Lakhs on Bookings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A simple process to access exclusive deals through our builder partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Want Access to Exclusive Project Launches?
            </h2>
            <p className="text-muted-foreground">
              Register now to receive updates on new launches and exclusive offers from our builder partners.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-orange-600 hover:bg-orange-700">
                <Link href="/contact">Register for Exclusive Access</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/properties">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
