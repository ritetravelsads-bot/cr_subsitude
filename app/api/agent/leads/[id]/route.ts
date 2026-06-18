import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import type { NextRequest } from "next/server"

// GET single lead by ID (agent can only see their leads)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.user_type !== "agent" && user.user_type !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDatabase()

    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 })
    }

    const lead = await db.collection("leads").findOne({ _id: objectId })
    
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Check if agent has access to this lead
    const hasAccess = lead.assigned_to === user._id || lead.property_owner_id === user._id
    if (!hasAccess && user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Lead not accessible" }, { status: 403 })
    }

    // Get property details if available
    let property = null
    if (lead.property_id) {
      try {
        property = await db.collection("properties").findOne({ 
          _id: new ObjectId(lead.property_id) 
        })
        if (property) {
          property = { ...property, _id: property._id.toString() }
        }
      } catch {
        // Invalid property ID
      }
    }

    return NextResponse.json({
      ...lead,
      _id: lead._id.toString(),
      property,
    })
  } catch (error) {
    console.error("[v0] Error fetching lead:", error)
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 })
  }
}

// PUT update lead (agents can update status, add follow-up, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.user_type !== "agent" && user.user_type !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const db = await getDatabase()

    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 })
    }

    // Check if agent has access to this lead
    const lead = await db.collection("leads").findOne({ _id: objectId })
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const hasAccess = lead.assigned_to === user._id || lead.property_owner_id === user._id
    if (!hasAccess && user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Lead not accessible" }, { status: 403 })
    }

    // Build update object (agents can update limited fields)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: any = {
      updated_at: new Date(),
    }

    const agentAllowedFields = [
      "status", "priority", "next_follow_up", "last_contacted_at"
    ]

    for (const field of agentAllowedFields) {
      if (body[field] !== undefined) {
        if (field === "next_follow_up" || field === "last_contacted_at") {
          update[field] = body[field] ? new Date(body[field]) : null
        } else {
          update[field] = body[field]
        }
      }
    }

    const result = await db.collection("leads").updateOne(
      { _id: objectId },
      { $set: update }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Lead updated successfully" })
  } catch (error) {
    console.error("[v0] Error updating lead:", error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }
}
