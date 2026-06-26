import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../../../lib/supabase';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'isha_admin_fallback_secret';

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Verify token validity
    let decoded;
    try {
      decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'The password reset link is invalid or has expired.' },
        { status: 400 }
      );
    }

    if (decoded.purpose !== 'admin-password-reset' || !decoded.email) {
      return NextResponse.json(
        { error: 'Invalid token purpose or payload.' },
        { status: 400 }
      );
    }

    // Update password in admin_settings table
    const { error: dbErr } = await supabase
      .from('admin_settings')
      .upsert({ 
        key: 'admin_password', 
        value: newPassword,
        updated_at: new Date().toISOString()
      });

    if (dbErr) {
      console.error('Database error updating admin password:', dbErr);
      return NextResponse.json(
        { error: 'Failed to save new password. Database query failed.' },
        { status: 500 }
      );
    }

    console.log(`[ADMIN AUTH] Password reset successfully for admin: ${decoded.email}`);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully.',
    });
  } catch (error) {
    console.error('Error during password reset execution:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during password reset.' },
      { status: 500 }
    );
  }
}
