import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'isha_admin_fallback_secret';

export const metadata = {
  title: 'Admin Panel | Isha Software Solutions',
  description: 'Isha Software Solutions Administrator Panel',
};

async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    if (!sessionCookie) return null;
    const payload = jwt.verify(sessionCookie.value, ADMIN_JWT_SECRET);
    return payload?.role === 'admin' ? payload : null;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) return <AdminLogin />;
  return <AdminDashboard adminEmail={session.email} />;
}
