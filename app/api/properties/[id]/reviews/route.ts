import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await connectDB()
    const reviews = await db
      .collection("reviews")
      .find({ property: new ObjectId(id), is_approved: true })
      .toArray()

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("[v0] Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectDB()
    const body = await req.json()

    const result = await db.collection("reviews").insertOne({
      property: new ObjectId(id),
      user: new ObjectId(user._id),
      rating: body.rating,
      comment: body.comment,
      is_approved: false,
      created_at: new Date(),
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
