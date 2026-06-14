import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOTP, setOTP } from '../../../../../lib/auth';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for 587 (TLS upgrade)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    setOTP(email, otp);

    // Render a premium HTML template
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Isha Software Solutions" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Isha Login Verification Code: ${otp}`,
      text: `Your Isha authentication code is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px; color: #1e293b; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #3b82f6; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Isha Software Solutions</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px; font-weight: 500;">Secure Delivery Platform</p>
          </div>
          
          <div style="border-bottom: 1px solid #f1f5f9; margin-bottom: 32px;"></div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 24px;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            You requested a verification code to access your Isha cockpit dashboard. Use the code below to complete your sign-in:
          </p>
          
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); text-align: center; font-size: 38px; font-weight: 900; letter-spacing: 6px; padding: 24px; border-radius: 20px; margin: 32px 0; color: #0f172a; border: 1px solid #e2e8f0; font-family: monospace;">
            ${otp}
          </div>
          
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px; text-align: center;">
            This verification code is valid for <strong>5 minutes</strong>. If you did not request this verification, you can safely ignore this email.
          </p>
          
          <div style="border-bottom: 1px solid #f1f5f9; margin-top: 32px; margin-bottom: 24px;"></div>
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
            © Isha Software Solutions. All rights reserved.<br />
            Ensuring Secure Relays & Uncompromised Inbox Placement.
          </p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // For local development convenience, we also log the OTP
    console.log(`[AUTH SYSTEM] OTP sent to ${email}: ${otp}`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP email. Please verify your SMTP settings.' },
      { status: 500 }
    );
  }
}
