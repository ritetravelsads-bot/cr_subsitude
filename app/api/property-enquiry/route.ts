import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import {
  sendEmail,
  propertyEnquiryAdminTemplate,
  propertyEnquiryUserTemplate,
} from "@/lib/email"
import type { LeadSource } from "@/lib/models"

const COMPANY_EMAIL = process.env.SMTP_USER || "countryroof.infobirth@gmail.com"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { 
      name, 
      email, 
      phone, 
      message, 
      property_id, 
      property_name,
      property_slug,
      company_name,
      team_size,
      enquiry_type,
      source_url,
      budget_min,
      budget_max,
      preferred_bhk,
      preferred_location,
    } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      )
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        )
      }
    }

    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      )
    }

    // Save enquiry to database
    const db = await getDatabase()
    const enquiry = {
      name,
      email: email || "",
      phone,
      message: message || "",
      property_id: property_id || "",
      property_name: property_name || "",
      property_slug: property_slug || "",
      company_name: company_name || "",
      team_size: team_size || "",
      enquiry_type: enquiry_type || "property",
      source: enquiry_type === "office_space" ? "office_space_detail_page" : "property_detail_page",
      status: "new",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection("enquiries").insertOne(enquiry)

    // Get property owner info if property_id is provided
    let propertyOwnerId: string | null = null
    let propertyOwnerType: "admin" | "agent" = "admin"
    
    if (property_id) {
      try {
        const property = await db.collection("properties").findOne({ 
          _id: new ObjectId(property_id) 
        })
        if (property && property.agent) {
          propertyOwnerId = property.agent
          propertyOwnerType = "agent"
        }
      } catch {
        // Invalid property ID, continue without owner info
      }
    }

    // Create a lead record for tracking
    const leadSource: LeadSource = enquiry_type === "office_space" 
      ? "property_enquiry" 
      : "property_enquiry"
    
    const lead = {
      name,
      email: email || "",
      phone,
      message: message || "",
      property_id: property_id || null,
      property_name: property_name || null,
      property_slug: property_slug || null,
      source: leadSource,
      source_url: source_url || null,
      property_owner_id: propertyOwnerId,
      property_owner_type: propertyOwnerType,
      status: "new" as const,
      priority: "medium" as const,
      notes: [],
      budget_min: budget_min ? Number(budget_min) : null,
      budget_max: budget_max ? Number(budget_max) : null,
      preferred_bhk: preferred_bhk ? Number(preferred_bhk) : null,
      preferred_location: preferred_location || null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // Insert lead into leads collection
    await db.collection("leads").insertOne(lead)

    // Send email notification to admin
    await sendEmail({
      to: COMPANY_EMAIL,
      subject: `New Property Enquiry: ${property_name || "General"}`,
      html: propertyEnquiryAdminTemplate({
        name,
        email,
        phone,
        message,
        property_name,
        property_slug,
      }),
    })

    // Send confirmation email to user if email provided
    if (email) {
      await sendEmail({
        to: email,
        subject: `Thank you for your enquiry - Country Roof`,
        html: propertyEnquiryUserTemplate({
          name,
          property_name,
          property_slug,
        }),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Property Enquiry API] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    )
  }
}
