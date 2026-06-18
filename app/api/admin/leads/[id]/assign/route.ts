import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import type { NextRequest } from "next/server"

// POST assign lead to an agent
export async function POST(
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
    const { agent_id } = body

    if (!agent_id) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Validate lead ID
    let leadObjectId: ObjectId
    try {
      leadObjectId = new ObjectId(id)
    } catch {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 })
    }

    // Validate agent ID and check if user is an agent
    let agentObjectId: ObjectId
    try {
      agentObjectId = new ObjectId(agent_id)
    } catch {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 })
    }

    const agent = await db.collection("users").findOne({ 
      _id: agentObjectId,
      user_type: "agent"
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Check if lead exists
    const lead = await db.collection("leads").findOne({ _id: leadObjectId })
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Update lead with assignment
    const result = await db.collection("leads").updateOne(
      { _id: leadObjectId },
      { 
        $set: {
          assigned_to: agent_id,
          assigned_by: user._id,
          assigned_at: new Date(),
          updated_at: new Date(),
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Failed to assign lead" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Lead assigned to ${agent.username || agent.email}`,
      assigned_to: agent_id,
      assigned_at: new Date(),
    })
  } catch (error) {
    console.error("[v0] Error assigning lead:", error)
    return NextResponse.json({ error: "Failed to assign lead" }, { status: 500 })
  }
}

// DELETE unassign lead from agent
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

    let leadObjectId: ObjectId
    try {
      leadObjectId = new ObjectId(id)
    } catch {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 })
    }

    const result = await db.collection("leads").updateOne(
      { _id: leadObjectId },
      { 
        $unset: {
          assigned_to: "",
          assigned_by: "",
          assigned_at: "",
        },
        $set: {
          updated_at: new Date(),
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Lead unassigned successfully",
    })
  } catch (error) {
    console.error("[v0] Error unassigning lead:", error)
    return NextResponse.json({ error: "Failed to unassign lead" }, { status: 500 })
  }
}
