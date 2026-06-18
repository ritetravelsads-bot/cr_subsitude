import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import type { NextRequest } from "next/server"
import type { LeadStatus, LeadPriority } from "@/lib/models"

// GET all leads for admin with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") as LeadStatus | null
    const priority = searchParams.get("priority") as LeadPriority | null
    const source = searchParams.get("source")
    const search = searchParams.get("search")
    const propertyId = searchParams.get("property_id")
    const ownerId = searchParams.get("owner_id")
    const assignedTo = searchParams.get("assigned_to")
    const unassigned = searchParams.get("unassigned") === "true"

    const db = await getDatabase()
    
    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {}
    
    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (source) filter.source = source
    if (propertyId) filter.property_id = propertyId
    if (ownerId) filter.property_owner_id = ownerId
    if (assignedTo) filter.assigned_to = assignedTo
    if (unassigned) filter.assigned_to = { $exists: false }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { property_name: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    
    // Get total count
    const total = await db.collection("leads").countDocuments(filter)
    
    // Get leads with pagination
    const leads = await db.collection("leads")
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Serialize ObjectIds
    const serializedLeads = leads.map(lead => ({
      ...lead,
      _id: lead._id.toString(),
    }))

    // Get stats
    const stats = {
      total: await db.collection("leads").countDocuments({}),
      new: await db.collection("leads").countDocuments({ status: "new" }),
      contacted: await db.collection("leads").countDocuments({ status: "contacted" }),
      qualified: await db.collection("leads").countDocuments({ status: "qualified" }),
      converted: await db.collection("leads").countDocuments({ status: "converted" }),
      lost: await db.collection("leads").countDocuments({ status: "lost" }),
      unassigned: await db.collection("leads").countDocuments({ assigned_to: { $exists: false } }),
    }

    return NextResponse.json({
      leads: serializedLeads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    })
  } catch (error) {
    console.error("[v0] Error fetching leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

// POST create a new lead (admin can create leads manually)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, message, property_id, source, priority } = body

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get property details if property_id is provided
    let propertyData = null
    if (property_id) {
      try {
        propertyData = await db.collection("properties").findOne({ _id: new ObjectId(property_id) })
      } catch {
        // Invalid property ID, continue without property data
      }
    }

    const lead = {
      name,
      email: email || "",
      phone,
      message: message || "",
      property_id: property_id || null,
      property_name: propertyData?.property_name || null,
      property_slug: propertyData?.slug || null,
      property_owner_id: propertyData?.agent || null,
      property_owner_type: propertyData?.agent ? "agent" : "admin",
      source: source || "other",
      status: "new" as LeadStatus,
      priority: priority || "medium" as LeadPriority,
      notes: [],
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection("leads").insertOne(lead)

    return NextResponse.json({ 
      _id: result.insertedId.toString(), 
      ...lead 
    }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating lead:", error)
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}
