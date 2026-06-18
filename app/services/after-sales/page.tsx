import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceEnquiryForm from "@/components/services/service-enquiry-form"
import {
  Shield,
  CheckCircle2,
  ArrowLeft,
  Key,
  Paintbrush,
  Users,
  TrendingUp,
  Home,
  Wrench,
  FileText,
  Clock
} from "lucide-react"

export const metadata: Metadata = {
  title: "After-Sales Support | Property Registration & Management | CountryRoof",
  description:
    "Comprehensive after-sales support including property registration, possession assistance, interior design referrals, rental management, and resale assistance.",
  openGraph: {
    title: "After-Sales Support | CountryRoof",
    description: "Complete post-purchase property support and management services.",
    url: "https://countryroof.in/services/after-sales",
  },
}

const services = [
  {
    icon: Key,
    title: "Registration & Possession",
    description: "Complete assistance with property registration, stamp duty payment, and possession handover process.",
    features: ["Document preparation", "Registry scheduling", "Possession checklist", "Defect identification"]
  },
  {
    icon: Paintbrush,
    title: "Interior Design",
    description: "Connect with vetted interior designers and contractors for home setup and customization.",
    features: ["Designer referrals", "Multiple quotes", "Project supervision", "Quality assurance"]
  },
  {
    icon: Users,
    title: "Rental Management",
    description: "End-to-end rental services including tenant finding, agreement drafting, and rent collection.",
    features: ["Tenant verification", "Rent collection", "Maintenance coordination", "Legal compliance"]
  },
  {
    icon: TrendingUp,
    title: "Resale Assistance",
    description: "Expert help when you decide to sell your property with valuation, marketing, and negotiation support.",
    features: ["Market valuation", "Property marketing", "Buyer negotiations", "Transaction support"]
  },
  {
    icon: Wrench,
    title: "Maintenance Services",
    description: "Regular property maintenance and repair services to keep your property in top condition.",
    features: ["Annual maintenance", "Emergency repairs", "Vendor management", "Cost optimization"]
  },
  {
    icon: FileText,
    title: "Documentation Support",
    description: "Help with property-related documentation including tax filing, society transfers, and more.",
    features: ["Property tax filing", "Society transfer", "Mutation assistance", "NOC procurement"]
  },
]

const rentalPackages = [
  {
    name: "Basic",
    price: "1 Month Rent",
    description: "One-time tenant finding service",
    features: [
      "Tenant sourcing",
      "Background verification",
      "Agreement drafting",
      "Key handover",
    ],
    highlight: false
  },
  {
    name: "Premium",
    price: "5% of Annual Rent",
    description: "Complete rental management",
    features: [
      "Everything in Basic",
      "Rent collection",
      "Maintenance coordination",
      "Tenant communication",
      "Annual renewals",
      "Legal support"
    ],
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    description: "For multiple properties",
    features: [
      "Everything in Premium",
      "Dedicated manager",
      "Portfolio reporting",
      "Priority support",
      "Bulk discounts"
    ],
    highlight: false
  },
]

const benefits = [
  "Single point of contact for all post-purchase needs",
  "Vetted and trusted service partners",
  "Transparent pricing with no hidden charges",
  "Regular property status updates",
  "24/7 emergency support for tenanted properties",
  "Annual property health check included",
]

const process = [
  {
    step: "01",
    title: "Registration Support",
    description: "We guide you through the registration process and ensure all paperwork is in order."
  },
  {
    step: "02",
    title: "Possession Handover",
    description: "Our team accompanies you during possession to identify any defects or issues."
  },
  {
    step: "03",
    title: "Setup Assistance",
    description: "Connect with interior designers and service providers for home setup."
  },
  {
    step: "04",
    title: "Ongoing Support",
    description: "Continued assistance with rental, resale, or any property-related needs."
  },
]

export default function AfterSalesSupportPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-teal-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  Complete Support
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  After-Sales Support
                </h1>
                <p className="text-lg text-teal-100">
                  Our relationship doesn&apos;t end at purchase. We provide comprehensive post-sale support to ensure your property journey is smooth and hassle-free.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-300" />
                    <span>5000+ Properties Managed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-300" />
                    <span>98% Client Satisfaction</span>
                  </div>
                </div>
              </div>

              <div className="bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl font-semibold mb-2">Get After-Sales Support</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Tell us what support you need and we&apos;ll get back to you promptly.
                </p>
                <ServiceEnquiryForm serviceName="After-Sales Support" serviceId="after-sales" />
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our After-Sales Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive support services to help you at every stage of property ownership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, fidx) => (
                      <span key={fidx} className="text-xs px-2 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rental Packages */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Rental Management Packages</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose a package that suits your rental property management needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rentalPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`bg-card border rounded-xl p-6 relative ${pkg.highlight
                      ? 'border-teal-500 shadow-lg'
                      : 'border-border'
                    }`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-foreground">{pkg.name}</h3>
                    <div className="text-2xl font-bold text-teal-600 mt-2">{pkg.price}</div>
                    <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full mt-6 ${pkg.highlight
                        ? 'bg-teal-600 hover:bg-teal-700'
                        : ''
                      }`}
                    variant={pkg.highlight ? 'default' : 'outline'}
                  >
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Post-Purchase Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We support you through every step after your property purchase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
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
                  Why Choose Our After-Sales Support?
                </h2>
                <p className="text-muted-foreground">
                  We believe our responsibility extends beyond the sale. Our after-sales support ensures you have a trusted partner for all your property needs.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/contact">Get Support Now</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-br from-teal-500/5 to-teal-500/10 rounded-2xl p-8 border border-teal-500/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center">
                      <Home className="w-8 h-8 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">5000+</div>
                      <div className="text-sm text-muted-foreground">Properties Managed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">98%</div>
                      <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">24/7</div>
                      <div className="text-sm text-muted-foreground">Emergency Support</div>
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
              Need Post-Purchase Assistance?
            </h2>
            <p className="text-muted-foreground">
              Whether it&apos;s registration help, rental management, or resale support - we&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-teal-600 hover:bg-teal-700">
                <Link href="/contact">Contact Support Team</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
