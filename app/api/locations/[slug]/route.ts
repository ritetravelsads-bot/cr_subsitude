import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(req.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit
    
    const db = await getDatabase()

    // Find location by slug from database
    const dbLocation = await db.collection("locations").findOne({ slug })

    // If location doesn't exist in DB, create a virtual location from the slug
    // This allows location pages to work even if not all locations are in the database
    const location = dbLocation || {
      _id: slug,
      name: slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug: slug,
      type: 'locality',
      city: 'Gurgaon',
      state: 'Haryana',
    }

    // Build property query based on location
    const propertyQuery: Record<string, any> = {}
    const andConditions: any[] = []
    
    // Status filter - active or available
    andConditions.push({
      $or: [{ status: "active" }, { status: "available" }, { status: { $exists: false } }]
    })

    // Determine location matching strategy based on type:
    // - "city" type  → match properties whose `city` field equals this location name
    // - "area" / "neighborhood" / "region" / unknown → match only `address` and `neighborhood`
    //   using the exact phrase (slug-with-spaces). NEVER fall back to individual words or city/state,
    //   because that would pull in every property in the city.

    const locationName: string = location.name           // e.g. "Golf Course Road"
    const locationSlug: string = location.slug || slug   // e.g. "golf-course-road"
    const locationType: string = location.type || "area" // "city" | "area" | "neighborhood" | "region"

    // Build exact phrase variants: "Golf Course Road" and "Golf Course Road" (slug with spaces)
    const phraseVariants: string[] = [
      locationName,
      locationSlug.replace(/-/g, " "),  // "golf course road"
    ].filter(Boolean)
    // Remove duplicates (case-insensitive)
    const uniquePhrases = [...new Set(phraseVariants.map((p: string) => p.toLowerCase()))]

    if (locationType === "city") {
      // For city-level pages match the city field exactly
      const cityConditions = uniquePhrases.map((phrase: string) => ({
        city: { $regex: `^${phrase}$`, $options: "i" },
      }))
      andConditions.push({ $or: cityConditions })
    } else {
      // For area/neighborhood/region pages: match the FULL PHRASE in address or neighborhood only.
      // Do NOT split into words and do NOT match against city/state to avoid pulling
      // every property in the whole city.
      const searchConditions: any[] = []
      for (const phrase of uniquePhrases) {
        // Escape regex special characters in the phrase
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const pattern = { $regex: escaped, $options: "i" }
        searchConditions.push({ address: pattern })
        searchConditions.push({ neighborhood: pattern })
      }
      if (searchConditions.length > 0) {
        andConditions.push({ $or: searchConditions })
      }
    }

    // Property Type filter
    const propertyType = searchParams.get("property_type")
    if (propertyType) {
      andConditions.push({ property_type: { $regex: `^${propertyType}$`, $options: "i" } })
    }

    // Project Status filter
    const projectStatus = searchParams.get("project_status")
    if (projectStatus) {
      andConditions.push({ project_status: projectStatus })
    }

    // Segment/Target Segment filter
    const segment = searchParams.get("segment")
    if (segment) {
      andConditions.push({ target_segment: segment })
    }

    // Price filters
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice) {
      andConditions.push({ lowest_price: { $gte: Number.parseInt(minPrice) } })
    }
    if (maxPrice) {
      andConditions.push({
        $or: [
          { lowest_price: { $lte: Number.parseInt(maxPrice) } },
          { max_price: { $lte: Number.parseInt(maxPrice) } }
        ]
      })
    }

    // Area filters (min/max sqft)
    const minArea = searchParams.get("minArea")
    const maxArea = searchParams.get("maxArea")
    if (minArea) {
      andConditions.push({
        $or: [
          { area_sqft: { $gte: Number.parseInt(minArea) } },
          { carpet_area: { $gte: Number.parseInt(minArea) } },
          { super_area: { $gte: Number.parseInt(minArea) } }
        ]
      })
    }
    if (maxArea) {
      andConditions.push({
        $or: [
          { area_sqft: { $lte: Number.parseInt(maxArea) } },
          { carpet_area: { $lte: Number.parseInt(maxArea) } },
          { super_area: { $lte: Number.parseInt(maxArea) } }
        ]
      })
    }

    // RERA registered filter
    const reraRegistered = searchParams.get("rera_registered")
    if (reraRegistered === "true") {
      andConditions.push({
        $or: [
          { rera_registered: true },
          { rera_id: { $exists: true, $ne: "" } },
          { rera_no: { $exists: true, $ne: "" } }
        ]
      })
    }
    
    propertyQuery.$and = andConditions

    // Get total count
    const totalProperties = await db.collection("properties").countDocuments(propertyQuery)
    const totalPages = Math.ceil(totalProperties / limit)

    // Get paginated properties
    const properties = await db
      .collection("properties")
      .find(propertyQuery)
      .sort({ is_featured: -1, created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Serialize - handle both database locations (with ObjectId) and virtual locations
    const serializedLocation = {
      ...location,
      _id: typeof location._id === 'object' ? location._id.toString() : location._id,
    }

    const serializedProperties = properties.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json({
      location: serializedLocation,
      properties: serializedProperties,
      pagination: {
        page,
        limit,
        total: totalProperties,
        totalPages,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching location:", error)
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 })
  }
}
