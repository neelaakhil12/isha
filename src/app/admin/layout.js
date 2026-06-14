/**
 * Admin-specific layout — intentionally excludes the global
 * Navbar, Footer, WhatsApp button, SplashScreen, and AOS init
 * that are injected by the root layout.
 *
 * In Next.js App Router, a nested layout.js REPLACES the parent
 * layout's <main> wrapper for this route segment only.
 * The root <html> / <body> shell is still provided by the root
 * layout, but none of the UI chrome components render here.
 */
export const metadata = {
  title: 'Admin Panel | Isha Software Solutions',
  description: 'Restricted administrator access — Isha Software Solutions',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    // Full-height, clean container — no padding, no chrome
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
