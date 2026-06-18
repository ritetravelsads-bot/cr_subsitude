import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "4")
    const excludeId = searchParams.get("exclude") // Exclude current property

    const db = await getDatabase()

    // Try multiple ways to find the developer
    let developer = null
    
    // 1. Try to find by exact slug
    developer = await db.collection("developers").findOne({ slug })
    
    // 2. Try to find by ObjectId
    if (!developer && ObjectId.isValid(slug)) {
      developer = await db.collection("developers").findOne({ _id: new ObjectId(slug) })
    }
    
    // 3. Try to find by name (case-insensitive, convert slug back to name)
    if (!developer) {
      const possibleName = slug.replace(/-/g, " ")
      developer = await db.collection("developers").findOne({ 
        name: { $regex: new RegExp(`^${possibleName}$`, "i") }
      })
    }

    // 4. If still not found, check if properties exist with this developer name
    if (!developer) {
      const possibleName = slug.replace(/-/g, " ")
      const propertyWithDeveloper = await db.collection("properties").findOne({
        $or: [
          { developer_name: { $regex: new RegExp(`^${possibleName}$`, "i") } },
          { developer_name: { $regex: new RegExp(possibleName, "i") } }
        ]
      })
      
      if (propertyWithDeveloper?.developer_name) {
        // Create virtual developer from property data
        developer = {
          _id: slug,
          name: propertyWithDeveloper.developer_name,
          slug: slug,
          logo_url: propertyWithDeveloper.developer_logo || null,
          about_developer: propertyWithDeveloper.developer_description || null,
          description: propertyWithDeveloper.developer_description || null,
          website: propertyWithDeveloper.developer_website || null,
          project_count: 0,
          isVirtual: true
        }
      }
    }

    if (!developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 })
    }

    // Build query for properties by this developer
    const orConditions: any[] = [
      { developer_name: developer.name },
      { developer_name: { $regex: new RegExp(`^${developer.name}$`, "i") } }
    ]
    
    // Also match by developer_id if available
    if (developer._id && ObjectId.isValid(developer._id.toString())) {
      orConditions.push({ developer_id: new ObjectId(developer._id.toString()) })
    }

    const query: Record<string, any> = { $or: orConditions }

    // Exclude current property if specified
    if (excludeId) {
      if (ObjectId.isValid(excludeId)) {
        query._id = { $ne: new ObjectId(excludeId) }
      } else {
        query.slug = { $ne: excludeId }
      }
    }

    // Find properties by developer
    const properties = await db
      .collection("properties")
      .find(query)
      .sort({ is_featured: -1, created_at: -1 })
      .limit(limit)
      .project({
        _id: 1,
        property_name: 1,
        slug: 1,
        main_thumbnail: 1,
        city: 1,
        state: 1,
        lowest_price: 1,
        max_price: 1,
        property_type: 1,
        possession: 1,
        configurations: 1,
        units: 1
      })
      .toArray()

    // Serialize ObjectIds to strings
    const serializedProperties = properties.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    const serializedDeveloper = {
      ...developer,
      _id: developer._id?.toString() || slug,
    }

    return NextResponse.json({
      developer: serializedDeveloper,
      projects: serializedProperties,
      total: serializedProperties.length
    })
  } catch (error) {
    console.error("[v0] Error fetching developer projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch developer projects" },
      { status: 500 }
    )
  }
}
