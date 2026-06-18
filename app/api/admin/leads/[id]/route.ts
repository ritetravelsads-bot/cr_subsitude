import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import type { NextRequest } from "next/server"

// GET single lead by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
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

    // Get owner details if available
    let owner = null
    if (lead.property_owner_id) {
      try {
        owner = await db.collection("users").findOne({ 
          _id: new ObjectId(lead.property_owner_id) 
        }, { projection: { password: 0 } })
        if (owner) {
          owner = { ...owner, _id: owner._id.toString() }
        }
      } catch {
        // Invalid owner ID
      }
    }

    // Get assignee details if available
    let assignee = null
    if (lead.assigned_to) {
      try {
        assignee = await db.collection("users").findOne({ 
          _id: new ObjectId(lead.assigned_to) 
        }, { projection: { password: 0 } })
        if (assignee) {
          assignee = { ...assignee, _id: assignee._id.toString() }
        }
      } catch {
        // Invalid assignee ID
      }
    }

    return NextResponse.json({
      ...lead,
      _id: lead._id.toString(),
      property,
      owner,
      assignee,
    })
  } catch (error) {
    console.error("[v0] Error fetching lead:", error)
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 })
  }
}

// PUT update lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
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

    // Build update object (only allow specific fields)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: any = {
      updated_at: new Date(),
    }

    const allowedFields = [
      "name", "email", "phone", "message", "status", "priority",
      "budget_min", "budget_max", "preferred_bhk", "preferred_location",
      "next_follow_up", "last_contacted_at"
    ]

    for (const field of allowedFields) {
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

// DELETE lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
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

    const result = await db.collection("leads").deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Lead deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting lead:", error)
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 })
  }
}
