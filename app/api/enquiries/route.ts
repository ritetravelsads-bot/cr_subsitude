import { getDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import {
  sendEmail,
  serviceEnquiryAdminTemplate,
  serviceEnquiryUserTemplate,
  propertyEnquiryAdminTemplate,
  propertyEnquiryUserTemplate,
} from "@/lib/email"

const COMPANY_EMAIL = process.env.SMTP_USER || "countryroof.infobirth@gmail.com"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { 
      name, 
      email, 
      phone, 
      message,
      preferredContact,
      enquiry_type,
      service_id,
      service_name,
      property_id,
      property_name,
      property_slug,
    } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      )
    }

    // Validate email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        )
      }
    }

    // Save enquiry to database
    const db = await getDatabase()
    const enquiry = {
      name,
      email: email || "",
      phone,
      message: message || "",
      preferred_contact: preferredContact || "phone",
      enquiry_type: enquiry_type || "general",
      service_id: service_id || "",
      service_name: service_name || "",
      property_id: property_id || "",
      property_name: property_name || "",
      property_slug: property_slug || "",
      status: "new",
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection("enquiries").insertOne(enquiry)

    // Send emails based on enquiry type
    if (enquiry_type === "service" && service_name) {
      // Service enquiry emails
      await sendEmail({
        to: COMPANY_EMAIL,
        subject: `New Service Enquiry: ${service_name}`,
        html: serviceEnquiryAdminTemplate({
          name,
          email: email || "",
          phone,
          service_name,
          preferred_contact: preferredContact,
          message,
        }),
      })

      if (email) {
        await sendEmail({
          to: email,
          subject: `Thank you for your ${service_name} enquiry - Country Roof`,
          html: serviceEnquiryUserTemplate({
            name,
            service_name,
          }),
        })
      }
    } else if (enquiry_type === "property" && property_name) {
      // Property enquiry emails
      await sendEmail({
        to: COMPANY_EMAIL,
        subject: `New Property Enquiry: ${property_name}`,
        html: propertyEnquiryAdminTemplate({
          name,
          email,
          phone,
          message,
          property_name,
          property_slug,
        }),
      })

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
    } else {
      // General enquiry emails
      await sendEmail({
        to: COMPANY_EMAIL,
        subject: `New General Enquiry from ${name}`,
        html: serviceEnquiryAdminTemplate({
          name,
          email: email || "",
          phone,
          service_name: "General Enquiry",
          preferred_contact: preferredContact,
          message,
        }),
      })

      if (email) {
        await sendEmail({
          to: email,
          subject: `Thank you for your enquiry - Country Roof`,
          html: serviceEnquiryUserTemplate({
            name,
            service_name: "our services",
          }),
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Enquiries API] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    )
  }
}
