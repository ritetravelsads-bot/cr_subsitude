import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "agent") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const tickets = await db
      .collection("tickets")
      .find({ user_id: user._id?.toString() })
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("[v0] Error fetching agent tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "agent") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { subject, description, priority, category } = body

    if (!subject || !description) {
      return NextResponse.json({ error: "Subject and description are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const ticket = {
      user_id: user._id?.toString(),
      customer_name: user.username || user.email,
      customer_email: user.email,
      subject,
      description,
      category: category || "general",
      priority: priority || "medium",
      status: "open",
      replies: [],
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection("tickets").insertOne(ticket)

    return NextResponse.json({ success: true, ticket_id: result.insertedId })
  } catch (error) {
    console.error("[v0] Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
