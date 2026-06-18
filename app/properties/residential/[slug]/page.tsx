import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { MongoClient, ObjectId } from "mongodb"
import { generatePropertySchema, generatePropertyBreadcrumbSchema } from "@/lib/schema-markup-generator"
import { PropertyDetailClient } from "@/components/property/property-detail-client"
import { formatPriceToIndian } from "@/lib/utils"
import Script from "next/script"

const mongoUrl = process.env.MONGODB_URI || ""
const baseUrl = "https://countryroof.in"

// Property type slug mapping
const PROPERTY_TYPE_MAP: Record<string, string[]> = {
  residential: ["apartment", "villa", "house", "flat", "penthouse", "duplex", "studio", "independent", "row house", "bungalow", "farmhouse"],
  commercial: ["office", "shop", "commercial", "showroom", "warehouse", "retail", "sco", "scf", "multiplex"],
  plots: ["plot", "land", "agricultural", "industrial land"],
}

function getPropertyTypeSlug(propertyType: string): string {
  if (!propertyType) return "residential"
  const lowerType = propertyType.toLowerCase()
  
  for (const [slug, types] of Object.entries(PROPERTY_TYPE_MAP)) {
    if (types.some(t => lowerType.includes(t))) {
      return slug
    }
  }
  return "residential"
}

function getPropertyTypeDisplayName(slug: string): string {
  const names: Record<string, string> = {
    residential: "Residential",
    commercial: "Commercial",
    plots: "Plots & Land",
  }
  return names[slug] || "Properties"
}

interface Property {
  _id: string
  slug: string
  property_name: string
  property_type?: string
  listing_type?: string
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
  assigned_manager?: {
    name?: string
    phone?: string
    email?: string
    photo?: string
  }
  [key: string]: any
}

async function getProperty(slug: string): Promise<Property | null> {
  if (!mongoUrl) return null
  const client = new MongoClient(mongoUrl)
  try {
    await client.connect()
    const db = client.db("countryroof")
    const collection = db.collection("properties")
    
    // Try to find by slug first
    let property = await collection.findOne({ slug })
    
    if (!property) {
      try {
        const objectId = new ObjectId(slug)
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

const PROPERTY_TYPE_SLUG = "residential"

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const property = await getProperty(slug)
  
  if (!property) {
    return { 
      title: "Property Not Found | CountryRoof",
      robots: { index: false, follow: false }
    }
  }

  const propertyTypeSlug = getPropertyTypeSlug(property.property_type || "")
  const title = property.meta_title || `${property.property_name} | ${property.city} | CountryRoof`
  const description = property.meta_description || 
    property.about_project?.substring(0, 160) || 
    `${property.property_name} - ${property.property_type || "Property"} in ${property.city}, ${property.state}. ${property.bedrooms ? `${property.bedrooms} BHK` : ""} ${property.area_sqft ? `${property.area_sqft} sqft` : ""}. Price: ${formatPriceToIndian(property.lowest_price)}${property.max_price ? ` - ${formatPriceToIndian(property.max_price)}` : ""}`
  
  const canonicalUrl = `${baseUrl}/properties/${propertyTypeSlug}/${property.slug || slug}`
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
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) {
    notFound()
  }

  // Validate the property type in URL matches the actual property type
  const correctTypeSlug = getPropertyTypeSlug(property.property_type || "")
  if (PROPERTY_TYPE_SLUG !== correctTypeSlug) {
    // Redirect to correct URL
    redirect(`/properties/${correctTypeSlug}/${property.slug || slug}`)
  }

  const developer = property.developer_id ? await getDeveloper(property.developer_id) : null
  const propertyTypeDisplayName = getPropertyTypeDisplayName(PROPERTY_TYPE_SLUG)
  
  // Generate schema markup arrays
  const propertySchemas = generatePropertySchema(property)
  const breadcrumbSchema = generatePropertyBreadcrumbSchema(property, PROPERTY_TYPE_SLUG, propertyTypeDisplayName)

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
      
      <PropertyDetailClient 
        property={property} 
        developer={developer} 
        propertyTypeSlug={PROPERTY_TYPE_SLUG}
        propertyTypeDisplayName={propertyTypeDisplayName}
      />
    </>
  )
}
