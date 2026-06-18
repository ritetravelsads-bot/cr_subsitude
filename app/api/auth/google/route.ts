import { MongoClient } from "mongodb"
import { cookies } from "next/headers"

const mongoUrl = process.env.MONGODB_URI || ""

interface GoogleAuthPayload {
  idToken: string
  email: string
  displayName: string
  photoURL: string | null
  uid: string
  userType?: "customer" | "agent"
}

async function handleGoogleAuth(payload: GoogleAuthPayload) {
  if (!mongoUrl) {
    throw new Error("MongoDB URI not configured")
  }

  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    const db = client.db("countryroof")
    const collection = db.collection("users")

    // Check if user already exists by email or firebase UID
    let user = await collection.findOne({
      $or: [
        { email: payload.email.toLowerCase() },
        { firebase_uid: payload.uid }
      ]
    })

    if (user) {
      // User exists - update their info and last login
      await collection.updateOne(
        { _id: user._id },
        {
          $set: {
            last_login: new Date(),
            firebase_uid: payload.uid,
            // Update profile picture if not set or if it's from Google
            ...((!user.profile_picture || user.profile_picture.includes("googleusercontent.com")) && payload.photoURL
              ? { profile_picture: payload.photoURL }
              : {}),
            // Update display name if username was generated
            ...(user.username?.startsWith("google_") && payload.displayName
              ? { username: payload.displayName.toLowerCase().replace(/\s+/g, "_") }
              : {}),
          },
        }
      )
      
      // Refresh user data after update
      user = await collection.findOne({ _id: user._id })
    } else {
      // New user - create account
      const username = payload.displayName
        ? payload.displayName.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString(36)
        : "google_" + payload.uid.substring(0, 8)

      const newUser = {
        username,
        email: payload.email.toLowerCase(),
        password: null, // No password for Google auth users
        phone_number: null,
        user_type: payload.userType || "customer",
        profile_picture: payload.photoURL,
        date_joined: new Date(),
        last_login: new Date(),
        firebase_uid: payload.uid,
        auth_provider: "google",
        is_verified: true, // Google accounts are pre-verified
      }

      const result = await collection.insertOne(newUser)
      user = { ...newUser, _id: result.insertedId }
    }

    // Create session token - user is guaranteed to be non-null here
    const currentUser = user!
    const token = Buffer.from(
      JSON.stringify({ userId: currentUser._id, email: currentUser.email })
    ).toString("base64")

    return {
      id: currentUser._id,
      email: currentUser.email,
      username: currentUser.username,
      user_type: currentUser.user_type,
      profile_picture: currentUser.profile_picture,
      token,
      isNewUser: !currentUser.last_login || (Date.now() - new Date(currentUser.date_joined).getTime() < 5000),
    }
  } finally {
    await client.close()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { idToken, email, displayName, photoURL, uid, userType } = body

    if (!email || !uid) {
      return new Response(
        JSON.stringify({ error: "Missing required Google auth data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const user = await handleGoogleAuth({
      idToken,
      email,
      displayName,
      photoURL,
      uid,
      userType,
    })

    // Set secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("auth_token", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: user.isNewUser
          ? "Account created successfully"
          : "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          user_type: user.user_type,
          profile_picture: user.profile_picture,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Google auth error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Google authentication failed"

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
