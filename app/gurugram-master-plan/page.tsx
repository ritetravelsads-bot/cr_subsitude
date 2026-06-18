import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { MapPin, Building2, Train, Trees, Download, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Gurugram Master Plan 2031 | CountryRoof",
  description: "Explore the Gurugram Master Plan 2031 - Comprehensive guide to upcoming infrastructure, development zones, and investment opportunities in Gurugram.",
  openGraph: {
    title: "Gurugram Master Plan 2031 | CountryRoof",
    description: "Complete guide to Gurugram's development plan and real estate investment zones.",
    url: "https://countryroof.in/gurugram-master-plan",
  },
}

const keyHighlights = [
  {
    icon: Building2,
    title: "Residential Zones",
    description: "Planned residential sectors with modern amenities, green spaces, and world-class infrastructure.",
  },
  {
    icon: Train,
    title: "Metro Connectivity",
    description: "Extended metro network covering major residential and commercial hubs across Gurugram.",
  },
  {
    icon: Trees,
    title: "Green Corridors",
    description: "30% green cover mandate with dedicated parks, lakes, and eco-friendly zones.",
  },
  {
    icon: MapPin,
    title: "Strategic Locations",
    description: "New development along Dwarka Expressway, SPR, and Golf Course Extension Road.",
  },
]

const developmentZones = [
  {
    name: "Dwarka Expressway Corridor",
    description: "Major residential and commercial development zone connecting Delhi and Gurugram with upcoming metro stations.",
    status: "High Growth",
    investment: "Excellent",
  },
  {
    name: "Golf Course Extension Road",
    description: "Premium luxury housing sector with established infrastructure and high-end retail spaces.",
    status: "Established",
    investment: "Premium",
  },
  {
    name: "New Gurugram (Sectors 76-95)",
    description: "Rapidly developing area with affordable to mid-range housing options and new commercial zones.",
    status: "Developing",
    investment: "High Potential",
  },
  {
    name: "Southern Peripheral Road (SPR)",
    description: "Strategic corridor connecting major employment hubs with residential and commercial developments.",
    status: "Growing",
    investment: "Very Good",
  },
  {
    name: "Sohna Road",
    description: "Extended development zone with upcoming metro line and mixed-use developments.",
    status: "Emerging",
    investment: "Good",
  },
]

export default function GurugramMasterPlanPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="w-full py-16 md:py-24 px-4 bg-gradient-to-br from-[#002366] to-[#003d99] text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium">
              Urban Development Guide
            </span>
            <h1 className="text-4xl md:text-5xl font-bold">Gurugram Master Plan 2031</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Comprehensive overview of Gurugram's development roadmap, infrastructure projects, and strategic investment zones for informed property decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-[#002366] hover:bg-blue-50">
                <a href="#zones">Explore Development Zones</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <a href="https://tcpharyana.gov.in/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Official TCP Haryana
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Highlights */}
        <section className="w-full py-16 px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold">Key Highlights of Master Plan 2031</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Gurugram Master Plan 2031 envisions a world-class city with sustainable development and improved quality of life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyHighlights.map((highlight, index) => (
                <Card key={index} className="border-border text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <highlight.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Development Zones */}
        <section id="zones" className="w-full py-16 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold">Strategic Development Zones</h2>
              <p className="text-muted-foreground">
                Understanding key development corridors can help you make informed investment decisions.
              </p>
            </div>

            <div className="space-y-4">
              {developmentZones.map((zone, index) => (
                <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg font-semibold">{zone.name}</h3>
                        <p className="text-sm text-muted-foreground">{zone.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 md:flex-col md:items-end shrink-0">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {zone.status}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Investment: {zone.investment}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Infrastructure */}
        <section className="w-full py-16 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold">Upcoming Infrastructure</h2>
              <p className="text-muted-foreground">
                Major infrastructure projects that will shape Gurugram's real estate landscape.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-border rounded-lg space-y-3">
                <h3 className="font-semibold">Metro Phase 2 Expansion</h3>
                <p className="text-sm text-muted-foreground">
                  Extended metro connectivity to sectors 56-67, Dwarka Expressway, and Sohna Road with 15+ new stations.
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg space-y-3">
                <h3 className="font-semibold">Global City Project</h3>
                <p className="text-sm text-muted-foreground">
                  1000+ acre integrated township on Dwarka Expressway with commercial, residential, and entertainment zones.
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg space-y-3">
                <h3 className="font-semibold">Rapid Rail Transit System</h3>
                <p className="text-sm text-muted-foreground">
                  High-speed rail corridor connecting Delhi-Gurugram-Alwar for faster regional connectivity.
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg space-y-3">
                <h3 className="font-semibold">Smart City Initiative</h3>
                <p className="text-sm text-muted-foreground">
                  Digital infrastructure, smart traffic management, and integrated command center for urban services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-16 px-4 bg-gradient-to-br from-[#002366] to-[#003d99] text-white">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Invest in Gurugram?</h2>
            <p className="text-blue-100">
              Our experts can help you identify the best investment opportunities based on the Master Plan development zones.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-[#002366] hover:bg-blue-50">
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/contact">Get Expert Advice</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
