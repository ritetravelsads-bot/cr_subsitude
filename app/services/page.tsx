import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Search,
  FileCheck,
  Users,
  TrendingUp,
  Shield,
  Home,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Phone,
  Clock,
  Award
} from "lucide-react"

export const metadata: Metadata = {
  title: "Real Estate Services in Gurugram | CountryRoof",
  description:
    "Comprehensive real estate services including property advisory, investment consulting, legal assistance, home loans, NRI services, and property management in Gurugram.",
  alternates: {
    canonical: "https://countryroof.in/services",
  },
  openGraph: {
    title: "Real Estate Services | CountryRoof",
    description: "Expert real estate advisory and consulting services in Gurugram.",
    url: "https://countryroof.in/services",
  },
}

const services = [
  {
    id: "advisory",
    title: "Property Advisory",
    description: "Expert guidance for buying, selling, and investing in real estate with personalized recommendations.",
    icon: Search,
    href: "/services/advisory",
    features: [
      "Personalized property recommendations",
      "Market analysis and insights",
      "Price negotiation support",
      "End-to-end transaction assistance",
    ],
    color: "bg-blue-500",
  },
  {
    id: "investment",
    title: "Investment Consulting",
    description: "Strategic advice for maximizing returns on property investments with data-driven insights.",
    icon: TrendingUp,
    href: "/services/investment",
    features: [
      "ROI analysis and projections",
      "Portfolio diversification strategies",
      "Pre-launch opportunities",
      "Commercial vs residential guidance",
    ],
    color: "bg-emerald-500",
  },
  {
    id: "legal",
    title: "Legal Assistance",
    description: "Comprehensive legal support for property transactions ensuring complete peace of mind.",
    icon: FileCheck,
    href: "/services/legal",
    features: [
      "Document verification",
      "Title clearance checks",
      "Agreement drafting and review",
      "RERA compliance verification",
    ],
    color: "bg-amber-500",
  },
  {
    id: "home-loans",
    title: "Home Loan Assistance",
    description: "Simplified home loan processing with multiple bank partners for best rates.",
    icon: Home,
    href: "/services/home-loans",
    features: [
      "Loan eligibility assessment",
      "Best interest rate comparison",
      "Documentation support",
      "Quick loan approval process",
    ],
    color: "bg-rose-500",
  },
  {
    id: "nri",
    title: "NRI Services",
    description: "Dedicated support for Non-Resident Indians investing in Indian real estate.",
    icon: Users,
    href: "/services/nri",
    features: [
      "Virtual property tours",
      "Power of Attorney assistance",
      "Regulatory compliance guidance",
      "Property management services",
    ],
    color: "bg-violet-500",
  },
  {
    id: "commercial",
    title: "Commercial Real Estate",
    description: "Expert services for commercial property requirements across all segments.",
    icon: Briefcase,
    href: "/services/commercial",
    features: [
      "Office space solutions",
      "Retail space leasing",
      "Warehouse and industrial",
      "Co-working space options",
    ],
    color: "bg-cyan-500",
  },
  {
    id: "builder",
    title: "Builder Partnerships",
    description: "Direct partnerships with top developers for exclusive deals and early access.",
    icon: Building2,
    href: "/services/builder-partnerships",
    features: [
      "Exclusive project launches",
      "Direct builder pricing",
      "Early bird offers access",
      "Channel partner benefits",
    ],
    color: "bg-orange-500",
  },
  {
    id: "after-sales",
    title: "After-Sales Support",
    description: "Continued assistance even after property purchase for complete satisfaction.",
    icon: Shield,
    href: "/services/after-sales",
    features: [
      "Registration and possession",
      "Interior design referrals",
      "Rental management",
      "Resale assistance",
    ],
    color: "bg-teal-500",
  },
]

const stats = [
  { value: "10,000+", label: "Happy Clients" },
  { value: "500+", label: "Projects Delivered" },
  { value: "15+", label: "Years Experience" },
  { value: "50+", label: "Expert Advisors" },
]

const processSteps = [
  {
    step: "01",
    title: "Free Consultation",
    desc: "Share your requirements and preferences with our expert team",
    icon: Phone
  },
  {
    step: "02",
    title: "Personalized Search",
    desc: "We curate properties matching your exact criteria",
    icon: Search
  },
  {
    step: "03",
    title: "Site Visits",
    desc: "Accompany you for property inspections and due diligence",
    icon: Building2
  },
  {
    step: "04",
    title: "Transaction Support",
    desc: "Assist with negotiation, paperwork, and closing",
    icon: FileCheck
  },
]

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-28 px-4 bg-gradient-to-br from-[#002366] via-[#003080] to-[#001a4d] text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                <Award className="w-4 h-4" />
                Trusted by 10,000+ Clients
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Comprehensive Real Estate Services
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto text-pretty">
                From property search to post-purchase support, we provide end-to-end solutions tailored to your unique real estate needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button asChild size="lg" className="bg-white text-[#002366] hover:bg-white/90 h-12 px-8 font-semibold">
                  <Link href="/contact">Get Free Consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
                  <Link href="tel:+919876543210">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/20">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose from our comprehensive range of real estate services designed to make your property journey seamless.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6 space-y-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <service.icon className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 pt-2">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-primary font-medium pt-2 group-hover:gap-3 transition-all">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">How We Work</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our streamlined 4-step process ensures a smooth and hassle-free property buying experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Connector Line */}
                  {idx < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                  )}

                  <div className="relative bg-card border border-border rounded-xl p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
                    {/* Step Number */}
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-lg relative z-10">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Why Choose CountryRoof?
                </h2>
                <p className="text-muted-foreground text-lg">
                  With over 15 years of experience in Gurugram&apos;s real estate market, we bring unmatched expertise and dedication to every client relationship.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Award, title: "Expert Team", desc: "50+ experienced real estate professionals" },
                    { icon: Clock, title: "24/7 Support", desc: "Round-the-clock assistance for all queries" },
                    { icon: Shield, title: "Verified Properties", desc: "100% legally verified property listings" },
                    { icon: TrendingUp, title: "Best Deals", desc: "Exclusive deals and competitive pricing" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-[#002366] to-[#003080] rounded-2xl p-8 text-white space-y-6">
                <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
                <p className="text-blue-100">
                  Connect with our expert team for a free consultation and personalized property recommendations.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-200">Call Us</div>
                      <a href="tel:+919876543210" className="font-semibold hover:underline">+91 98765 43210</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-200">Working Hours</div>
                      <div className="font-semibold">Mon - Sat: 9:00 AM - 7:00 PM</div>
                    </div>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full bg-white text-[#002366] hover:bg-white/90 h-12 font-semibold">
                  <Link href="/contact">Schedule Free Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-16 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Have Questions About Our Services?
            </h2>
            <p className="text-muted-foreground">
              Our team is here to help you navigate your real estate journey. Get in touch for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
