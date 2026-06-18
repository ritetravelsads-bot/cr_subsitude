import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceEnquiryForm from "@/components/services/service-enquiry-form"
import {
  Search,
  CheckCircle2,
  ArrowLeft,
  TrendingUp,
  Shield,
  Users,
  Target,
  BarChart3,
  Handshake,
  Clock
} from "lucide-react"

export const metadata: Metadata = {
  title: "Property Advisory Services | Expert Real Estate Guidance | CountryRoof",
  description:
    "Get expert property advisory services for buying, selling, and investing in real estate. Personalized recommendations, market analysis, and end-to-end transaction support.",
  openGraph: {
    title: "Property Advisory Services | CountryRoof",
    description: "Expert guidance for all your real estate decisions in Gurugram.",
    url: "https://countryroof.in/services/advisory",
  },
}

const features = [
  {
    icon: Target,
    title: "Personalized Recommendations",
    description: "Properties curated based on your specific requirements, budget, and lifestyle preferences."
  },
  {
    icon: BarChart3,
    title: "Market Analysis",
    description: "In-depth market research and price trends to help you make informed decisions."
  },
  {
    icon: Handshake,
    title: "Price Negotiation",
    description: "Expert negotiation support to ensure you get the best possible deal."
  },
  {
    icon: Shield,
    title: "Due Diligence",
    description: "Comprehensive property verification and legal checks before purchase."
  },
  {
    icon: Clock,
    title: "End-to-End Support",
    description: "From property search to registration, we handle everything for you."
  },
  {
    icon: Users,
    title: "Dedicated Advisor",
    description: "A personal relationship manager assigned to your case throughout."
  },
]

const benefits = [
  "Save time with pre-screened, verified properties",
  "Access to exclusive off-market deals",
  "Transparent pricing with no hidden costs",
  "Post-purchase support and guidance",
  "Market insights from 15+ years of experience",
  "Network of trusted developers and sellers",
]

const process = [
  {
    step: "01",
    title: "Initial Consultation",
    description: "Share your requirements, budget, preferred locations, and timeline with our expert advisors."
  },
  {
    step: "02",
    title: "Property Shortlisting",
    description: "We curate a list of properties matching your criteria from our verified database."
  },
  {
    step: "03",
    title: "Site Visits",
    description: "Accompanied visits to shortlisted properties with detailed analysis of each."
  },
  {
    step: "04",
    title: "Negotiation & Closure",
    description: "Expert negotiation, documentation, and seamless transaction completion."
  },
]

export default function PropertyAdvisoryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-[#002366] via-[#003080] to-[#001a4d] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Search className="w-4 h-4" />
                  Expert Advisory
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Property Advisory Services
                </h1>
                <p className="text-lg text-blue-100">
                  Expert guidance for buying, selling, and investing in real estate. Our experienced advisors help you navigate the complex property market with confidence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>500+ Successful Transactions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>15+ Years Experience</span>
                  </div>
                </div>
              </div>

              {/* Enquiry Form Card */}
              <div className="bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl font-semibold mb-2">Get Free Property Consultation</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill the form below and our advisor will contact you within 24 hours.
                </p>
                <ServiceEnquiryForm serviceName="Property Advisory" serviceId="advisory" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">What We Offer</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive property advisory services designed to make your real estate journey seamless and successful.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Advisory Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A structured approach to ensure you find the perfect property with complete peace of mind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-card border border-border rounded-xl p-6 h-full">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Why Choose Our Advisory Services?
                </h2>
                <p className="text-muted-foreground">
                  Our property advisory services are designed to save you time, money, and stress while ensuring you make the best investment decision.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg">
                  <Link href="/contact">Schedule Free Consultation</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">98%</div>
                      <div className="text-sm text-muted-foreground">Client Satisfaction Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">5000+</div>
                      <div className="text-sm text-muted-foreground">Happy Clients Served</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">100%</div>
                      <div className="text-sm text-muted-foreground">Verified Properties</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-muted-foreground">
              Connect with our expert advisors today for personalized property recommendations and guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">Get Started</Link>
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
