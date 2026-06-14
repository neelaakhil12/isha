import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ishasoftware.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpass123';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'isha_admin_fallback_secret';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials. Access denied.' }, { status: 401 });
    }

    // Sign a short-lived admin JWT
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      ADMIN_JWT_SECRET,
      { expiresIn: '8h' }
    );

    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
