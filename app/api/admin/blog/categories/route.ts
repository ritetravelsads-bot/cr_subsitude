import { MongoClient, ObjectId } from "mongodb"
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
      const collection = db.collection("blog_categories")

      const categories = await collection.find({}).sort({ name: 1 }).toArray()

      return new Response(
        JSON.stringify({
          categories: categories.map((cat) => ({
            ...cat,
            _id: cat._id.toString(),
          })),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
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
    const { name } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Category name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const client = new MongoClient(mongoUrl)

    try {
      await client.connect()
      const db = client.db("countryroof")
      const collection = db.collection("blog_categories")

      const slug = slugify(name.trim())

      // Check if category already exists
      const existingCategory = await collection.findOne({
        $or: [
          { name: { $regex: `^${name.trim()}$`, $options: "i" } },
          { slug: slug },
        ],
      })

      if (existingCategory) {
        return new Response(
          JSON.stringify({ error: "Category already exists" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      const result = await collection.insertOne({
        name: name.trim(),
        slug: slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return new Response(
        JSON.stringify({
          success: true,
          message: "Category created successfully",
          category: {
            _id: result.insertedId.toString(),
            name: name.trim(),
            slug: slug,
          },
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      )
    } finally {
      await client.close()
    }
  } catch (error) {
    console.error("[v0] Error creating blog category:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create category"
    const statusCode = errorMessage === "Unauthorized" ? 401 : 500

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()

    if (!mongoUrl) {
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return new Response(JSON.stringify({ error: "Category ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const client = new MongoClient(mongoUrl)

    try {
      await client.connect()
      const db = client.db("countryroof")
      const collection = db.collection("blog_categories")

      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount === 0) {
        return new Response(JSON.stringify({ error: "Category not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Category deleted successfully",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    } finally {
      await client.close()
    }
  } catch (error) {
    console.error("[v0] Error deleting blog category:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to delete category"
    const statusCode = errorMessage === "Unauthorized" ? 401 : 500

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    })
  }
}
