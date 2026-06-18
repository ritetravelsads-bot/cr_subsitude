import { MongoClient } from "mongodb"
import { requireAdmin } from "@/lib/auth"

const mongoUrl = process.env.MONGODB_URI || ""

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Extract excerpt from HTML content - gets first paragraph text
function extractExcerptFromContent(htmlContent: string, maxLength: number = 200): string {
  if (!htmlContent) return ""
  
  // Remove HTML tags and get plain text
  let plainText = htmlContent
    // Remove script and style tags with their content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    // Replace block elements with newlines to preserve paragraph breaks
    .replace(/<\/(p|div|h[1-6]|li|br|hr)[^>]*>/gi, "\n")
    .replace(/<(p|div|h[1-6]|li|br|hr)[^>]*>/gi, "")
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Decode HTML entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Clean up whitespace
    .replace(/\s+/g, " ")
    .trim()
  
  // Get first paragraph (split by double newlines or just get first chunk)
  const paragraphs = plainText.split(/\n+/).filter(p => p.trim().length > 0)
  const firstParagraph = paragraphs[0] || plainText
  
  // Truncate to maxLength, ending at word boundary
  if (firstParagraph.length <= maxLength) {
    return firstParagraph
  }
  
  const truncated = firstParagraph.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "..."
}

export async function GET() {
  try {
    await requireAdmin()

    if (!mongoUrl) {
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const client = new MongoClient(mongoUrl)

    try {
      await client.connect()
      const db = client.db("countryroof")
      const collection = db.collection("blog_posts")

      const rawPosts = await collection.find({}).sort({ createdAt: -1 }).toArray()
      
      // Serialize MongoDB ObjectIds to strings
      const posts = rawPosts.map((post) => ({
        ...post,
        _id: post._id.toString(),
      }))

      return new Response(JSON.stringify({ posts }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      })
    } finally {
      await client.close()
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unauthorized"
    const statusCode = errorMessage === "Unauthorized" ? 401 : 500

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    if (!mongoUrl) {
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const body = await request.json()
    const {
      title,
      slug: customSlug,
      content,
      category,
      author,
      readTime,
      cover_image,
      banner_image,
      meta_title,
      meta_description,
      meta_keywords,
      og_title,
      og_description,
      og_image,
      tags,
      is_published,
      faqs,
      schema_markup,
    } = body

    if (!title || !content || !author) {
      return new Response(JSON.stringify({ error: "Missing required fields: title, content, and author are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
    
    // Auto-generate excerpt from content's first paragraph
    const excerpt = extractExcerptFromContent(content, 200)

    const client = new MongoClient(mongoUrl)

    try {
      await client.connect()
      const db = client.db("countryroof")
      const collection = db.collection("blog_posts")

      // Use custom slug if provided, otherwise generate from title
      const slug = customSlug ? customSlug.trim() : slugify(title)

      // Check for existing slug
      const existingPost = await collection.findOne({ slug })
      const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug

      // Handle category - support both string and array formats
      const categoryValue = Array.isArray(category) ? category : (category ? [category] : ["general"])

      const result = await collection.insertOne({
        title,
        slug: finalSlug,
        excerpt,
        content,
        category: categoryValue,
        author,
        readTime: Number.parseInt(readTime) || 5,
        read_time: Number.parseInt(readTime) || 5,
        cover_image: cover_image || null,
        banner_image: banner_image || null,
        meta_title: meta_title || title,
        meta_description: meta_description || excerpt.substring(0, 160),
        meta_keywords: meta_keywords || "",
        og_title: og_title || title,
        og_description: og_description || excerpt,
        og_image: og_image || banner_image || cover_image || null,
        tags: Array.isArray(tags) ? tags : [],
        faqs: Array.isArray(faqs) ? faqs : [],
        schema_markup: schema_markup || null,
        is_published: is_published !== false,
        published: is_published !== false,
        publication_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return new Response(
        JSON.stringify({
          success: true,
          message: "Blog post created successfully",
          id: result.insertedId,
          slug: finalSlug,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      )
    } finally {
      await client.close()
    }
  } catch (error) {
    console.error("[v0] Error creating blog post:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create blog post"
    const statusCode = errorMessage === "Unauthorized" ? 401 : 500

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    })
  }
}
