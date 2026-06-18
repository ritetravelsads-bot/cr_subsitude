import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceEnquiryForm from "@/components/services/service-enquiry-form"
import {
  FileCheck,
  CheckCircle2,
  ArrowLeft,
  Shield,
  FileText,
  Scale,
  Search,
  Building2,
  AlertTriangle
} from "lucide-react"

export const metadata: Metadata = {
  title: "Legal Assistance | Property Legal Services | CountryRoof",
  description:
    "Comprehensive legal assistance for property transactions. Document verification, title clearance, RERA compliance, and agreement drafting services.",
  openGraph: {
    title: "Legal Assistance | CountryRoof",
    description: "Complete legal support for hassle-free property transactions.",
    url: "https://countryroof.in/services/legal",
  },
}

const services = [
  {
    icon: Search,
    title: "Document Verification",
    description: "Thorough verification of all property documents including sale deeds, NOCs, and approvals."
  },
  {
    icon: Shield,
    title: "Title Clearance",
    description: "Complete title search and clearance to ensure clear ownership without disputes."
  },
  {
    icon: FileText,
    title: "Agreement Drafting",
    description: "Professional drafting and review of sale agreements, MOUs, and lease deeds."
  },
  {
    icon: Building2,
    title: "RERA Compliance",
    description: "Verification of RERA registration and compliance for all new projects."
  },
  {
    icon: Scale,
    title: "Due Diligence",
    description: "Comprehensive due diligence covering legal, financial, and technical aspects."
  },
  {
    icon: AlertTriangle,
    title: "Litigation Support",
    description: "Legal assistance in property-related disputes and litigation matters."
  },
]

const documents = [
  "Sale Deed / Conveyance Deed",
  "Khata Certificate",
  "Encumbrance Certificate",
  "Property Tax Receipts",
  "Building Plan Approval",
  "Completion Certificate",
  "Occupancy Certificate",
  "NOCs from Relevant Authorities",
  "Power of Attorney (if applicable)",
  "RERA Registration Certificate",
]

const process = [
  {
    step: "01",
    title: "Document Collection",
    description: "We collect all relevant property documents from the seller or developer."
  },
  {
    step: "02",
    title: "Verification",
    description: "Our legal team thoroughly verifies each document for authenticity and compliance."
  },
  {
    step: "03",
    title: "Title Search",
    description: "Complete search of property records to establish clear title chain."
  },
  {
    step: "04",
    title: "Legal Report",
    description: "Comprehensive legal opinion report with recommendations for safe purchase."
  },
]

export default function LegalAssistancePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 px-4 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-amber-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  <FileCheck className="w-4 h-4" />
                  Legal Protection
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Legal Assistance
                </h1>
                <p className="text-lg text-amber-100">
                  Comprehensive legal support for property transactions. Our expert legal team ensures your investment is protected with thorough due diligence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-300" />
                    <span>1000+ Properties Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-300" />
                    <span>Expert Legal Team</span>
                  </div>
                </div>
              </div>

              <div className="bg-white text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl font-semibold mb-2">Request Legal Assistance</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Get professional legal support for your property transaction.
                </p>
                <ServiceEnquiryForm serviceName="Legal Assistance" serviceId="legal" />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Legal Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complete legal support to protect your property investment from potential risks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documents Checklist */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted/30 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Documents We Verify
                </h2>
                <p className="text-muted-foreground">
                  Our comprehensive verification process covers all essential property documents to ensure a safe and legal transaction.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-card border border-border rounded-lg p-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                      <span className="text-sm text-foreground">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Our Verification Process</h3>
                <div className="space-y-4">
                  {process.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="w-full py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-2xl p-8 md:p-12 border border-amber-500/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    Why Legal Due Diligence Matters?
                  </h2>
                  <p className="text-muted-foreground">
                    Property transactions involve significant financial commitments. Proper legal verification protects you from:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Title disputes and ownership conflicts",
                      "Fraudulent sellers and fake documents",
                      "Encumbrances and pending litigation",
                      "Non-compliance with building regulations",
                      "RERA violations and penalties",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-amber-600">100%</div>
                  <div className="text-xl font-semibold text-foreground">Legal Clarity Guaranteed</div>
                  <p className="text-muted-foreground">
                    Every property we verify comes with a comprehensive legal report and our assurance of clear title.
                  </p>
                  <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                    <Link href="/contact">Get Legal Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Need Legal Assistance for Property Purchase?
            </h2>
            <p className="text-muted-foreground">
              Our expert legal team is ready to help you with document verification and due diligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-amber-600 hover:bg-amber-700">
                <Link href="/contact">Request Legal Support</Link>
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
