'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SplashScreen from '@/components/SplashScreen';
import AosInit from '@/components/AosInit';

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <SplashScreen />}
      <AosInit />
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? 'w-full' : 'flex-grow'}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}
