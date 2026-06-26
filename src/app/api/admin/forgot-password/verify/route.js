import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { verifyOTP } from '../../../../../lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ishasoftware.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpass123';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'isha_admin_fallback_secret';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: 'This email is not authorized as an administrator.' },
        { status: 403 }
      );
    }

    // Verify OTP using shared memory store
    const isValid = verifyOTP(ADMIN_EMAIL, otp);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    // Sign a short-lived admin JWT session token
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      ADMIN_JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Save session cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return NextResponse.json({
      success: true,
      message: 'Access granted successfully.',
      password: ADMIN_PASSWORD,
    });
  } catch (error) {
    console.error('Error verifying admin recovery OTP:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during verification.' },
      { status: 500 }
    );
  }
}
