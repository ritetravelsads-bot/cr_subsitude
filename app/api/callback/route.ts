import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

const COMPANY_EMAIL = process.env.SMTP_USER || "countryroof.infobirth@gmail.com"

// Email template for admin notification
function callbackAdminTemplate({ name, phone, message }: { name: string; phone: string; message: string }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #002366 0%, #003d99 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                    📞 New Callback Request
                  </h1>
                  <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">
                    Urgent: Customer waiting for callback
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 14px;">
                      ⚡ Priority: Please call back within 30 minutes
                    </p>
                  </div>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 10px;">
                        <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Customer Name</p>
                        <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${name}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 15px; background-color: #ecfdf5; border-radius: 8px; border: 2px solid #10b981;">
                        <p style="margin: 0 0 5px 0; color: #064e3b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📱 Phone Number</p>
                        <a href="tel:${phone}" style="margin: 0; color: #059669; font-size: 20px; font-weight: 700; text-decoration: none;">${phone}</a>
                      </td>
                    </tr>
                  </table>
                  
                  ${message && message !== "Callback request from footer form" ? `
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                        <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                        <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6;">${message}</p>
                      </td>
                    </tr>
                  </table>
                  ` : ''}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #64748b; font-size: 12px;">
                    This callback request was submitted via the Country Roof website footer form.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, message, source } = body

    // Validate required fields - only name and phone required for callback
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      )
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\d\s+\-()]{10,}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      )
    }

    // Save to MongoDB
    const db = await getDatabase()
    const result = await db.collection("callbacks").insertOne({
      name,
      phone,
      message: message || "Callback request",
      source: source || "footer_callback",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    })

    // Send email notification to admin
    await sendEmail({
      to: COMPANY_EMAIL,
      subject: `🔔 New Callback Request from ${name}`,
      html: callbackAdminTemplate({ name, phone, message: message || "" }),
    })

    return NextResponse.json({
      success: true,
      message: "Callback request submitted successfully",
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("[Callback API] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit callback request" },
      { status: 500 }
    )
  }
}
