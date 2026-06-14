import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyOTP, signToken } from '../../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const isValid = verifyOTP(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    // Set user session payload
    const userPayload = {
      email: email.toLowerCase(),
      name: email.split('@')[0],
      provider: 'email',
    };

    // Sign the JWT token
    const token = signToken(userPayload);

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: userPayload,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during verification.' },
      { status: 500 }
    );
  }
}
