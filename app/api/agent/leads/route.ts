import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { LeadStatus, LeadPriority } from "@/lib/models"

// GET leads for agent (leads assigned to them OR leads on their properties)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.user_type !== "agent" && user.user_type !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") as LeadStatus | null
    const priority = searchParams.get("priority") as LeadPriority | null
    const search = searchParams.get("search")
    const filter_type = searchParams.get("filter_type") // "assigned" | "my_properties" | "all"

    const db = await getDatabase()
    
    // Build base filter - agent sees leads assigned to them OR from their properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let baseFilter: any = {}
    
    if (filter_type === "assigned") {
      // Only leads directly assigned to this agent
      baseFilter = { assigned_to: user._id }
    } else if (filter_type === "my_properties") {
      // Only leads from agent's own properties
      baseFilter = { property_owner_id: user._id }
    } else {
      // All accessible leads (default)
      baseFilter = {
        $or: [
          { assigned_to: user._id },
          { property_owner_id: user._id },
        ]
      }
    }
    
    // Add additional filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { ...baseFilter }
    
    if (status) filter.status = status
    if (priority) filter.priority = priority
    
    if (search) {
      filter.$and = [
        baseFilter,
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { property_name: { $regex: search, $options: "i" } },
          ]
        }
      ]
      delete filter.$or
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

    // Get stats specific to this agent
    const baseStatsFilter = {
      $or: [
        { assigned_to: user._id },
        { property_owner_id: user._id },
      ]
    }
    
    const stats = {
      total: await db.collection("leads").countDocuments(baseStatsFilter),
      new: await db.collection("leads").countDocuments({ ...baseStatsFilter, status: "new" }),
      contacted: await db.collection("leads").countDocuments({ ...baseStatsFilter, status: "contacted" }),
      qualified: await db.collection("leads").countDocuments({ ...baseStatsFilter, status: "qualified" }),
      converted: await db.collection("leads").countDocuments({ ...baseStatsFilter, status: "converted" }),
      lost: await db.collection("leads").countDocuments({ ...baseStatsFilter, status: "lost" }),
      assigned_to_me: await db.collection("leads").countDocuments({ assigned_to: user._id }),
      from_my_properties: await db.collection("leads").countDocuments({ property_owner_id: user._id }),
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
    console.error("[v0] Error fetching agent leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}
