'use client';

import Link from 'next/link';
import { Shield, Eye, Lock, Database, Info, FileText, ArrowRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const points = [
    {
      title: "1. Information Collection",
      desc: "We collect personal details such as your name, email address, and billing information when you register an account or initiate a subscription with us.",
      icon: Info
    },
    {
      title: "2. Usage Data & Logging",
      desc: "Our servers automatically log metadata (including IP addresses, browser types, and system activity) to monitor platform health and optimize service performance.",
      icon: Database
    },
    {
      title: "3. Recipient Data Security",
      desc: "All recipient email addresses and contact lists uploaded by users are fully encrypted and protected; we never sell, rent, or share your subscriber list data.",
      icon: Shield
    },
    {
      title: "4. Data Security Standards",
      desc: "We employ industry-standard encryption protocols (SSL/TLS) for data in transit and robust firewall technologies for data at rest to prevent unauthorized access.",
      icon: Lock
    },
    {
      title: "5. SMTP Delivery Logs",
      desc: "We record SMTP dispatch statistics (successful deliveries, bounces, opens, and clicks) to supply real-time tracking dashboard diagnostics for campaign owners.",
      icon: FileText
    },
    {
      title: "6. Cookie Usage Policy",
      desc: "Our platform uses cookies and session storage to maintain authentication states, track dashboard preferences, and secure client sessions.",
      icon: Eye
    },
    {
      title: "7. Third-Party Integrations",
      desc: "We share necessary details only with verified infrastructure providers (such as cloud hosting nodes and payment gateways) required to deliver our services.",
      icon: Info
    },
    {
      title: "8. Legal Compliance",
      desc: "We will disclose customer data only when legally compelled to do so by court orders, governmental investigations, or applicable law enforcement procedures.",
      icon: Shield
    },
    {
      title: "9. User Access Controls",
      desc: "Account holders maintain full authority to access, edit, export, or delete their profile information and campaign data via the client panel.",
      icon: Lock
    },
    {
      title: "10. Data Retention Term",
      desc: "We store user database elements as long as the associated subscription remains active. Inactive account databases are purged after a designated grace period.",
      icon: Database
    },
    {
      title: "11. Children's Privacy Protection",
      desc: "Our software suite is strictly designed for business operations; we do not deliberately collect data from or market to children under the age of 13.",
      icon: Eye
    },
    {
      title: "12. Opt-Out & Unsubscribe Rights",
      desc: "We provide clear unsubscribe mechanism templates for recipient lists. Account holders may also opt out of system alerts and marketing emails.",
      icon: FileText
    },
    {
      title: "13. Anonymized Analytics",
      desc: "We compile aggregated and anonymized email analytics data to study delivery trends, optimize routing pipelines, and compile industry benchmarks.",
      icon: Database
    },
    {
      title: "14. Cross-Border Data Routing",
      desc: "To guarantee low latency SMTP routing, campaign data and servers may be hosted and processed in secure data centers located internationally.",
      icon: Shield
    },
    {
      title: "15. Policy Modifications",
      desc: "We reserve the right to amend this Privacy Policy at any time. Active users will be notified of material changes through email alerts or console announcements.",
      icon: FileText
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-slate-900 to-accent/15" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="text-primary font-bold text-xs tracking-widest uppercase py-1.5 px-4 bg-primary/15 border border-primary/25 rounded-full">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-5 mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Please read our Privacy Policy carefully to understand how we collect, store, secure, and process your personal and campaign data.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm mb-8">
          <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-8">
            <span className="text-xs text-slate-400 font-black uppercase tracking-wider">
              Document Code: PP-2026
            </span>
            <span className="text-xs text-slate-400 font-black uppercase tracking-wider">
              Last Updated: June 2026
            </span>
          </div>

          <div className="space-y-8">
            {points.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base mb-1.5">{pt.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact panel */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-accent/10" />
          <h2 className="text-xl font-bold mb-2 relative z-10">Have questions about our data security practices?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6 relative z-10">
            For data inquiries, GDPR assistance, or data deletion requests, please contact our Data Protection Officer.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary hover:bg-slate-50 font-bold px-6 py-3 rounded-full text-sm shadow-md hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 relative z-10 cursor-pointer"
          >
            <span>Contact DPO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
