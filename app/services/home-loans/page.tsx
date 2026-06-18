import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceEnquiryForm from "@/components/services/service-enquiry-form"
import {
  Home,
  CheckCircle2,
  ArrowLeft,
  Calculator,
  Percent,
  FileText,
  Clock,
  Building,
  Wallet
} from "lucide-react"

export const metadata: Metadata = {
  title: "Home Loan Assistance | Best Home Loan Rates | CountryRoof",
  description:
    "Get the best home loan rates with our loan assistance services. Loan eligibility assessment, documentation support, and quick approval from multiple bank partners.",
  openGraph: {
    title: "Home Loan Assistance | CountryRoof",
    description: "Simplified home loan processing with best interest rates.",
    url: "https://countryroof.in/services/home-loans",
  },
}

const features = [
  {
    icon: Calculator,
    title: "Eligibility Assessment",
    description: "Free assessment of your loan eligibility based on income, credit score, and other factors."
  },
  {
    icon: Percent,
    title: "Best Rate Comparison",
    description: "Compare interest rates from 20+ banks and NBFCs to get the lowest rates."
  },
  {
    icon: FileText,
    title: "Documentation Support",
    description: "Complete assistance with loan application forms and document preparation."
  },
  {
    icon: Clock,
    title: "Quick Approval",
    description: "Fast-track loan processing with approvals in as little as 7 working days."
  },
  {
    icon: Building,
    title: "All Property Types",
    description: "Loans for under-construction, ready-to-move, and resale properties."
  },
  {
    icon: Wallet,
    title: "Top-Up Loans",
    description: "Assistance with home improvement and top-up loans on existing properties."
  },
]

const bankPartners = [
  { name: "SBI", rate: "8.40%" },
  { name: "HDFC", rate: "8.50%" },
  { name: "ICICI Bank", rate: "8.55%" },
  { name: "Axis Bank", rate: "8.60%" },
  { name: "Kotak", rate: "8.65%" },
  { name: "LIC HFL", rate: "8.50%" },
  { name: "PNB Housing", rate: "8.70%" },
  { name: "Bajaj Housing", rate: "8.55%" },
]

const eligibilityCriteria = [
  { label: "Age", value: "21 - 65 years" },
  { label: "Min. Income (Salaried)", value: "₹25,000/month" },
  { label: "Min. Income (Self-Employed)", value: "₹3 Lakhs/year" },
  { label: "Employment", value: "Min. 2 years" },
  { label: "Credit Score", value: "650+" },
  { label: "Loan Amount", value: "Up to ₹5 Crores" },
]

const process = [
  {
    step: "01",
    title: "Free Consultation",
    description: "Share your requirements and get personalized loan advice."
  },
  {
    step: "02",
    title: "Eligibility Check",
    description: "We assess your eligibility and shortlist best bank options."
  },
  {
    step: "03",
    title: "Documentation",
    description: "Our team helps prepare and submit all required documents."
  },
  {
    step: "04",
    title: "Loan Approval",
    description: "Fast-track processing and disbursement of your home loan."
  },
]

export default function HomeLoanAssistancePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-rose-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Home className="w-4 h-4" />
                  Easy Home Loans
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Home Loan Assistance
                </h1>
                <p className="text-lg text-rose-100">
                  Get the best home loan rates from 20+ banks and NBFCs. Our experts handle everything from eligibility assessment to loan disbursement.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-rose-300" />
                    <span>Rates from 8.40%*</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-rose-300" />
                    <span>20+ Bank Partners</span>
                  </div>
                </div>
              </div>

              <div className="bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl font-semibold mb-2">Check Your Eligibility</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Get a free home loan eligibility assessment and rate comparison.
                </p>
                <ServiceEnquiryForm serviceName="Home Loan Assistance" serviceId="home-loans" />
              </div>
            </div>
          </div>
        </section>

        {/* Bank Partners */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Bank Partners</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We work with leading banks and NBFCs to offer you the best home loan rates.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bankPartners.map((bank, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="font-semibold text-foreground">{bank.name}</div>
                  <div className="text-sm text-rose-600 font-medium mt-1">From {bank.rate}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              *Interest rates are indicative and subject to change. Actual rates depend on your profile and loan amount.
            </p>
          </div>
        </section>

        {/* Features & Eligibility */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Features */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Loan Services</h2>
                <div className="space-y-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex gap-4 bg-card border border-border rounded-xl p-4">
                      <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <feature.icon className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Eligibility Criteria</h2>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {eligibilityCriteria.map((item, idx) => (
                        <tr key={idx} className="border-b border-border last:border-b-0">
                          <td className="p-4 text-muted-foreground">{item.label}</td>
                          <td className="p-4 font-semibold text-foreground text-right">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground">
                  Don&apos;t meet all criteria? Contact us anyway - we often find solutions for unique cases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Simple 4-Step Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get your home loan approved in just 4 easy steps with our expert assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
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
        <section className="w-full py-16 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Ready to Apply for Home Loan?
            </h2>
            <p className="text-muted-foreground">
              Get a free eligibility assessment and compare rates from 20+ banks instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-rose-600 hover:bg-rose-700">
                <Link href="/contact">Check Eligibility Free</Link>
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
