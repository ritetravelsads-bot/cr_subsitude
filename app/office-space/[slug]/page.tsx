import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MongoClient, ObjectId } from "mongodb"
import Script from "next/script"
import { OfficeSpaceDetailClient } from "@/components/property/office-space-detail-client"
import { formatPriceToIndian } from "@/lib/utils"

const mongoUrl = process.env.MONGODB_URI || ""
const baseUrl = "https://countryroof.in"

interface Property {
  _id: string
  slug: string
  property_name: string
  property_type?: string
  listing_type?: string
  short_description?: string
  long_description?: string
  about_project?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_title?: string
  og_description?: string
  main_banner?: string
  main_thumbnail?: string
  multiple_images?: string[]
  address?: string
  city?: string
  state?: string
  postal_code?: string
  lowest_price?: number
  max_price?: number
  area_sqft?: number
  amenities?: string[]
  office_space?: any
  commercial_lease?: any
  developer_id?: string
  developer_name?: string
  status?: string
  [key: string]: any
}

async function getOfficeSpace(slug: string): Promise<Property | null> {
  if (!mongoUrl) return null
  const client = new MongoClient(mongoUrl)
  try {
    await client.connect()
    const db = client.db("countryroof")
    const collection = db.collection("properties")
    
    // Office space property types
    const officeTypes = ['office', 'office_space', 'coworking', 'managed_office', 'private_office', 'sco']
    
    // Try to find by slug first
    let property = await collection.findOne({ 
      slug,
      property_type: { $in: officeTypes }
    })
    
    if (!property) {
      // Try case-insensitive search
      property = await collection.findOne({ 
        slug: { $regex: new RegExp(`^${slug}$`, 'i') },
        property_type: { $in: officeTypes }
      })
    }
    
    if (!property) {
      // Fallback: try by _id
      try {
        const objectId = new ObjectId(slug)
        property = await collection.findOne({ 
          _id: objectId,
          property_type: { $in: officeTypes }
        })
      } catch {
        // Invalid ObjectId format
      }
    }
    
    if (!property) return null
    
    return {
      ...property,
      _id: property._id?.toString(),
    } as Property
  } finally {
    await client.close()
  }
}

async function getDeveloper(developerId: string) {
  if (!mongoUrl || !developerId) return null
  const client = new MongoClient(mongoUrl)
  try {
    await client.connect()
    const db = client.db("countryroof")
    const collection = db.collection("developers")
    
    let developer = null
    try {
      const objectId = new ObjectId(developerId)
      developer = await collection.findOne({ _id: objectId })
    } catch {
      // Invalid ObjectId format
    }
    
    if (!developer) return null
    
    return {
      ...developer,
      _id: developer._id?.toString(),
    }
  } finally {
    await client.close()
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const property = await getOfficeSpace(slug)
  
  if (!property) {
    return { 
      title: "Office Space Not Found | CountryRoof",
      robots: { index: false, follow: false }
    }
  }

  const spaceType = property.office_space?.space_type?.replace(/_/g, ' ') || 'Office Space'
  const title = property.meta_title || `${property.property_name} - ${spaceType} in ${property.city} | CountryRoof`
  const description = property.meta_description || 
    property.short_description || 
    `${property.property_name} - Premium ${spaceType} in ${property.city}, ${property.state}. ${property.office_space?.available_seats ? `${property.office_space.available_seats} seats available.` : ""} ${property.office_space?.price_per_seat_monthly ? `Starting ₹${property.office_space.price_per_seat_monthly}/seat/month.` : ""}`
  
  const canonicalUrl = `${baseUrl}/office-space/${property.slug || slug}`
  const ogImage = property.main_banner || property.main_thumbnail || property.multiple_images?.[0]

  return {
    title,
    description,
    keywords: property.meta_keywords || [
      property.property_name,
      spaceType,
      'coworking',
      'office space',
      property.city,
      property.state,
      'flexible workspace',
      'managed office',
    ].filter(Boolean).join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: property.og_title || title,
      description: property.og_description || description,
      url: canonicalUrl,
      type: "website",
      siteName: "CountryRoof",
      locale: "en_IN",
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: property.property_name,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: property.og_title || title,
      description: property.og_description || description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function OfficeSpaceDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property = await getOfficeSpace(slug)

  if (!property) {
    notFound()
  }

  const developer = property.developer_id ? await getDeveloper(property.developer_id) : null
  
  // Generate schema markup for office space
  const officeSpaceSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/office-space/${property.slug}`,
    "name": property.property_name,
    "description": property.short_description || property.about_project,
    "image": property.main_banner || property.main_thumbnail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state,
      "postalCode": property.postal_code,
      "addressCountry": "IN"
    },
    "priceRange": property.office_space?.price_per_seat_monthly 
      ? `₹${property.office_space.price_per_seat_monthly}/month` 
      : "Contact for pricing",
    "telephone": "+91 98737 02365",
    "url": `${baseUrl}/office-space/${property.slug}`,
    "openingHours": property.office_space?.access_hours === '24_7' ? "Mo-Su 00:00-24:00" : "Mo-Sa 09:00-18:00",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Office Spaces",
        "item": `${baseUrl}/office-space`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": property.property_name,
        "item": `${baseUrl}/office-space/${property.slug}`
      }
    ]
  }

  return (
    <>
      <Script
        id="office-space-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(officeSpaceSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <OfficeSpaceDetailClient property={property} developer={developer} />
    </>
  )
}
