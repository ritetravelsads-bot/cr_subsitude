import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import {
  sendEmail,
  quoteAdminTemplate,
  quoteUserTemplate,
} from "@/lib/email"

const COMPANY_EMAIL = process.env.SMTP_USER || "countryroof.infobirth@gmail.com"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, email, phone, serviceType, propertyType, roofSize, urgency, details } = body

    // Validate required fields
    if (!name || !email || !phone || !serviceType || !propertyType) {
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
    const result = await db.collection("quotes").insertOne({
      name,
      email,
      phone,
      serviceType,
      propertyType,
      roofSize: roofSize || "",
      urgency: urgency || "",
      details: details || "",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Send email to admin
    await sendEmail({
      to: COMPANY_EMAIL,
      subject: `New Quote Request: ${serviceType}`,
      html: quoteAdminTemplate({
        name,
        email,
        phone,
        serviceType,
        propertyType,
        roofSize,
        urgency,
        details,
      }),
    })

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: `Your quote request has been received - Country Roof`,
      html: quoteUserTemplate({
        name,
        serviceType,
      }),
    })

    return NextResponse.json({
      success: true,
      message: "Quote request submitted successfully",
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Quote API] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    )
  }
}
