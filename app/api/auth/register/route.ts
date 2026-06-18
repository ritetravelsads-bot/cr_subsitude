import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import {
  sendEmail,
  welcomeUserTemplate,
  newUserAdminTemplate,
} from "@/lib/email"

const COMPANY_EMAIL = process.env.SMTP_USER || "countryroof.infobirth@gmail.com"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, phone_number, user_type } = body

    // Validate required fields
    if (!username || !email || !password || !phone_number) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection("users")

    // Check if user exists
    const existingUser = await collection.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userType = user_type || "customer"
    const result = await collection.insertOne({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone_number,
      user_type: userType,
      date_joined: new Date(),
      profile_picture: null,
    })

    // Send welcome email to user
    await sendEmail({
      to: email,
      subject: `Welcome to Country Roof!`,
      html: welcomeUserTemplate({
        name: username,
        email,
        user_type: userType,
      }),
    })

    // Send notification to admin
    await sendEmail({
      to: COMPANY_EMAIL,
      subject: `New User Registration: ${username}`,
      html: newUserAdminTemplate({
        name: username,
        email,
        phone: phone_number,
        user_type: userType,
      }),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: result.insertedId,
          username,
          email,
          user_type: userType,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Register API] Error:", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
