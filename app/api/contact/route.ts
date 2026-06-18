import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import {
  sendEmail,
  contactAdminTemplate,
  contactUserTemplate,
} from "@/lib/email"

const COMPANY_EMAIL = process.env.SMTP_USER || "countryroof.infobirth@gmail.com"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
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

    // Save to MongoDB
    const db = await getDatabase()
    const result = await db.collection("contacts").insertOne({
      name,
      email,
      phone: phone || "",
      subject,
      message,
      status: "new",
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Send email to admin
    await sendEmail({
      to: COMPANY_EMAIL,
      subject: `New Contact Form: ${subject}`,
      html: contactAdminTemplate({ name, email, phone, subject, message }),
    })

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: `Thank you for contacting Country Roof`,
      html: contactUserTemplate({ name, subject }),
    })

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Contact API] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    )
  }
}
