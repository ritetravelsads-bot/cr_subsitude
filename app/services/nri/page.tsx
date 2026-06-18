import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceEnquiryForm from "@/components/services/service-enquiry-form"
import {
  Users,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Video,
  FileText,
  Shield,
  Home,
  Wallet
} from "lucide-react"

export const metadata: Metadata = {
  title: "NRI Services | Property Investment for NRIs | CountryRoof",
  description:
    "Comprehensive real estate services for Non-Resident Indians. Virtual property tours, POA assistance, regulatory compliance, and property management.",
  openGraph: {
    title: "NRI Services | CountryRoof",
    description: "Hassle-free property investment in India for NRIs.",
    url: "https://countryroof.in/services/nri",
  },
}

const features = [
  {
    icon: Video,
    title: "Virtual Property Tours",
    description: "Live video walkthroughs of properties at your convenient time, regardless of your location."
  },
  {
    icon: FileText,
    title: "Power of Attorney",
    description: "Complete assistance with POA documentation for property transactions in your absence."
  },
  {
    icon: Shield,
    title: "Regulatory Compliance",
    description: "Expert guidance on FEMA, RBI guidelines, and tax implications for NRI investments."
  },
  {
    icon: Home,
    title: "Property Management",
    description: "End-to-end property management services including tenant finding and rent collection."
  },
  {
    icon: Wallet,
    title: "NRI Home Loans",
    description: "Assistance with home loans from banks offering special NRI loan products."
  },
  {
    icon: Globe,
    title: "Remote Transactions",
    description: "Complete support for property transactions without requiring physical presence in India."
  },
]

const benefits = [
  "Dedicated relationship manager for personalized support",
  "Flexible communication across time zones",
  "Transparent pricing with no hidden charges",
  "Regular property and market updates",
  "Assistance with repatriation of sale proceeds",
  "Post-purchase property management available",
]

const countries = [
  "United States", "United Kingdom", "UAE", "Singapore",
  "Australia", "Canada", "Germany", "Saudi Arabia"
]

const process = [
  {
    step: "01",
    title: "Initial Consultation",
    description: "Video call to understand your requirements, budget, and investment goals."
  },
  {
    step: "02",
    title: "Property Shortlisting",
    description: "We share detailed property information with virtual tours for your review."
  },
  {
    step: "03",
    title: "Documentation",
    description: "POA preparation and all legal documentation handled remotely."
  },
  {
    step: "04",
    title: "Transaction Completion",
    description: "Seamless property registration and handover with complete support."
  },
]

export default function NRIServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-violet-900 via-violet-800 to-violet-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-violet-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Users className="w-4 h-4" />
                  NRI Support
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  NRI Services
                </h1>
                <p className="text-lg text-violet-100">
                  Dedicated support for Non-Resident Indians investing in Indian real estate. From virtual tours to property management, we handle everything remotely.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-violet-300" />
                    <span>2000+ NRI Clients Served</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-violet-300" />
                    <span>20+ Countries</span>
                  </div>
                </div>
              </div>

              <div className="bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl font-semibold mb-2">NRI Investment Enquiry</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Schedule a call with our NRI specialist at your convenient time.
                </p>
                <ServiceEnquiryForm serviceName="NRI Services" serviceId="nri" />
              </div>
            </div>
          </div>
        </section>

        {/* Countries We Serve */}
        <section className="w-full py-12 px-4 bg-violet-50 dark:bg-violet-950/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">Serving NRIs from</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {countries.map((country, idx) => (
                <div key={idx} className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium">
                  {country}
                </div>
              ))}
              <div className="px-4 py-2 bg-violet-600 text-white rounded-full text-sm font-medium">
                & Many More
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our NRI Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive support designed specifically for Non-Resident Indians investing in Indian real estate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works for NRIs</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A seamless process designed to help you invest in Indian property without stepping foot in India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-violet-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
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
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Why NRIs Choose Us?
                </h2>
                <p className="text-muted-foreground">
                  We understand the unique challenges NRIs face when investing in Indian real estate. Our specialized services make the process seamless and hassle-free.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-700">
                  <Link href="/contact">Schedule NRI Consultation</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-br from-violet-500/5 to-violet-500/10 rounded-2xl p-8 border border-violet-500/20">
                <h3 className="text-xl font-semibold text-foreground mb-6">Investment Guidelines for NRIs</h3>
                <div className="space-y-4">
                  {[
                    { q: "Can NRIs buy property in India?", a: "Yes, NRIs can buy residential and commercial properties (except agricultural land)." },
                    { q: "Is POA mandatory?", a: "POA is recommended but not mandatory. Many transactions can be done remotely." },
                    { q: "Which accounts to use?", a: "Payments must be made through NRE/NRO accounts or foreign remittance." },
                    { q: "Tax implications?", a: "TDS applies on property purchase. We provide complete tax guidance." },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-lg p-4">
                      <h4 className="font-medium text-foreground text-sm">{item.q}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Ready to Invest in Indian Real Estate?
            </h2>
            <p className="text-muted-foreground">
              Schedule a consultation with our NRI specialist at your convenient time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-violet-600 hover:bg-violet-700">
                <Link href="/contact">Schedule Call</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/properties">View Properties</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
