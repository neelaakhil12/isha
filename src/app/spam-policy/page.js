'use client';

import { Shield, AlertTriangle, AlertCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SpamPolicyPage() {
  const sections = [
    {
      id: "messaging",
      title: "1. Anti-Spam & Messaging Rules",
      icon: Shield,
      color: "text-primary bg-primary/5 border-primary/20",
      items: [
        "We do not allow unsolicited or bulk promotional messages (spam).",
        "Users must not send misleading, deceptive, or fraudulent content.",
        "Any attempt to impersonate individuals, organizations, or brands is prohibited."
      ]
    },
    {
      id: "content",
      title: "2. Content & Search Integrity",
      icon: FileText,
      color: "text-secondary bg-secondary/5 border-secondary/20",
      items: [
        "Content must be original and provide genuine value to users.",
        "Duplicate, copied, or automatically generated content intended to manipulate rankings is not allowed.",
        "Keyword stuffing and excessive use of irrelevant keywords are prohibited.",
        "Hidden text, cloaking, and deceptive SEO practices are not permitted."
      ]
    },
    {
      id: "security",
      title: "3. Platform Security & Abuse Prevention",
      icon: AlertCircle,
      color: "text-highlight bg-highlight/5 border-highlight/20",
      items: [
        "Automated bots or scripts used to generate fake traffic are prohibited.",
        "Any form of phishing, malware, or harmful software distribution is strictly forbidden.",
        "Link schemes, paid links, or artificial backlink generation are prohibited.",
        "Fake reviews, testimonials, or user interactions are not allowed."
      ]
    },
    {
      id: "compliance",
      title: "4. Compliance & Enforcement",
      icon: AlertTriangle,
      color: "text-accent bg-accent/5 border-accent/20",
      items: [
        "Users must comply with all applicable laws and regulations while using the website.",
        "We reserve the right to remove spam content without prior notice.",
        "Accounts or users involved in spam activities may be suspended or permanently blocked.",
        "We may update this Spam Policy at any time to maintain a safe and trustworthy platform for all users."
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-slate-900 to-accent/15" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="text-primary font-bold text-xs tracking-widest uppercase py-1.5 px-4 bg-primary/15 border border-primary/25 rounded-full">
            Platform Policies
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-5 mb-4">
            Anti-Spam & Content Policy
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Review the policies and regulations governing communication, content generation, and search practices on Isha Software Solutions.
          </p>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Left Sidebar Table of Contents */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                <span>Navigation</span>
              </h3>
              <nav className="space-y-1.5">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block text-slate-500 hover:text-primary hover:bg-primary/5 transition-all py-2 px-3 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
              <div className="border-t border-slate-100 pt-4 mt-6 text-xs text-slate-400 font-bold flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Last Updated: June 2026</span>
              </div>
            </div>
          </aside>

          {/* Right Policy Document Content */}
          <main className="col-span-1 lg:col-span-3 space-y-8">
            
            {/* Header intro card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Introduction & Purpose</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                At Isha Software Solutions, we are dedicated to maintaining a safe, trustworthy, and compliant platform for all our customers and visitors. We have established this Spam Policy to outline prohibited practices related to email transmission, marketing services, lead generation, and content integrity.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                By using our platform, services, or tools, you explicitly agree to adhere to the restrictions and requirements outlined below.
              </p>
            </div>

            {/* Policy Sections */}
            {sections.map((sec) => {
              const IconComponent = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm scroll-mt-24"
                >
                  <div className="flex items-center space-x-3.5 mb-6 pb-4 border-b border-slate-100">
                    <div className={`p-2.5 rounded-xl border ${sec.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-black text-slate-800">
                      {sec.title}
                    </h2>
                  </div>

                  <ul className="space-y-4">
                    {sec.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-highlight shrink-0 mr-3 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            {/* Violation & Warning Box */}
            <div className="bg-gradient-to-r from-red-500/10 via-accent/5 to-transparent border border-red-500/20 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-red-500/15 border border-red-500/20 rounded-2xl text-red-500 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-red-950 mb-2">Policy Violation & Enforcement</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    Violation of this Spam Policy is considered a breach of our Terms of Service. Accounts found engaging in spam transmission, automated crawler abuse, malicious link generation, or cloaking will be subject to immediate administrative actions.
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
                    <li>Immediate removal of violating content without prior notice.</li>
                    <li>Suspension or permanent blocking of the associated client account.</li>
                    <li>Referral to law enforcement officials in cases of fraud or malware distribution.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile Footer Date */}
            <div className="lg:hidden text-center text-xs text-slate-400 font-bold py-4">
              <span>Last Updated: June 2026</span>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
