import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectDB()
    const { propertyId } = await request.json()

    const sectionsCollection = db.collection("homepage_sections")
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any }
    await sectionsCollection.updateOne(filter, { $addToSet: { properties: propertyId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error adding property:", error)
    return NextResponse.json({ error: "Failed to add property" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; propertyId?: string }> }
) {
  try {
    const { id, propertyId: paramPropertyId } = await params
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectDB()
    const propertyId = paramPropertyId || new URL(request.url).searchParams.get("propertyId")

    const sectionsCollection = db.collection("homepage_sections")
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any }
    await sectionsCollection.updateOne(filter, { $pull: { properties: propertyId } as any })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error removing property:", error)
    return NextResponse.json({ error: "Failed to remove property" }, { status: 500 })
  }
}
