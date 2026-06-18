import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

// Disable caching for this route to ensure fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase()
    const searchParams = req.nextUrl.searchParams

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    // Build the query
    const query: any = {}
    const andConditions: any[] = []

    // Status filter - active or available
    andConditions.push({
      $or: [{ status: "active" }, { status: "available" }, { status: { $exists: false } }]
    })

    // Search query - property name, address, neighborhood, city, developer
    const search = searchParams.get("search")
    if (search) {
      andConditions.push({
        $or: [
          { property_name: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
          { neighborhood: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { developer_name: { $regex: search, $options: "i" } },
          { bhk_configuration: { $regex: search, $options: "i" } },
        ]
      })
    }

    // State filter
    const state = searchParams.get("state")
    if (state) {
      andConditions.push({ state: { $regex: state, $options: "i" } })
    }

    // City filter
    const city = searchParams.get("city")
    if (city) {
      andConditions.push({ city: { $regex: city, $options: "i" } })
    }

    // Location filter (searches address, neighborhood, city, area)
    const location = searchParams.get("location")
    if (location) {
      andConditions.push({
        $or: [
          { address: { $regex: location, $options: "i" } },
          { neighborhood: { $regex: location, $options: "i" } },
          { city: { $regex: location, $options: "i" } },
          { state: { $regex: location, $options: "i" } },
          { property_name: { $regex: location, $options: "i" } },
        ]
      })
    }

    // Category / Property Type filter
    const category = searchParams.get("category")
    if (category) {
      andConditions.push({
        $or: [
          { property_type: { $regex: category, $options: "i" } },
          { property_category: { $regex: category, $options: "i" } }
        ]
      })
    }

    // Property Type specific filter - supports multiple values (OR condition)
    const propertyTypes = searchParams.getAll("property_type")
    if (propertyTypes.length > 0) {
      andConditions.push({
        $or: propertyTypes.map(pt => ({ property_type: { $regex: `^${pt}$`, $options: "i" } }))
      })
    }

    // Property Category filter - supports multiple values (OR condition)
    const propertyCategories = searchParams.getAll("property_category")
    if (propertyCategories.length > 0) {
      andConditions.push({
        $or: propertyCategories.map(pc => ({ property_category: { $regex: `^${pc}$`, $options: "i" } }))
      })
    }

    // Target Segment filter - supports multiple values (OR condition)
    const targetSegments = searchParams.getAll("target_segment")
    if (targetSegments.length > 0) {
      andConditions.push({
        $or: targetSegments.map(ts => ({ target_segment: { $regex: `^${ts}$`, $options: "i" } }))
      })
    }

    // Possession Type filter - supports multiple values (OR condition)
    const possessionTypes = searchParams.getAll("possession_type")
    if (possessionTypes.length > 0) {
      andConditions.push({
        $or: possessionTypes.map(pt => ({ possession_type: { $regex: `^${pt}$`, $options: "i" } }))
      })
    }

    // Listing Type filter (builder_project, resale, rental, new)
    const listingType = searchParams.get("listing_type")
    if (listingType) {
      andConditions.push({ listing_type: listingType })
    }

    // Project Status filter (launched, under_construction, ready_to_move)
    const projectStatus = searchParams.get("project_status")
    if (projectStatus) {
      andConditions.push({ project_status: projectStatus })
    }

    // Target Segment filter (luxury, premium, mid, affordable)
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

    // Bedrooms filter
    const bedrooms = searchParams.get("bedrooms")
    if (bedrooms) {
      if (bedrooms === "5+") {
        andConditions.push({ bedrooms: { $gte: 5 } })
      } else {
        andConditions.push({
          $or: [
            { bedrooms: Number.parseInt(bedrooms) },
            { bhk_configuration: { $regex: `^${bedrooms}`, $options: "i" } }
          ]
        })
      }
    }

    // Furnished type filter
    const furnished = searchParams.get("furnished_type")
    if (furnished) {
      andConditions.push({ furnished_type: furnished })
    }

    // Possession type filter
    const possession = searchParams.get("possession_type")
    if (possession) {
      andConditions.push({ possession_type: possession })
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

    // Developer filter
    const developerId = searchParams.get("developer_id")
    if (developerId) {
      try {
        andConditions.push({ developer_id: new ObjectId(developerId) })
      } catch (e) {
        // Invalid ObjectId, skip
      }
    }

    // Developer name filter (supports both "developer" and "developer_name" params)
    const developerName = searchParams.get("developer") || searchParams.get("developer_name")
    if (developerName) {
      andConditions.push({ developer_name: { $regex: developerName, $options: "i" } })
    }

    // Featured filter
    const featured = searchParams.get("featured")
    if (featured === "true") {
      andConditions.push({ is_featured: true })
    }

    // Office Space specific filters
    const spaceType = searchParams.get("space_type")
    if (spaceType) {
      andConditions.push({ "office_space.space_type": spaceType })
    }

    const minSeats = searchParams.get("min_seats")
    if (minSeats) {
      andConditions.push({ "office_space.available_seats": { $gte: Number.parseInt(minSeats) } })
    }

    const maxSeats = searchParams.get("max_seats")
    if (maxSeats) {
      andConditions.push({ "office_space.available_seats": { $lte: Number.parseInt(maxSeats) } })
    }

    const minCabins = searchParams.get("min_cabins")
    if (minCabins) {
      andConditions.push({ "office_space.available_cabins": { $gte: Number.parseInt(minCabins) } })
    }

    const pricingModel = searchParams.get("pricing_model")
    if (pricingModel) {
      andConditions.push({ "office_space.pricing_model": pricingModel })
    }

    const buildingGrade = searchParams.get("building_grade")
    if (buildingGrade) {
      andConditions.push({ "office_space.building_grade": buildingGrade })
    }

    const fitOutStatus = searchParams.get("fit_out_status")
    if (fitOutStatus) {
      andConditions.push({ "office_space.fit_out_status": fitOutStatus })
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

    // Build final query
    if (andConditions.length > 0) {
      query.$and = andConditions
    }

    // Sorting - always include _id as secondary sort to ensure consistent pagination
    const sortBy = searchParams.get("sort") || "featured"
    let sortOption: any = { is_featured: -1, created_at: -1, _id: -1 }
    
    switch (sortBy) {
      case "price_low":
        sortOption = { lowest_price: 1, _id: 1 }
        break
      case "price_high":
        sortOption = { lowest_price: -1, _id: -1 }
        break
      case "newest":
        sortOption = { created_at: -1, _id: -1 }
        break
      case "oldest":
        sortOption = { created_at: 1, _id: 1 }
        break
      case "name":
        sortOption = { property_name: 1, _id: 1 }
        break
    }

    const total = await db.collection("properties").countDocuments(query)
    const properties = await db
      .collection("properties")
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray()

    // Serialize _id to string
    const serializedProperties = properties.map(p => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json({
      properties: serializedProperties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}
