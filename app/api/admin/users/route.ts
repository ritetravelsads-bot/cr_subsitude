import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import type { NextRequest } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const users = await db.collection("users")
      .find({})
      .project({
        _id: 1,
        username: 1,
        email: 1,
        phone_number: 1,
        user_type: 1,
        created_at: 1,
        date_joined: 1,
        is_verified: 1
      })
      .sort({ created_at: -1, date_joined: -1 })
      .toArray()

    // Convert ObjectId to string for all users
    const serializedUsers = users.map(u => ({
      ...u,
      _id: u._id.toString()
    }))

    return NextResponse.json(serializedUsers)
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user exists and is not an admin
    let objectId: ObjectId
    try {
      objectId = new ObjectId(userId)
    } catch {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const targetUser = await db.collection("users").findOne({ _id: objectId })
    
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (targetUser.user_type === "admin") {
      return NextResponse.json({ error: "Cannot delete admin users" }, { status: 403 })
    }

    // Delete the user
    await db.collection("users").deleteOne({ _id: objectId })

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
