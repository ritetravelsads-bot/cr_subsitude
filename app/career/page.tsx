import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Briefcase, MapPin, Clock, Users, TrendingUp, Heart, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers | CountryRoof - Join Our Team",
  description: "Join CountryRoof and build your career in real estate. Explore exciting opportunities in sales, marketing, and property consulting in Gurugram.",
  openGraph: {
    title: "Careers at CountryRoof",
    description: "Build your career with Gurugram's leading real estate advisory firm.",
    url: "https://countryroof.in/career",
  },
}

const openPositions = [
  {
    title: "Real Estate Sales Consultant",
    department: "Sales",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "2-5 years",
    description: "Drive property sales and build client relationships in the luxury real estate segment.",
  },
  {
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "1-3 years",
    description: "Manage digital campaigns, SEO, and social media presence for property marketing.",
  },
  {
    title: "Property Research Analyst",
    department: "Research",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "1-2 years",
    description: "Analyze market trends, property valuations, and investment opportunities.",
  },
  {
    title: "Client Relationship Manager",
    department: "Customer Success",
    location: "Gurugram, Haryana",
    type: "Full-time",
    experience: "3-5 years",
    description: "Manage high-net-worth client relationships and ensure customer satisfaction.",
  },
]

const benefits = [
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description: "Clear career progression paths and regular performance reviews.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description: "Work with experienced professionals in a supportive environment.",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Comprehensive health insurance for you and your family.",
  },
  {
    icon: Briefcase,
    title: "Competitive Pay",
    description: "Industry-leading salaries with performance-based incentives.",
  },
]

export default function CareerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="w-full py-16 md:py-24 px-4 bg-gradient-to-br from-[#002366] to-[#003d99] text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">Join Our Team</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Build your career with Gurugram's leading real estate advisory firm.
              We're looking for passionate individuals who want to make a difference in the property industry.
            </p>
            <Button asChild size="lg" className="bg-white text-[#002366] hover:bg-blue-50">
              <a href="#openings">View Open Positions</a>
            </Button>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="w-full py-16 px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold">Why Join CountryRoof?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe in nurturing talent and providing the best environment for professional growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="openings" className="w-full py-16 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold">Open Positions</h2>
              <p className="text-muted-foreground">
                Explore current opportunities and find the role that matches your skills.
              </p>
            </div>

            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{position.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {position.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {position.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{position.description}</p>
                        <p className="text-xs text-muted-foreground">Experience: {position.experience}</p>
                      </div>
                      <Button asChild className="shrink-0">
                        <Link href={`/contact?subject=Application for ${position.title}`}>
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-16 px-4 border-t border-border">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Don't See a Perfect Match?</h2>
            <p className="text-muted-foreground">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact?subject=General Application">
                Submit Your Resume
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  )
}
