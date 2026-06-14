import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const payload = verifyToken(sessionCookie.value);

    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture || '',
        provider: payload.provider,
      },
    });
  } catch (error) {
    console.error('Error fetching session profile:', error);
    return NextResponse.json(
      { error: 'An error occurred checking session authorization.' },
      { status: 500 }
    );
  }
}
