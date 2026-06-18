import type { MetadataRoute } from "next"
import { MongoClient } from "mongodb"

const baseUrl = "https://countryroof.in"

// Ensure slug is valid for URLs - the slugs in DB should already be clean
// but we encode any special characters just in case
function sanitizeSlug(slug: string): string {
  if (!slug) return ""
  // The slug should already be URL-friendly from the database
  // Just ensure it's properly encoded for the sitemap XML
  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace any spaces with hyphens
    .replace(/&/g, "-and-") // Replace & with -and-
}

async function getDbConnection() {
  if (!process.env.MONGODB_URI) {
    console.log("[sitemap] MONGODB_URI not set")
    return null
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    return client
  } catch (error) {
    console.log("[sitemap] Failed to connect to MongoDB:", error)
    return null
  }
}

// Property type slug mapping for URL structure
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

async function getProperties() {
  const client = await getDbConnection()
  if (!client) return []

  try {
    const db = client.db("countryroof")
    const properties = await db
      .collection("properties")
      .find({ status: "active" })
      .project({ slug: 1, updated_at: 1, property_name: 1, property_type: 1 })
      .toArray()
    return properties
  } catch (error) {
    console.log("[sitemap] Error fetching properties:", error)
    return []
  } finally {
    await client.close()
  }
}

async function getBlogs() {
  const client = await getDbConnection()
  if (!client) return []

  try {
    const db = client.db("countryroof")
    const blogs = await db
      .collection("blog_posts")
      .find({ is_published: true })
      .project({ slug: 1, updated_at: 1, title: 1 })
      .toArray()
    return blogs
  } catch (error) {
    console.log("[sitemap] Error fetching blogs:", error)
    return []
  } finally {
    await client.close()
  }
}

async function getDevelopers() {
  const client = await getDbConnection()
  if (!client) return []

  try {
    const db = client.db("countryroof")
    const developers = await db
      .collection("developers")
      .find({})
      .project({ slug: 1, updated_at: 1, name: 1 })
      .toArray()
    return developers
  } catch (error) {
    console.log("[sitemap] Error fetching developers:", error)
    return []
  } finally {
    await client.close()
  }
}

async function getLocations() {
  const client = await getDbConnection()
  if (!client) return []

  try {
    const db = client.db("countryroof")
    const locations = await db
      .collection("locations")
      .find({})
      .project({ slug: 1, updated_at: 1, name: 1 })
      .toArray()
    return locations
  } catch (error) {
    console.log("[sitemap] Error fetching locations:", error)
    return []
  } finally {
    await client.close()
  }
}

async function getNews() {
  const client = await getDbConnection()
  if (!client) return []

  try {
    const db = client.db("countryroof")
    const news = await db
      .collection("news")
      .find({ is_published: true })
      .project({ slug: 1, updated_at: 1, title: 1 })
      .toArray()
    return news
  } catch (error) {
    console.log("[sitemap] Error fetching news:", error)
    return []
  } finally {
    await client.close()
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/developers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Fetch all dynamic content in parallel
  const [properties, blogs, developers, locations, news] = await Promise.all([
    getProperties(),
    getBlogs(),
    getDevelopers(),
    getLocations(),
    getNews(),
  ])

  // Dynamic property pages - using new URL structure /properties/[type]/[slug]
  const propertyPages: MetadataRoute.Sitemap = properties
    .filter((prop: any) => prop.slug) // Only include properties with slugs
    .map((prop: any) => {
      const typeSlug = getPropertyTypeSlug(prop.property_type || "")
      return {
        url: `${baseUrl}/properties/${typeSlug}/${sanitizeSlug(prop.slug)}`,
        lastModified: prop.updated_at ? new Date(prop.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }
    })

  // Dynamic blog pages - using slug (title-based URL)
  const blogPages: MetadataRoute.Sitemap = blogs
    .filter((blog: any) => blog.slug)
    .map((blog: any) => ({
      url: `${baseUrl}/blogs/${sanitizeSlug(blog.slug)}`,
      lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

  // Dynamic developer pages - using slug (name-based URL)
  const developerPages: MetadataRoute.Sitemap = developers
    .filter((dev: any) => dev.slug)
    .map((dev: any) => ({
      url: `${baseUrl}/developer/${sanitizeSlug(dev.slug)}`,
      lastModified: dev.updated_at ? new Date(dev.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  // Dynamic location pages - using slug (name-based URL)
  const locationPages: MetadataRoute.Sitemap = locations
    .filter((loc: any) => loc.slug)
    .map((loc: any) => ({
      url: `${baseUrl}/location/${sanitizeSlug(loc.slug)}`,
      lastModified: loc.updated_at ? new Date(loc.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  // Dynamic news pages - using slug (title-based URL)
  const newsPages: MetadataRoute.Sitemap = news
    .filter((item: any) => item.slug)
    .map((item: any) => ({
      url: `${baseUrl}/news/${sanitizeSlug(item.slug)}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }))

  return [
    ...staticPages,
    ...propertyPages,
    ...blogPages,
    ...developerPages,
    ...locationPages,
    ...newsPages,
  ]
}
