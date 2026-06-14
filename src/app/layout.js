import { Outfit } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Isha Software Solutions | Premium Email Marketing & SMTP Platform",
  description: "Powerful email marketing platform for growing businesses. Automate marketing tasks, send high deliverability campaigns, SMTP relays, and transactional emails.",
  keywords: "email marketing, SMTP service, transactional email, email extractor, list management, automated campaigns, bulk email",
  authors: [{ name: "Isha Software Solutions" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased overflow-x-hidden w-full max-w-[100vw]`}>
      <body className="min-h-full flex flex-col bg-bg-custom text-text-dark selection:bg-accent selection:text-white overflow-x-hidden w-full max-w-[100vw]">
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
