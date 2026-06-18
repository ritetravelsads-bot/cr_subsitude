import nodemailer from "nodemailer"

// Company email configuration
const COMPANY_EMAIL = "info@countryroof.in"
const COMPANY_NAME = "CountryRoof"
const COMPANY_PHONE = "+91 9873702365"
const COMPANY_WEBSITE = process.env.NEXT_PUBLIC_BASE_URL || "https://countryroof.in"

// Create transporter
export function getEmailTransporter() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    console.warn("[Email] SMTP credentials not configured")
    return null
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  })
}

// Base email template wrapper
function emailWrapper(content: string, previewText?: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${previewText ? `<meta name="x-apple-disable-message-reformatting">` : ""}
  <title>${COMPANY_NAME}</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px 40px; text-align: center; }
    .header img { max-width: 180px; height: auto; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px; }
    .content { padding: 40px; }
    .content h2 { color: #1e3a5f; font-size: 22px; margin: 0 0 20px 0; font-weight: 600; }
    .content p { color: #4a5568; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0; }
    .info-box { background-color: #f8fafc; border-left: 4px solid #1e3a5f; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; font-size: 13px; font-weight: 500; min-width: 120px; }
    .info-value { color: #1e293b; font-size: 14px; font-weight: 600; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .cta-button:hover { opacity: 0.9; }
    .highlight-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
    .highlight-box h3 { color: #92400e; font-size: 18px; margin: 0 0 8px 0; }
    .highlight-box p { color: #a16207; margin: 0; font-size: 14px; }
    .footer { background-color: #1e293b; padding: 32px 40px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 13px; margin: 0 0 12px 0; line-height: 1.6; }
    .footer a { color: #60a5fa; text-decoration: none; }
    .social-links { margin: 20px 0; }
    .social-links a { display: inline-block; margin: 0 8px; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 24px 0; }
    @media only screen and (max-width: 600px) {
      .content { padding: 24px !important; }
      .header { padding: 24px !important; }
      .footer { padding: 24px !important; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ""}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <div class="email-container">
          <div class="header">
            <h1>${COMPANY_NAME}</h1>
            <p>Your Trusted Real Estate Partner</p>
          </div>
          ${content}
          <div class="footer">
            <p><strong>${COMPANY_NAME}</strong></p>
            <p>Gurugram, Haryana, India</p>
            <p>Phone: <a href="tel:${COMPANY_PHONE}">${COMPANY_PHONE}</a></p>
            <p>Email: <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a></p>
            <p>Website: <a href="${COMPANY_WEBSITE}">${COMPANY_WEBSITE}</a></p>
            <div class="divider"></div>
            <p style="font-size: 11px; color: #64748b;">
              This email was sent by ${COMPANY_NAME}. If you have any questions, please contact us at ${COMPANY_EMAIL}.
            </p>
            <p style="font-size: 11px; color: #64748b;">
              &copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// Email templates

// 1. Contact Form - Admin Notification
export function contactAdminTemplate(data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  const content = `
    <div class="content">
      <h2>New Contact Form Submission</h2>
      <p>You have received a new contact form submission from your website.</p>
      
      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr class="info-row">
            <td class="info-label">Name</td>
            <td class="info-value">${data.name}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Email</td>
            <td class="info-value"><a href="mailto:${data.email}" style="color: #1e3a5f;">${data.email}</a></td>
          </tr>
          ${data.phone ? `
          <tr class="info-row">
            <td class="info-label">Phone</td>
            <td class="info-value"><a href="tel:${data.phone}" style="color: #1e3a5f;">${data.phone}</a></td>
          </tr>
          ` : ""}
          <tr class="info-row">
            <td class="info-label">Subject</td>
            <td class="info-value">${data.subject}</td>
          </tr>
        </table>
      </div>
      
      <p><strong>Message:</strong></p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 12px;">
        <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
      </div>
      
      <div class="divider"></div>
      <p style="font-size: 13px; color: #64748b;">Received on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
    </div>
  `
  return emailWrapper(content, `New contact from ${data.name}: ${data.subject}`)
}

// 2. Contact Form - User Confirmation
export function contactUserTemplate(data: { name: string; subject: string }) {
  const content = `
    <div class="content">
      <h2>Thank You for Contacting Us!</h2>
      <p>Dear <strong>${data.name}</strong>,</p>
      <p>Thank you for reaching out to ${COMPANY_NAME}. We have received your message regarding "<strong>${data.subject}</strong>" and our team will get back to you within 24-48 hours.</p>
      
      <div class="highlight-box">
        <h3>What's Next?</h3>
        <p>Our dedicated team is reviewing your inquiry and will respond with personalized assistance.</p>
      </div>
      
      <p>In the meantime, feel free to explore our website for the latest properties and services:</p>
      
      <p style="text-align: center;">
        <a href="${COMPANY_WEBSITE}/properties" class="cta-button">Browse Properties</a>
      </p>
      
      <div class="divider"></div>
      
      <p>If you have any urgent queries, please don't hesitate to call us at <a href="tel:${COMPANY_PHONE}" style="color: #1e3a5f; font-weight: 600;">${COMPANY_PHONE}</a>.</p>
      
      <p>Best regards,<br><strong>The ${COMPANY_NAME} Team</strong></p>
    </div>
  `
  return emailWrapper(content, `Thank you for contacting ${COMPANY_NAME}`)
}

// 3. Property Enquiry - Admin Notification
export function propertyEnquiryAdminTemplate(data: {
  name: string
  email?: string
  phone: string
  message?: string
  property_name?: string
  property_slug?: string
}) {
  const propertyUrl = data.property_slug ? `${COMPANY_WEBSITE}/properties/${data.property_slug}` : null

  const content = `
    <div class="content">
      <h2>New Property Enquiry</h2>
      <p>A potential buyer has shown interest in one of your properties.</p>
      
      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr class="info-row">
            <td class="info-label">Name</td>
            <td class="info-value">${data.name}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Phone</td>
            <td class="info-value"><a href="tel:${data.phone}" style="color: #1e3a5f; font-weight: 600;">${data.phone}</a></td>
          </tr>
          ${data.email ? `
          <tr class="info-row">
            <td class="info-label">Email</td>
            <td class="info-value"><a href="mailto:${data.email}" style="color: #1e3a5f;">${data.email}</a></td>
          </tr>
          ` : ""}
          ${data.property_name ? `
          <tr class="info-row">
            <td class="info-label">Property</td>
            <td class="info-value">${data.property_name}</td>
          </tr>
          ` : ""}
        </table>
      </div>
      
      ${data.message ? `
      <p><strong>Message:</strong></p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 12px;">
        <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
      </div>
      ` : ""}
      
      ${propertyUrl ? `
      <p style="text-align: center; margin-top: 24px;">
        <a href="${propertyUrl}" class="cta-button">View Property</a>
      </p>
      ` : ""}
      
      <div class="divider"></div>
      <p style="font-size: 13px; color: #64748b;">Received on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
    </div>
  `
  return emailWrapper(content, `New enquiry for ${data.property_name || "property"} from ${data.name}`)
}

// 4. Property Enquiry - User Confirmation
export function propertyEnquiryUserTemplate(data: {
  name: string
  property_name?: string
  property_slug?: string
}) {
  const propertyUrl = data.property_slug ? `${COMPANY_WEBSITE}/properties/${data.property_slug}` : null

  const content = `
    <div class="content">
      <h2>Thank You for Your Enquiry!</h2>
      <p>Dear <strong>${data.name}</strong>,</p>
      <p>Thank you for your interest in ${data.property_name ? `<strong>${data.property_name}</strong>` : "our property"}. Our property experts will contact you within 2 hours to discuss your requirements.</p>
      
      <div class="highlight-box">
        <h3>Your Enquiry Has Been Received</h3>
        <p>Our team is ready to assist you with site visits, pricing details, and investment guidance.</p>
      </div>
      
      ${propertyUrl ? `
      <p style="text-align: center;">
        <a href="${propertyUrl}" class="cta-button">View Property Details</a>
      </p>
      ` : ""}
      
      <div class="divider"></div>
      
      <p><strong>Why Choose ${COMPANY_NAME}?</strong></p>
      <ul style="color: #4a5568; font-size: 14px; line-height: 2;">
        <li>100% Verified Properties</li>
        <li>Expert Investment Guidance</li>
        <li>Free Site Visit Assistance</li>
        <li>Best Price Guarantee</li>
      </ul>
      
      <p>For immediate assistance, call us at <a href="tel:${COMPANY_PHONE}" style="color: #1e3a5f; font-weight: 600;">${COMPANY_PHONE}</a>.</p>
      
      <p>Best regards,<br><strong>The ${COMPANY_NAME} Team</strong></p>
    </div>
  `
  return emailWrapper(content, `Thank you for your interest in ${data.property_name || "our property"}`)
}

// 5. Service Enquiry - Admin Notification
export function serviceEnquiryAdminTemplate(data: {
  name: string
  email: string
  phone: string
  service_name: string
  preferred_contact?: string
  message?: string
}) {
  const content = `
    <div class="content">
      <h2>New Service Enquiry</h2>
      <p>A customer has requested information about your services.</p>
      
      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr class="info-row">
            <td class="info-label">Service</td>
            <td class="info-value" style="color: #1e3a5f;">${data.service_name}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Name</td>
            <td class="info-value">${data.name}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Phone</td>
            <td class="info-value"><a href="tel:${data.phone}" style="color: #1e3a5f; font-weight: 600;">${data.phone}</a></td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Email</td>
            <td class="info-value"><a href="mailto:${data.email}" style="color: #1e3a5f;">${data.email}</a></td>
          </tr>
          ${data.preferred_contact ? `
          <tr class="info-row">
            <td class="info-label">Preferred Contact</td>
            <td class="info-value">${data.preferred_contact}</td>
          </tr>
          ` : ""}
        </table>
      </div>
      
      ${data.message ? `
      <p><strong>Requirements:</strong></p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 12px;">
        <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
      </div>
      ` : ""}
      
      <div class="divider"></div>
      <p style="font-size: 13px; color: #64748b;">Received on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
    </div>
  `
  return emailWrapper(content, `New ${data.service_name} enquiry from ${data.name}`)
}

// 6. Service Enquiry - User Confirmation
export function serviceEnquiryUserTemplate(data: {
  name: string
  service_name: string
}) {
  const content = `
    <div class="content">
      <h2>Thank You for Your Interest!</h2>
      <p>Dear <strong>${data.name}</strong>,</p>
      <p>Thank you for your enquiry about our <strong>${data.service_name}</strong> services. Our dedicated team of experts will contact you within 24 hours to provide a personalized consultation.</p>
      
      <div class="highlight-box">
        <h3>Free Consultation Confirmed</h3>
        <p>A specialist will reach out to understand your requirements and provide tailored solutions.</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${COMPANY_WEBSITE}/services" class="cta-button">Explore All Services</a>
      </p>
      
      <div class="divider"></div>
      
      <p><strong>Our Services Include:</strong></p>
      <ul style="color: #4a5568; font-size: 14px; line-height: 2;">
        <li>Home Loans & Financing</li>
        <li>Legal Assistance</li>
        <li>NRI Services</li>
        <li>Investment Advisory</li>
        <li>After-Sales Support</li>
      </ul>
      
      <p>Need immediate assistance? Call us at <a href="tel:${COMPANY_PHONE}" style="color: #1e3a5f; font-weight: 600;">${COMPANY_PHONE}</a>.</p>
      
      <p>Best regards,<br><strong>The ${COMPANY_NAME} Team</strong></p>
    </div>
  `
  return emailWrapper(content, `Your ${data.service_name} consultation request has been received`)
}

// 7. Quote Request - Admin Notification
export function quoteAdminTemplate(data: {
  name: string
  email: string
  phone: string
  serviceType: string
  propertyType: string
  roofSize?: string
  urgency?: string
  details?: string
}) {
  const content = `
    <div class="content">
      <h2>New Quote Request</h2>
      <p>A customer has requested a quote for your services.</p>
      
      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr class="info-row">
            <td class="info-label">Name</td>
            <td class="info-value">${data.name}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Email</td>
            <td class="info-value"><a href="mailto:${data.email}" style="color: #1e3a5f;">${data.email}</a></td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Phone</td>
            <td class="info-value"><a href="tel:${data.phone}" style="color: #1e3a5f; font-weight: 600;">${data.phone}</a></td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Service Type</td>
            <td class="info-value">${data.serviceType}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Property Type</td>
            <td class="info-value">${data.propertyType}</td>
          </tr>
          ${data.roofSize ? `
          <tr class="info-row">
            <td class="info-label">Roof Size</td>
            <td class="info-value">${data.roofSize}</td>
          </tr>
          ` : ""}
          ${data.urgency ? `
          <tr class="info-row">
            <td class="info-label">Urgency</td>
            <td class="info-value">${data.urgency}</td>
          </tr>
          ` : ""}
        </table>
      </div>
      
      ${data.details ? `
      <p><strong>Additional Details:</strong></p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 12px;">
        <p style="margin: 0; white-space: pre-wrap;">${data.details}</p>
      </div>
      ` : ""}
      
      <div class="divider"></div>
      <p style="font-size: 13px; color: #64748b;">Received on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
    </div>
  `
  return emailWrapper(content, `New quote request from ${data.name} for ${data.serviceType}`)
}

// 8. Quote Request - User Confirmation
export function quoteUserTemplate(data: {
  name: string
  serviceType: string
}) {
  const content = `
    <div class="content">
      <h2>Quote Request Received!</h2>
      <p>Dear <strong>${data.name}</strong>,</p>
      <p>Thank you for requesting a quote for <strong>${data.serviceType}</strong>. Our team will review your requirements and send you a detailed quote within 24-48 hours.</p>
      
      <div class="highlight-box">
        <h3>What Happens Next?</h3>
        <p>Our expert will analyze your requirements and prepare a customized quote with competitive pricing.</p>
      </div>
      
      <p style="text-align: center;">
        <a href="${COMPANY_WEBSITE}" class="cta-button">Explore Our Services</a>
      </p>
      
      <div class="divider"></div>
      
      <p>For urgent inquiries, please call us at <a href="tel:${COMPANY_PHONE}" style="color: #1e3a5f; font-weight: 600;">${COMPANY_PHONE}</a>.</p>
      
      <p>Best regards,<br><strong>The ${COMPANY_NAME} Team</strong></p>
    </div>
  `
  return emailWrapper(content, `Your quote request for ${data.serviceType} has been received`)
}

// 9. Welcome Email - New User Registration
export function welcomeUserTemplate(data: {
  name: string
  email: string
  user_type: string
}) {
  const dashboardUrl = data.user_type === "agent"
    ? `${COMPANY_WEBSITE}/agent/dashboard`
    : `${COMPANY_WEBSITE}/buyer/dashboard`

  const content = `
    <div class="content">
      <h2>Welcome to ${COMPANY_NAME}!</h2>
      <p>Dear <strong>${data.name}</strong>,</p>
      <p>Congratulations! Your account has been successfully created. We're thrilled to have you as part of the ${COMPANY_NAME} family.</p>
      
      <div class="highlight-box">
        <h3>Account Created Successfully</h3>
        <p>You can now access exclusive features and personalized services.</p>
      </div>
      
      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr class="info-row">
            <td class="info-label">Email</td>
            <td class="info-value">${data.email}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Account Type</td>
            <td class="info-value" style="text-transform: capitalize;">${data.user_type}</td>
          </tr>
        </table>
      </div>
      
      <p style="text-align: center;">
        <a href="${dashboardUrl}" class="cta-button">Go to Dashboard</a>
      </p>
      
      <div class="divider"></div>
      
      <p><strong>What You Can Do Now:</strong></p>
      <ul style="color: #4a5568; font-size: 14px; line-height: 2;">
        <li>Browse and save favorite properties</li>
        <li>Get personalized property recommendations</li>
        <li>Schedule site visits with ease</li>
        <li>Access exclusive deals and offers</li>
        <li>Track your enquiries and interactions</li>
      </ul>
      
      <p>If you have any questions or need assistance, our support team is here to help at <a href="mailto:${COMPANY_EMAIL}" style="color: #1e3a5f;">${COMPANY_EMAIL}</a>.</p>
      
      <p>Welcome aboard!<br><strong>The ${COMPANY_NAME} Team</strong></p>
    </div>
  `
  return emailWrapper(content, `Welcome to ${COMPANY_NAME}, ${data.name}!`)
}

// 10. Welcome Email - Admin Notification for New User
export function newUserAdminTemplate(data: {
  name: string
  email: string
  phone: string
  user_type: string
}) {
  const content = `
    <div class="content">
      <h2>New User Registration</h2>
      <p>A new user has registered on the platform.</p>
      
      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr class="info-row">
            <td class="info-label">Name</td>
            <td class="info-value">${data.name}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Email</td>
            <td class="info-value"><a href="mailto:${data.email}" style="color: #1e3a5f;">${data.email}</a></td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Phone</td>
            <td class="info-value"><a href="tel:${data.phone}" style="color: #1e3a5f;">${data.phone}</a></td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Account Type</td>
            <td class="info-value" style="text-transform: capitalize;">${data.user_type}</td>
          </tr>
          <tr class="info-row">
            <td class="info-label">Registered At</td>
            <td class="info-value">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
          </tr>
        </table>
      </div>
      
      <p style="text-align: center;">
        <a href="${COMPANY_WEBSITE}/admin/users" class="cta-button">View Users</a>
      </p>
    </div>
  `
  return emailWrapper(content, `New ${data.user_type} registration: ${data.name}`)
}

// Send email helper function
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  const transporter = getEmailTransporter()

  if (!transporter) {
    console.warn("[Email] Skipping email - SMTP not configured")
    return { success: false, error: "SMTP not configured" }
  }

  try {
    const result = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    })

    console.log("[Email] Sent successfully:", { to, subject, messageId: result.messageId })
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("[Email] Failed to send:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
