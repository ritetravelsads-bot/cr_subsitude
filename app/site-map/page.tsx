import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Home, Building2, MapPin, FileText, Users, Phone, Info, Newspaper, Scale } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Site Map | CountryRoof - Navigate Our Website",
  description: "Complete site map of CountryRoof website. Find all pages, property listings, locations, and resources easily.",
  alternates: {
    canonical: "https://countryroof.in/site-map",
  },
}

const siteMapSections = [
  {
    title: "Main Pages",
    icon: Home,
    links: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "Get a Quote", href: "/quote" },
      { name: "Services", href: "/services" },
    ],
  },
  {
    title: "Properties",
    icon: Building2,
    links: [
      { name: "All Properties", href: "/properties" },
      { name: "Residential Properties", href: "/properties/residential" },
      { name: "Commercial Properties", href: "/commercial-properties" },
      { name: "Plots & Lands", href: "/plots-and-lands" },
      { name: "Luxury Apartments", href: "/luxury-apartments" },
      { name: "Furnished Flats", href: "/furnished-flats" },
      { name: "Ready to Move", href: "/ready-to-move" },
      { name: "New Launch", href: "/new-launch" },
      { name: "Upcoming Projects", href: "/upcoming" },
    ],
  },
  {
    title: "Locations",
    icon: MapPin,
    links: [
      { name: "Golf Course Road", href: "/golf-course-road" },
      { name: "Golf Course Extension Road", href: "/golf-course-extn-road" },
      { name: "Dwarka Expressway", href: "/dwarka-expressway" },
      { name: "Southern Peripheral Road", href: "/southern-peripheral-road" },
      { name: "Sohna", href: "/sohna" },
      { name: "New Gurgaon", href: "/new-gurgaon" },
      { name: "NH-48", href: "/nh-48" },
      { name: "Manesar", href: "/manesar" },
    ],
  },
  {
    title: "Resources",
    icon: Newspaper,
    links: [
      { name: "Blogs", href: "/blogs" },
      { name: "News", href: "/news" },
      { name: "Developers", href: "/developers" },
    ],
  },
  {
    title: "Legal",
    icon: Scale,
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
  },
]

export default function SiteMapPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#002366] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Site Map</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Site Map
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Navigate through all pages and sections of CountryRoof website easily.
            </p>
          </div>

          {/* Site Map Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteMapSections.map((section) => (
              <div
                key={section.title}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#002366]/10 rounded-lg">
                    <section.icon className="h-5 w-5 text-[#002366]" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#002366] transition-colors py-1"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
