import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceEnquiryForm from "@/components/services/service-enquiry-form"
import {
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Store,
  Warehouse,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Shield
} from "lucide-react"

export const metadata: Metadata = {
  title: "Commercial Real Estate Services | Office & Retail Space | CountryRoof",
  description:
    "Expert commercial real estate services for office spaces, retail shops, warehouses, and co-working spaces in Gurugram. Find the perfect commercial property for your business.",
  openGraph: {
    title: "Commercial Real Estate Services | CountryRoof",
    description: "Complete commercial property solutions for businesses in Gurugram.",
    url: "https://countryroof.in/services/commercial",
  },
}

const propertyTypes = [
  {
    icon: Building2,
    title: "Office Spaces",
    description: "Premium office spaces in top commercial hubs including Cyber City, Golf Course Road, and Sohna Road.",
    features: ["Grade A buildings", "24/7 access", "Modern amenities", "Flexible terms"]
  },
  {
    icon: Store,
    title: "Retail Spaces",
    description: "High-footfall retail locations in malls, high streets, and standalone properties for maximum visibility.",
    features: ["Prime locations", "High footfall", "Branding options", "Parking facilities"]
  },
  {
    icon: Warehouse,
    title: "Warehouse & Industrial",
    description: "Logistics and warehouse spaces in strategic locations with excellent connectivity.",
    features: ["Large floor plates", "Loading docks", "Power backup", "Security systems"]
  },
  {
    icon: Users,
    title: "Co-Working Spaces",
    description: "Flexible workspace solutions from hot desks to dedicated offices for teams of all sizes.",
    features: ["Fully furnished", "Meeting rooms", "Networking events", "Scalable options"]
  },
]

const locations = [
  { name: "Cyber City", type: "Premium Office Hub", availability: "15+ options" },
  { name: "Golf Course Road", type: "Corporate Corridor", availability: "20+ options" },
  { name: "Sohna Road", type: "Emerging Business Hub", availability: "30+ options" },
  { name: "MG Road", type: "Retail & Commercial", availability: "25+ options" },
  { name: "Udyog Vihar", type: "Industrial Zone", availability: "40+ options" },
  { name: "Sector 29", type: "Retail & F&B", availability: "10+ options" },
]

const benefits = [
  "Access to 500+ verified commercial listings",
  "Direct relationships with top developers",
  "Negotiation support for best lease terms",
  "Legal due diligence included",
  "Interior fit-out assistance available",
  "Post-lease property management support",
]

const process = [
  {
    step: "01",
    title: "Requirement Analysis",
    description: "We understand your business needs, space requirements, budget, and preferred locations."
  },
  {
    step: "02",
    title: "Property Shortlisting",
    description: "Our team curates a list of commercial spaces matching your exact criteria."
  },
  {
    step: "03",
    title: "Site Visits",
    description: "Accompanied visits with detailed analysis of each property's pros and cons."
  },
  {
    step: "04",
    title: "Negotiation & Lease",
    description: "Expert negotiation for best terms followed by complete documentation support."
  },
]

export default function CommercialRealEstatePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-cyan-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Briefcase className="w-4 h-4" />
                  Business Solutions
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Commercial Real Estate
                </h1>
                <p className="text-lg text-cyan-100">
                  Expert commercial property services for all your business needs. From premium office spaces to retail outlets and warehouses, we help you find the perfect location.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                    <span>500+ Commercial Listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                    <span>All Major Business Hubs</span>
                  </div>
                </div>
              </div>

              <div className="bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl font-semibold mb-2">Find Commercial Space</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Tell us your requirements and get personalized recommendations.
                </p>
                <ServiceEnquiryForm serviceName="Commercial Real Estate" serviceId="commercial" />
              </div>
            </div>
          </div>
        </section>

        {/* Property Types */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Commercial Property Types</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer comprehensive solutions across all commercial real estate segments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {propertyTypes.map((type, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <type.icon className="w-7 h-7 text-cyan-600" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-semibold text-foreground">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {type.features.map((feature, fidx) => (
                          <span key={fidx} className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Prime Commercial Locations</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Access premium commercial spaces in Gurugram&apos;s top business districts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((location, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.type}</p>
                      <p className="text-sm text-cyan-600 font-medium mt-1">{location.availability}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A streamlined approach to finding the perfect commercial space for your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Why Choose Us for Commercial Property?
                </h2>
                <p className="text-muted-foreground">
                  Our dedicated commercial real estate team brings years of experience and deep market knowledge to help you make the right business decision.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                  <Link href="/contact">Get Commercial Property Advice</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 rounded-2xl p-8 border border-cyan-500/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">500+</div>
                      <div className="text-sm text-muted-foreground">Commercial Listings</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">200+</div>
                      <div className="text-sm text-muted-foreground">Successful Transactions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">15+</div>
                      <div className="text-sm text-muted-foreground">Years of Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Looking for Commercial Space?
            </h2>
            <p className="text-muted-foreground">
              Let our commercial real estate experts help you find the perfect space for your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-cyan-600 hover:bg-cyan-700">
                <Link href="/contact">Get Expert Assistance</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/properties?type=commercial">Browse Commercial Properties</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
