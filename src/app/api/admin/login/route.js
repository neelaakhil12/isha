import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../../lib/supabase';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'palamakularaju@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpass123';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'isha_admin_fallback_secret';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Try fetching credentials from database settings
    let activeEmail = ADMIN_EMAIL;
    let activePassword = ADMIN_PASSWORD;

    try {
      const [emailRes, passRes] = await Promise.all([
        supabase.from('admin_settings').select('value').eq('key', 'admin_email').maybeSingle(),
        supabase.from('admin_settings').select('value').eq('key', 'admin_password').maybeSingle()
      ]);

      if (emailRes.data?.value) {
        activeEmail = emailRes.data.value;
      }
      if (passRes.data?.value) {
        activePassword = passRes.data.value;
      }
    } catch (dbErr) {
      console.warn('Could not query admin_settings from DB, using fallback credentials.', dbErr.message);
    }

    if (email.toLowerCase() !== activeEmail.toLowerCase() || password !== activePassword) {
      return NextResponse.json({ error: 'Invalid credentials. Access denied.' }, { status: 401 });
    }

    // Sign a short-lived admin JWT
    const token = jwt.sign(
      { email: activeEmail, role: 'admin' },
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
