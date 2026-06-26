import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../../../lib/supabase';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'palamakularaju@gmail.com';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'isha_admin_fallback_secret';

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

    // Try fetching credentials from database settings
    let activeEmail = ADMIN_EMAIL;
    try {
      const { data } = await supabase.from('admin_settings').select('value').eq('key', 'admin_email').maybeSingle();
      if (data?.value) {
        activeEmail = data.value;
      }
    } catch (dbErr) {
      console.warn('Could not query admin_email from DB, using fallback.', dbErr.message);
    }

    if (email.toLowerCase() !== activeEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'This email is not authorized as an administrator.' },
        { status: 403 }
      );
    }

    // Sign a short-lived password reset token (15 mins)
    const token = jwt.sign(
      { email: activeEmail, purpose: 'admin-password-reset' },
      ADMIN_JWT_SECRET,
      { expiresIn: '15m' }
    );

    const origin = request.nextUrl.origin;
    const resetLink = `${origin}/admin/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Isha Software Solutions" <${process.env.SMTP_USER}>`,
      to: activeEmail,
      subject: `Admin Password Reset Link`,
      text: `Click the link to reset your administrator password: ${resetLink}. This link is valid for 15 minutes.`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px; color: #1e293b; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #3b82f6; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Isha Software Solutions</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px; font-weight: 500;">Admin Panel Password Recovery</p>
          </div>
          
          <div style="border-bottom: 1px solid #f1f5f9; margin-bottom: 32px;"></div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 24px;">Hello Admin,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            We received a request to reset the administrator password for the Isha Software Solutions dashboard. Click the secure button below to choose a new password:
          </p>
          
          <div style="text-align: center; margin: 36px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 15px; font-weight: bold; border-radius: 14px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);">
              Reset Administrator Password
            </a>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 24px; text-align: center;">
            If the button above does not work, copy and paste this link in your browser URL bar:<br/>
            <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
          </p>
          
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px; text-align: center;">
            This password reset link is valid for <strong>15 minutes</strong>. If you did not request this, you can safely ignore this email.
          </p>
          
          <div style="border-bottom: 1px solid #f1f5f9; margin-top: 32px; margin-bottom: 24px;"></div>
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
            © Isha Software Solutions. All rights reserved.<br />
            Restricted Admin Area.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`[ADMIN AUTH] Password reset link sent to ${activeEmail}`);

    return NextResponse.json({ success: true, message: 'Password reset link sent successfully.' });
  } catch (error) {
    console.error('Error sending admin recovery link:', error);
    return NextResponse.json(
      { error: 'Failed to send reset link. Please check your system SMTP settings.' },
      { status: 500 }
    );
  }
}

