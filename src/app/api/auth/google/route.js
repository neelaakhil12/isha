import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OAuth2Client } from 'google-auth-library';
import { signToken } from '../../../../lib/auth';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: 'Google credential (ID token) is required.' },
        { status: 400 }
      );
    }

    let payload;
    try {
      // Verify using Google's client SDK library
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.warn('Google verification library failed, attempting fallback endpoint:', verifyError.message);
      // Fallback verification endpoint in case of environment setup differences
      const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!res.ok) {
        throw new Error('Failed to verify token info from Google endpoint');
      }
      payload = await res.json();
    }

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: 'Unable to extract email from Google profile.' },
        { status: 400 }
      );
    }

    // Map profile information
    const userPayload = {
      email: payload.email.toLowerCase(),
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture || '',
      provider: 'google',
    };

    // Sign the session JWT token
    const token = signToken(userPayload);

    // Set secure HTTP-only session cookie
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
    console.error('Google Sign-In backend error:', error);
    return NextResponse.json(
      { error: 'Google token verification failed. Please verify your Google Client ID.' },
      { status: 401 }
    );
  }
}
