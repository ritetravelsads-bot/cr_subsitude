import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET single head tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    const db = await connectDB()
    
    const tag = await db.collection("head_tags").findOne({ _id: new ObjectId(id) })
    
    if (!tag) {
      return NextResponse.json({ error: "Head tag not found" }, { status: 404 })
    }
    
    return NextResponse.json({ ...tag, _id: tag._id.toString() })
  } catch (error) {
    console.error("Error fetching head tag:", error)
    return NextResponse.json({ error: "Failed to fetch head tag" }, { status: 500 })
  }
}

// PUT update head tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    const { tag_content, tag_type, description, is_active } = body
    
    // Validate the tag content if provided
    if (tag_content) {
      const trimmedTag = tag_content.trim()
      if (!trimmedTag.startsWith('<') || !trimmedTag.endsWith('>')) {
        return NextResponse.json({ error: "Invalid HTML tag format" }, { status: 400 })
      }
    }
    
    const db = await connectDB()
    
    const updateData: Record<string, any> = {
      updated_at: new Date(),
    }
    
    if (tag_content !== undefined) updateData.tag_content = tag_content.trim()
    if (tag_type !== undefined) updateData.tag_type = tag_type
    if (description !== undefined) updateData.description = description
    if (is_active !== undefined) updateData.is_active = is_active
    
    const result = await db.collection("head_tags").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Head tag not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: "Head tag updated" })
  } catch (error) {
    console.error("Error updating head tag:", error)
    return NextResponse.json({ error: "Failed to update head tag" }, { status: 500 })
  }
}

// DELETE head tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    const db = await connectDB()
    
    const result = await db.collection("head_tags").deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Head tag not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: "Head tag deleted" })
  } catch (error) {
    console.error("Error deleting head tag:", error)
    return NextResponse.json({ error: "Failed to delete head tag" }, { status: 500 })
  }
}
