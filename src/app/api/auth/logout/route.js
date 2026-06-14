import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    // Delete the session cookie
    cookieStore.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Immediately expires
    });

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during logout.' },
      { status: 500 }
    );
  }
}
