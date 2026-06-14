import { Outfit } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL('https://ishasoftwaresolution.com'),
  title: {
    default: "Isha Software Solutions | Premium Email Marketing & SMTP Platform",
    template: "%s | Isha Software Solutions"
  },
  description: "Powerful email marketing platform for growing businesses. Automate marketing tasks, send high deliverability campaigns, SMTP relays, and transactional emails.",
  keywords: ["email marketing", "SMTP service", "transactional email", "email extractor", "list management", "automated campaigns", "bulk email"],
  authors: [{ name: "Isha Software Solutions" }],
  creator: "Isha Software Solutions",
  publisher: "Isha Software Solutions",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Isha Software Solutions | Premium Email Marketing & SMTP Platform",
    description: "Powerful email marketing platform for growing businesses. Automate marketing tasks, send high deliverability campaigns, SMTP relays, and transactional emails.",
    url: "https://ishasoftwaresolution.com",
    siteName: "Isha Software Solutions",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isha Software Solutions | Premium Email Marketing & SMTP Platform",
    description: "Powerful email marketing platform for growing businesses. Automate marketing tasks, send high deliverability campaigns, SMTP relays, and transactional emails.",
  },
  verification: {
    google: "YOUR_GSC_VERIFICATION_CODE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased overflow-x-hidden w-full max-w-[100vw]`}>
      <body className="min-h-full flex flex-col bg-bg-custom text-text-dark selection:bg-accent selection:text-white overflow-x-hidden w-full max-w-[100vw]">
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        
        {/* Organization Structured Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Isha Software Solutions",
              "url": "https://ishasoftwaresolution.com",
              "logo": "https://ishasoftwaresolution.com/logo.png",
              "description": "Powerful email marketing platform for growing businesses. Automate marketing tasks, send high deliverability campaigns, SMTP relays, and transactional emails.",
            }),
          }}
        />

        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
