// app/api/send-eoi/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_name, user_phone, user_email, configuration } = body;

    // 1. Configure the SMTP transporter using your environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 2. Email sent to YOU (The lead notification)
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Sends it to your own inbox
      subject: `New EOI Lead: ${user_name} - Sunteck Beach Residences`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">New Expression of Interest (EOI)</h2>
          <p><strong>Name:</strong> ${user_name}</p>
          <p><strong>Phone:</strong> ${user_phone}</p>
          <p><strong>Email:</strong> ${user_email}</p>
          <p><strong>Configuration:</strong> ${configuration}</p>
        </div>
      `,
    };

    // 3. Email sent to the USER (Confirmation)
    const userMailOptions = {
      from: process.env.SMTP_USER,
      to: user_email,
      subject: `Thank you for your interest in Sunteck Beach Residences`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #b49a5b;">Sunteck Beach Residences</h2>
          <p>Dear ${user_name},</p>
          <p>Thank you for registering your Expression of Interest (EOI).</p>
          <p>Our luxury consultant will contact you shortly at <strong>${user_phone}</strong> regarding the ₹2 Lakh refundable EOI process for the ${configuration} configuration.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Oceanopolis Team</strong></p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}