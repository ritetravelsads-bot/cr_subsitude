import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MongoClient, ObjectId } from "mongodb"
import Script from "next/script"
import { generatePropertySchema, generatePropertyBreadcrumbSchema } from "@/lib/schema-markup-generator"
import { PropertyDetailClient } from "@/components/property/property-detail-client"
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
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  amenities?: string[]
  luxury_amenities?: string[]
  developer_id?: string
  developer_name?: string
  status?: string
  [key: string]: any
}

async function getProperty(id: string): Promise<Property | null> {
  if (!mongoUrl) return null
  const client = new MongoClient(mongoUrl)
  try {
    await client.connect()
    const db = client.db("countryroof")
    const collection = db.collection("properties")
    
    // Try to find by slug first, then fall back to _id
    let property = await collection.findOne({ slug: id })
    
    if (!property) {
      try {
        const objectId = new ObjectId(id)
        property = await collection.findOne({ _id: objectId })
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
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  
  if (!property) {
    return { 
      title: "Property Not Found | CountryRoof",
      robots: { index: false, follow: false }
    }
  }

  const title = property.meta_title || `${property.property_name} | ${property.city} | CountryRoof`
  const description = property.meta_description || 
    property.short_description || 
    `${property.property_name} - ${property.property_type || "Property"} in ${property.city}, ${property.state}. ${property.bedrooms ? `${property.bedrooms} BHK` : ""} ${property.area_sqft ? `${property.area_sqft} sqft` : ""}. Price: ${formatPriceToIndian(property.lowest_price)}${property.max_price ? ` - ${formatPriceToIndian(property.max_price)}` : ""}`
  
  const canonicalUrl = `${baseUrl}/properties/${property.slug || id}`
  const ogImage = property.main_banner || property.main_thumbnail || property.multiple_images?.[0]

  return {
    title,
    description,
    keywords: property.meta_keywords || [
      property.property_name,
      property.property_type,
      property.city,
      property.state,
      "buy property",
      "real estate",
      property.developer_name,
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

export default async function PropertyDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const developer = property.developer_id ? await getDeveloper(property.developer_id) : null
  
  // Generate schema markup arrays
  const propertySchemas = generatePropertySchema(property)
  const breadcrumbSchema = generatePropertyBreadcrumbSchema(property, "properties", "Properties")

  return (
    <>
      {/* Schema Markup for SEO - Using Next.js Script with strategy="beforeInteractive" for head injection */}
      {Array.isArray(propertySchemas) && propertySchemas.map((schema, index) => (
        <Script
          key={`property-schema-${index}`}
          id={`property-schema-${index}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <PropertyDetailClient property={property} developer={developer} />
    </>
  )
}
