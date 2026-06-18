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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

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
    // and create a virtual developer object
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
          project_count: 0, // Will be calculated below
          isVirtual: true
        }
      }
    }

    if (!developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 })
    }

    // Build query to find properties by this developer
    const propertyQuery: any = {
      $or: [
        { developer_name: developer.name },
        { developer_name: { $regex: new RegExp(`^${developer.name}$`, "i") } }
      ]
    }
    
    // Also match by developer_id if available
    if (developer._id && ObjectId.isValid(developer._id.toString())) {
      propertyQuery.$or.push({ developer_id: new ObjectId(developer._id.toString()) })
    }

    const [properties, totalCount] = await Promise.all([
      db
        .collection("properties")
        .find(propertyQuery)
        .sort({ is_featured: -1, created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("properties").countDocuments(propertyQuery),
    ])

    // Serialize ObjectIds to strings
    const serializedProperties = properties.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    const serializedDeveloper = {
      ...developer,
      _id: developer._id?.toString() || slug,
      project_count: totalCount
    }

    return NextResponse.json({
      developer: serializedDeveloper,
      properties: serializedProperties,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching developer:", error)
    return NextResponse.json(
      { error: "Failed to fetch developer" },
      { status: 500 }
    )
  }
}
