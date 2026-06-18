import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script" // <-- Imported next/script
import "./globals.css"
import "@/styles/blog-content.css"
import FrontendLayout from "@/components/layout/frontend-layout"
import CustomHeadTags from "@/components/layout/custom-head-tags"
import HeadTagsInjector from "@/components/layout/head-tags-injector"

// Disable caching for this layout to ensure custom head tags are always fresh
export const revalidate = 0

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://countryroof.in'),
  alternates: {
    canonical: 'https://countryroof.in',
  },
  title: "Luxury Properties in Gurgaon | RERA Verified | CountryRoof",
  description: "Explore 630+ RERA-verified luxury apartments, villas & plots in Gurgaon. Trusted by HNIs & NRIs. Expert advisory on Golf Course Road, DXP & SPR. Zero brokerage.",
  keywords: [
    "Gurgaon Property",
    "Real Estate Gurgaon",
    "Buy Property in Gurgaon",
    "Property for Sale in Gurgaon",
    "Commercial Property Gurgaon",
  ],
  authors: [{ name: "CountryRoof" }],
  verification: {
    google: "HMLmt_V-xGPk7KOvW60EO-cNggppOdM6OHT47vFLdQM",
  },
  icons: {
    icon: "/fav.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://countryroof.in",
    siteName: "CountryRoof",
    title: "Luxury Properties in Gurgaon | RERA Verified | CountryRoof",
    description: "Find and list premium properties on CountryRoof marketplace.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CountryRoof Property Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CountryRoof | Premium Property Marketplace",
    description: "Discover properties, connect with agents, secure transactions.",
    images: ["/og-image.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* CRITICAL: Preload LCP images FIRST - before any other resources */}
        {/* These must be at the very top of <head> for maximum priority */}
        {/* Mobile LCP image preload */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fbanners%2Fhome-mob-banner-1.webp&w=640&q=75"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        {/* Desktop LCP image preload */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fhome-banner-1.webp&w=1200&q=80"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "@id": "https://countryroof.in/#organization",
              name: "CountryRoof",
              alternateName: "Country Roof Real Estate",
              description: "Premium property marketplace connecting buyers, sellers, and agents in Gurgaon and Delhi NCR",
              url: "https://countryroof.in",
              logo: {
                "@type": "ImageObject",
                url: "https://countryroof.in/logo.png",
                width: 512,
                height: 512,
              },
              image: "https://countryroof.in/og-image.png",
              telephone: "+91-1244765940",
              priceRange: "$$-$$$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "5th Floor, JMD Megapolis, 555-A, Badshahpur Sohna Rd, near Subhash Chowk, Sector 48",
                addressLocality: "Gurugram",
                addressRegion: "Haryana",
                postalCode: "122001",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 28.4089,
                longitude: 77.0424,
              },
              areaServed: [
                {
                  "@type": "City",
                  name: "Gurugram",
                  containedInPlace: {
                    "@type": "State",
                    name: "Haryana"
                  }
                },
                {
                  "@type": "Place",
                  name: "Delhi NCR"
                }
              ],
              sameAs: [
                "https://www.facebook.com/countryroof",
                "https://www.instagram.com/countryroof",
                "https://www.linkedin.com/company/countryroof"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-1244765940",
                contactType: "Customer Service",
                availableLanguage: ["en", "hi"],
                areaServed: "IN",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "19:00",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://countryroof.in/#website",
              url: "https://countryroof.in",
              name: "CountryRoof",
              description: "Find the best property in Gurgaon including flats, plots, villas and commercial spaces",
              publisher: {
                "@id": "https://countryroof.in/#organization"
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://countryroof.in/properties?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
            }),
          }}
        />
        <CustomHeadTags />
      </head>
      <body className={`${geist.className} antialiased`}>
        
        {/* --- Google Analytics Scripts Added Here --- */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=GT-TWTD7NL7`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'GT-TWTD7NL7');
              gtag('config', 'G-5DJ4YE3VTN');
            `,
          }}
        />
        {/* ------------------------------------------- */}

        <HeadTagsInjector />
        <FrontendLayout>
          {children}
        </FrontendLayout>
      </body>
    </html>
  )
}