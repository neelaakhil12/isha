import { Shield, Hammer, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions governing the use of SMTP, extraction, and marketing services at Isha Software Solutions.",
};

export default function TermsOfServicePage() {
  const points = [
    {
      title: "1. Acceptance of Terms",
      desc: "By initiating an account, logging in, or accessing any service provided by Isha Software Solutions, you enter a legally binding agreement to comply with these Terms of Service."
    },
    {
      title: "2. Account Management & Credentials",
      desc: "Users must deliver accurate, current information at signup. You are solely responsible for maintaining the privacy of your account credentials and system keys."
    },
    {
      title: "3. Software License Scope",
      desc: "We grant account holders a limited, non-exclusive, non-transferable, and revocable license to access our email software, dashboard utilities, and system APIs."
    },
    {
      title: "4. Billing, Subscriptions & Renewals",
      desc: "Services are charged on an advance subscription basis. Failed transactions, payment delays, or credit card chargebacks will trigger immediate resource suspensions."
    },
    {
      title: "5. Anti-Spam Guidelines & Regulations",
      desc: "Every email campaign dispatched must strictly conform to CAN-SPAM, GDPR, local legal regulations, and our Spam Policy. Sending unsolicited bulk emails is strictly prohibited."
    },
    {
      title: "6. User Content & Transmission Liability",
      desc: "Users retain complete ownership of uploaded newsletters, template designs, and sent messages. Isha Software Solutions holds no liability for the content sent through our relays."
    },
    {
      title: "7. Prohibited Usage & Security Abuse",
      desc: "Transmitting malware, phishing redirects, spyware, or illegal files using our SMTP networks is strictly forbidden and will result in immediate law enforcement referral."
    },
    {
      title: "8. Sending Limits & Overages",
      desc: "Daily and monthly email credit limits are set per pricing plan. Overage dispatches will be blocked or subject to supplementary billing charges."
    },
    {
      title: "9. Infrastructure Fair Use Policy",
      desc: "We monitor database queries and SMTP latency. Accounts exerting an excessive load on shared server nodes may experience automated speed restrictions or temporary blocks."
    },
    {
      title: "10. Service Modification & Maintenance",
      desc: "We reserve the right to alter features, update server nodes, adjust APIs, or deploy system maintenance pauses at any time, with or without prior notice."
    },
    {
      title: "11. Limitation of Liability",
      desc: "Isha Software Solutions is not liable for direct, indirect, incidental, or exemplary damages, including lost revenue, delivery delays, or list database loss."
    },
    {
      title: "12. Indemnification Clause",
      desc: "You agree to indemnify, defend, and hold harmless Isha Software Solutions from any legal claims, liabilities, or expenses arising from your sent campaigns."
    },
    {
      title: "13. Account Termination & Closure",
      desc: "We reserve the right to restrict, suspend, or permanently terminate user console access without notice if we detect breach of policies or suspicious activity."
    },
    {
      title: "14. Governing Law & Jurisdiction",
      desc: "These Terms of Service are governed by and construed under the laws of India. Any litigation must be processed exclusively in courtrooms located in Hyderabad, India."
    },
    {
      title: "15. Terms Revision & Updates",
      desc: "We reserve the right to revise these Terms of Service at our sole discretion. Continued usage of our email systems constitutes full acceptance of the updated terms."
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
            Terms of Service
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Please read these Terms of Service carefully before utilizing our bulk email application, SMTP relays, or extraction tools.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-12 shadow-sm mb-8">
          <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-8">
            <span className="text-xs text-slate-400 font-black uppercase tracking-wider">
              Document Code: TOS-2026
            </span>
            <span className="text-xs text-slate-400 font-black uppercase tracking-wider">
              Last Updated: June 2026
            </span>
          </div>

          <div className="space-y-8">
            {points.map((pt, idx) => {
              return (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary flex items-center justify-center font-black text-sm">
                    {idx + 1}
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

        {/* Warning callout panel */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-accent/10" />
          <h2 className="text-xl font-bold mb-2 relative z-10">Have questions about our terms of service?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6 relative z-10">
            For inquiries regarding compliance, enterprise sending limits, or SLA details, please contact our support team.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary hover:bg-slate-50 font-bold px-6 py-3 rounded-full text-sm shadow-md hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 relative z-10 cursor-pointer"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
