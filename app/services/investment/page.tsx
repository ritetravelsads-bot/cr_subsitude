import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceEnquiryForm from "@/components/services/service-enquiry-form"
import {
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  BarChart3,
  PieChart,
  Target,
  Wallet,
  Building2,
  LineChart,
  Shield
} from "lucide-react"

export const metadata: Metadata = {
  title: "Investment Consulting | Real Estate Investment Advisory | CountryRoof",
  description:
    "Strategic real estate investment consulting services. Get expert ROI analysis, portfolio diversification strategies, and pre-launch project opportunities.",
  openGraph: {
    title: "Investment Consulting | CountryRoof",
    description: "Maximize your real estate investment returns with expert guidance.",
    url: "https://countryroof.in/services/investment",
  },
}

const features = [
  {
    icon: BarChart3,
    title: "ROI Analysis",
    description: "Detailed return on investment projections for each property opportunity."
  },
  {
    icon: PieChart,
    title: "Portfolio Diversification",
    description: "Strategic advice to spread risk across residential, commercial, and land investments."
  },
  {
    icon: Target,
    title: "Pre-Launch Access",
    description: "Early access to new project launches with best pricing and unit selection."
  },
  {
    icon: Building2,
    title: "Commercial Guidance",
    description: "Expert advice on commercial vs residential investment decisions."
  },
  {
    icon: LineChart,
    title: "Market Trends",
    description: "In-depth market analysis and future growth predictions for informed decisions."
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Comprehensive risk evaluation for each investment opportunity."
  },
]

const investmentTypes = [
  {
    title: "Residential Investment",
    description: "Apartments, villas, and independent houses for rental income or appreciation.",
    returns: "8-12% Annual Returns",
    minInvestment: "From ₹50 Lakhs"
  },
  {
    title: "Commercial Investment",
    description: "Office spaces, retail shops, and warehouses for higher rental yields.",
    returns: "10-15% Annual Returns",
    minInvestment: "From ₹1 Crore"
  },
  {
    title: "Pre-Launch Projects",
    description: "Early bird investments in upcoming projects with maximum appreciation potential.",
    returns: "15-25% Appreciation",
    minInvestment: "From ₹40 Lakhs"
  },
  {
    title: "Land Investment",
    description: "Strategic land parcels in growth corridors for long-term wealth creation.",
    returns: "20-30% Appreciation",
    minInvestment: "From ₹25 Lakhs"
  },
]

const benefits = [
  "Data-driven investment recommendations",
  "Access to exclusive pre-launch deals",
  "Complete due diligence on all opportunities",
  "Rental management services available",
  "Exit strategy planning and support",
  "Regular portfolio performance reviews",
]

export default function InvestmentConsultingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Smart Investing
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Investment Consulting
                </h1>
                <p className="text-lg text-emerald-100">
                  Strategic advice for maximizing returns on property investments. Our data-driven approach helps you build wealth through smart real estate decisions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>₹500+ Crore Investments Managed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>Average 18% Returns</span>
                  </div>
                </div>
              </div>

              <div className="bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl font-semibold mb-2">Get Investment Consultation</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Share your investment goals and our experts will create a personalized strategy.
                </p>
                <ServiceEnquiryForm serviceName="Investment Consulting" serviceId="investment" />
              </div>
            </div>
          </div>
        </section>

        {/* Investment Types */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Investment Opportunities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose from various investment options based on your goals, budget, and risk appetite.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {investmentTypes.map((type, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{type.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="text-sm text-muted-foreground">Expected Returns</div>
                      <div className="font-semibold text-emerald-600">{type.returns}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Min. Investment</div>
                      <div className="font-semibold text-foreground">{type.minInvestment}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Consulting Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive investment advisory services to help you make informed decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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
                  Why Invest With Us?
                </h2>
                <p className="text-muted-foreground">
                  Our investment consulting services are backed by deep market knowledge, extensive research, and a track record of successful investments.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/contact">Start Investing Today</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 rounded-2xl p-8 border border-emerald-500/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">₹500 Cr+</div>
                      <div className="text-sm text-muted-foreground">Investments Managed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">18%</div>
                      <div className="text-sm text-muted-foreground">Average Annual Returns</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">200+</div>
                      <div className="text-sm text-muted-foreground">Projects Delivered</div>
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
              Ready to Grow Your Wealth?
            </h2>
            <p className="text-muted-foreground">
              Let our investment experts help you build a profitable real estate portfolio.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700">
                <Link href="/contact">Get Investment Advice</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/properties">View Opportunities</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
