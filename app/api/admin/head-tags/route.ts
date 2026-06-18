import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET all head tags
export async function GET() {
  try {
    const db = await connectDB()
    
    const tags = await db
      .collection("head_tags")
      .find({})
      .sort({ created_at: -1 })
      .toArray()
    
    const serializedTags = tags.map(tag => ({
      ...tag,
      _id: tag._id.toString(),
    }))
    
    return NextResponse.json(serializedTags)
  } catch (error) {
    console.error("Error fetching head tags:", error)
    return NextResponse.json({ error: "Failed to fetch head tags" }, { status: 500 })
  }
}

// POST create new head tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tag_content, tag_type, description, is_active } = body
    
    // Validate the tag content
    if (!tag_content || typeof tag_content !== "string") {
      return NextResponse.json({ error: "Tag content is required" }, { status: 400 })
    }
    
    // Check if it's a valid HTML tag (basic validation)
    const trimmedTag = tag_content.trim()
    if (!trimmedTag.startsWith("<") || !trimmedTag.endsWith(">")) {
      return NextResponse.json({ error: "Invalid HTML tag format. Must start with < and end with >" }, { status: 400 })
    }
    
    // Check for self-closing tags or proper closing
    const isSelfClosing = trimmedTag.endsWith("/>") || 
      trimmedTag.match(/<(meta|link|base|br|hr|img|input|col|area|embed|keygen|param|source|track|wbr)\s/i)
    
    if (!isSelfClosing) {
      // Check if it has proper opening and closing tags
      const tagNameMatch = trimmedTag.match(/<(\w+)/)
      if (tagNameMatch) {
        const tagName = tagNameMatch[1]
        const hasClosing = trimmedTag.includes(`</${tagName}>`)
        if (!hasClosing && !trimmedTag.endsWith("/>")) {
          return NextResponse.json({ 
            error: `Tag appears to be incomplete. Make sure it has a proper closing tag </${tagName}> or is self-closing` 
          }, { status: 400 })
        }
      }
    }
    
    const db = await connectDB()
    
    // Check for duplicate tags
    const existingTag = await db.collection("head_tags").findOne({ tag_content: trimmedTag })
    if (existingTag) {
      return NextResponse.json({ error: "This tag already exists" }, { status: 400 })
    }
    
    const newTag = {
      tag_content: trimmedTag,
      tag_type: tag_type || "meta",
      description: description || "",
      is_active: is_active !== false,
      created_at: new Date(),
      updated_at: new Date(),
    }
    
    const result = await db.collection("head_tags").insertOne(newTag)
    
    return NextResponse.json({ 
      ...newTag, 
      _id: result.insertedId.toString() 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating head tag:", error)
    return NextResponse.json({ error: "Failed to create head tag" }, { status: 500 })
  }
}
