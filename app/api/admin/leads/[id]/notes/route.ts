import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import type { NextRequest } from "next/server"

// POST add a note to a lead
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.user_type !== "admin" && user.user_type !== "agent")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { content } = body

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Note content is required" }, { status: 400 })
    }

    const db = await getDatabase()

    let leadObjectId: ObjectId
    try {
      leadObjectId = new ObjectId(id)
    } catch {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 })
    }

    // Check if lead exists and user has access
    const lead = await db.collection("leads").findOne({ _id: leadObjectId })
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Agents can only add notes to leads assigned to them or owned by them
    if (user.user_type === "agent") {
      const hasAccess = lead.assigned_to === user._id || lead.property_owner_id === user._id
      if (!hasAccess) {
        return NextResponse.json({ error: "Unauthorized - Lead not accessible" }, { status: 403 })
      }
    }

    const note = {
      content: content.trim(),
      created_by: user._id,
      created_by_type: user.user_type as "admin" | "agent",
      created_by_name: user.username || user.email,
      created_at: new Date(),
    }

    const result = await db.collection("leads").updateOne(
      { _id: leadObjectId },
      { 
        $push: { notes: note } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        $set: { updated_at: new Date() }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Failed to add note" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Note added successfully",
      note,
    })
  } catch (error) {
    console.error("[v0] Error adding note:", error)
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 })
  }
}
