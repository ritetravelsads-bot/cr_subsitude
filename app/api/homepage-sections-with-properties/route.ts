import { getDatabase } from "@/lib/mongodb"
import type { HomepageSection } from "@/lib/schemas"
import { ObjectId } from "mongodb"

// Force dynamic rendering - always fetch fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

// Helper function to determine dominant category from properties
function getDominantCategory(properties: any[]): string | null {
  if (!properties || properties.length === 0) return null

  // Count occurrences of each category/property_type
  const categoryCounts: Record<string, number> = {}
  
  for (const prop of properties) {
    // Check property_type first (more specific)
    const category = prop.property_type || prop.property_category || prop.target_segment
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    }
  }

  // Find the most common category
  let dominantCategory: string | null = null
  let maxCount = 0
  
  for (const [category, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count
      dominantCategory = category
    }
  }

  return dominantCategory
}

// Helper function to build filter params based on section data
function buildFilterParams(section: any, properties: any[]): string {
  const params = new URLSearchParams()
  
  // Check section filters first
  if (section.filters) {
    if (section.filters.category) {
      params.set("category", section.filters.category)
    }
    if (section.filters.property_type) {
      params.set("property_type", section.filters.property_type)
    }
    if (section.filters.is_featured) {
      params.set("featured", "true")
    }
    if (section.filters.state) {
      params.set("state", section.filters.state)
    }
  }
  
  // If no filters set, try to determine from section_type
  if (params.toString() === "") {
    switch (section.section_type) {
      case "luxury":
        params.set("segment", "luxury")
        break
      case "affordable":
        params.set("segment", "affordable")
        break
      case "new_launches":
        params.set("listing_type", "new")
        break
      case "handpicked":
        params.set("featured", "true")
        break
      case "plots":
        params.set("property_type", "plot")
        break
      case "commercial":
        params.set("category", "commercial")
        break
      case "sco":
        params.set("property_type", "sco")
        break
      case "investment":
        params.set("segment", "premium")
        break
      case "budget":
        params.set("segment", "affordable")
        break
      default:
        // Try to get dominant category from properties
        const dominantCategory = getDominantCategory(properties)
        if (dominantCategory) {
          params.set("category", dominantCategory)
        }
        break
    }
  }
  
  return params.toString()
}

export async function GET() {
  try {
    const db = await getDatabase()

    const sections = await db
      .collection<HomepageSection>("homepage_sections")
      .find({ is_active: true })
      .sort({ sort_order: 1 })
      .toArray()

    // Fetch properties for each section
    const sectionsWithProperties = await Promise.all(
      sections.map(async (section) => {
        let properties: any[] = []

        if (section.property_ids && section.property_ids.length > 0) {
          try {
            properties = await db
              .collection("properties")
              .find({
                _id: { $in: section.property_ids.map((id) => new ObjectId(id)) },
                status: "active"
              })
              .limit(section.display_limit)
              .toArray()
          } catch (error) {
            console.warn(`[v0] Failed to fetch properties for section ${section._id}:`, error)
          }
        }

        // Build filter params for View All link
        const filterParams = buildFilterParams(section, properties)

        return {
          ...section,
          properties: properties.map(prop => ({
            ...prop,
            slug: prop.slug || prop._id.toString()
          })),
          filterParams, // Add filter params for View All link
        }
      }),
    )

    return Response.json(sectionsWithProperties)
  } catch (error) {
    console.error("[v0] Error fetching sections with properties:", error)
    return Response.json({ error: "Failed to fetch sections" }, { status: 500 })
  }
}
