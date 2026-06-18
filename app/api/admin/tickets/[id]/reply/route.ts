import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDatabase()
    const body = await req.json()

    // Add reply to the replies array
    const reply = {
      id: new ObjectId().toString(),
      message: body.reply_message,
      sender_type: "admin",
      sender_name: user.username || "Admin",
      created_at: new Date(),
    }

    const result = await db.collection("tickets").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: body.status,
          updated_at: new Date(),
          admin_reply: body.reply_message, // Keep for backward compatibility
          replied_at: new Date(),
        },
        $push: { replies: reply } as any,
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error replying to ticket:", error)
    return NextResponse.json({ error: "Failed to reply to ticket" }, { status: 500 })
  }
}
