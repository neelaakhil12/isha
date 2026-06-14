import { Send, Server, Zap, Search, CheckCircle2, ArrowRight, Code, ShieldAlert, Activity, Filter, Key } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: "Premium Email Services & SMTP Relay",
  description: "Explore our enterprise bulk email services, high-deliverability SMTP relays, real-time transactional emails, and powerful web-based email extractor tools.",
};

const serviceDetails = [
  {
    id: "bulk",
    name: "Bulk Email Service",
    icon: Send,
    description: "Launch large-scale promotional and informational newsletters to your subscribers. Our platform manages contacts list hygiene, automatic bounce processing, and provides interactive layout tools.",
    features: [
      "High deliverability optimization with dedicated IP pools",
      "Interactive drag-and-drop newsletter builder",
      "Automated list segmentation and subscriber hygiene",
      "Real-time stats: opens, click-throughs, and unsubscribes",
      "Auto-scheduling and delivery throttle pacing controls",
      "Built-in spam testing and inbox placement preview",
      "Automatic bounce and complaint handling workflows",
      "Personalization merge tags and dynamic content blocks",
      "Subscription web forms and popups generator",
      "Dynamic A/B testing for subject lines and layouts"
    ],
    techSpecs: [
      { label: "IP Options", value: "Shared Pools or Dedicated IPs" },
      { label: "List Import", value: "CSV, JSON, Excel files" },
      { label: "Design Tools", value: "WYSIWYG or Custom HTML Code" }
    ],
    color: "from-primary to-accent",
    glow: "shadow-primary/10"
  },
  {
    id: "smtp",
    name: "SMTP Service",
    icon: Server,
    description: "Connect your existing software, CRMs (WordPress, Salesforce, HubSpot), or custom web apps directly to our high-reputation servers. We handle the complex email transmission infrastructure.",
    features: [
      "Secure authentication protocols (SSL/TLS support)",
      "High scalability to process millions of transactions daily",
      "RESTful sending APIs and developer-friendly SDKs",
      "Dedicated IP warm-up support from deliverability engineers",
      "Real-time SMTP relay monitoring and uptime alerts",
      "Detailed SPF, DKIM, and DMARC record setup guidance",
      "Custom tracking domains for links and open tracking",
      "Elastic queue management with automatic retry protocols",
      "Multiple port compatibility (25, 465, 587, 2525, etc.)",
      "Detailed log inspection and error code analysis tools"
    ],
    techSpecs: [
      { label: "Ports Supported", value: "25, 587, 465, 2525" },
      { label: "Security Protocols", value: "TLS 1.3, SSL, SPF, DKIM, DMARC" },
      { label: "API Latency", value: "< 120ms average" }
    ],
    color: "from-secondary to-accent",
    glow: "shadow-secondary/10"
  },
  {
    id: "transactional",
    name: "Transactional Email",
    icon: Zap,
    description: "Deliver account confirmations, password resets, checkout invoices, and security OTP tokens without delay. We prioritize these messages on distinct high-priority server blocks.",
    features: [
      "Instant email routing under 2 seconds to major providers",
      "Dynamic template variables for billing and invoicing",
      "Event webhooks for delivery, bounce, open, and click alerts",
      "Priority sending queues isolated from promotional emails",
      "Secure TLS encryption for all outbound mail transactions",
      "Detailed trace logging for checking individual receipt statuses",
      "Multi-tenant sub-accounts for staging and production testing",
      "Automatic fallback to secondary relay lines on latency peaks",
      "IP reputation monitoring and suppression list defense",
      "API key access controls and restricted permission scopes"
    ],
    techSpecs: [
      { label: "Average Send Time", value: "under 1.5 seconds" },
      { label: "Webhook Events", value: "Bounces, Spams, Clicks, Delivers" },
      { label: "Fallback Protocol", value: "Automatic SMTP/API Failover" }
    ],
    color: "from-highlight to-primary",
    glow: "shadow-highlight/10"
  },
  {
    id: "extractor",
    name: "Email Extractor Tool",
    icon: Search,
    description: "Scan websites, target search terms, and extract contact directories to construct business lead structures. Features sorting systems that exclude junk and trap email domains.",
    features: [
      "Targeted lead extraction based on search keywords",
      "Recursive domain and website contact scanner",
      "Smart duplicate filtration and catch-all detection",
      "Multi-threaded parsing engine processing pages per second",
      "Structured data output in CSV, XLSX, and JSON formats",
      "Intelligent social profile link discovery (LinkedIn, Twitter)",
      "Advanced regex-based custom filter configuration",
      "Automated text parsing from text documents and web pages",
      "Proxy rotation compatibility for uninterrupted scanning",
      "Scheduled extraction queues with email status checks"
    ],
    techSpecs: [
      { label: "Extraction Formats", value: "CSV, XLSX, plain text" },
      { label: "Filter Level", value: "Custom exclusions & domain exclusions" },
      { label: "Accuracy", value: "98% valid business email parsing" }
    ],
    color: "from-accent to-secondary",
    glow: "shadow-accent/10"
  }
];

const iconMap = {
  "Bulk Email Service": Send,
  "SMTP Service": Server,
  "Transactional Email": Zap,
  "Email Extractor Tool": Search,
};

const techSpecsMap = {
  "Bulk Email Service": [
    { label: "IP Options", value: "Shared Pools or Dedicated IPs" },
    { label: "List Import", value: "CSV, JSON, Excel files" },
    { label: "Design Tools", value: "WYSIWYG or Custom HTML Code" }
  ],
  "SMTP Service": [
    { label: "Ports Supported", value: "25, 587, 465, 2525" },
    { label: "Security Protocols", value: "TLS 1.3, SSL, SPF, DKIM, DMARC" },
    { label: "API Latency", value: "< 120ms average" }
  ],
  "Transactional Email": [
    { label: "Average Send Time", value: "under 1.5 seconds" },
    { label: "Webhook Events", value: "Bounces, Spams, Clicks, Delivers" },
    { label: "Fallback Protocol", value: "Automatic SMTP/API Failover" }
  ],
  "Email Extractor Tool": [
    { label: "Extraction Formats", value: "CSV, XLSX, plain text" },
    { label: "Filter Level", value: "Custom exclusions & domain exclusions" },
    { label: "Accuracy", value: "98% valid business email parsing" }
  ]
};

export default async function Services() {
  let displayServices = serviceDetails;
  try {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      displayServices = data.map(s => ({
        id: s.id,
        name: s.name,
        icon: iconMap[s.name] || Send,
        description: s.description,
        features: s.features,
        techSpecs: techSpecsMap[s.name] || [],
        color: s.color,
        href: s.href,
        image_url: s.image_url
      }));
    }
  } catch (err) {
    console.error('Error fetching services:', err);
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Isha Software Solutions Services",
    "numberOfItems": "4",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Service",
          "name": "Bulk Email Service",
          "description": "Send thousands of emails instantly with advanced campaign management, analytics, scheduling, and delivery optimization tools.",
          "provider": {
            "@type": "Organization",
            "name": "Isha Software Solutions",
            "url": "https://ishasoftwaresolution.com"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Service",
          "name": "SMTP Service",
          "description": "Reliable SMTP relay servers with secure authentication, fast email delivery, scalability, and enterprise-grade email sending infrastructure.",
          "provider": {
            "@type": "Organization",
            "name": "Isha Software Solutions",
            "url": "https://ishasoftwaresolution.com"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Service",
          "name": "Transactional Email",
          "description": "Deliver automated transactional emails such as OTPs, invoices, password resets, notifications, and order confirmations with high reliability.",
          "provider": {
            "@type": "Organization",
            "name": "Isha Software Solutions",
            "url": "https://ishasoftwaresolution.com"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Service",
          "name": "Email Extractor Tool",
          "description": "Extract targeted business emails and generate high-quality leads using intelligent filtering and advanced extraction technology.",
          "provider": {
            "@type": "Organization",
            "name": "Isha Software Solutions",
            "url": "https://ishasoftwaresolution.com"
          }
        }
      }
    ]
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Page Header */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden rounded-b-[50px] md:rounded-b-[80px]">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-secondary font-bold text-xs tracking-widest uppercase py-1 px-3.5 bg-secondary/15 rounded-full mb-4 inline-block">
            Our Offerings
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-secondary bg-clip-text text-transparent">
            Our Enterprise Email Services
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed">
            Reliable deliverability, powerful list building tools, and high-performance server relays tailored for your company.
          </p>
        </div>
      </section>

      {/* Main Service Sections */}
      <section className="py-12">
        {displayServices.map((service, index) => {
          const Icon = service.icon;
          const isEven = index % 2 === 0;

          return (
            <div 
              id={service.id} 
              key={service.id} 
              className={`py-24 border-b border-slate-100 scroll-mt-24 ${isEven ? 'bg-white' : 'bg-slate-50'}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}>
                  {/* Text Content */}
                  <div 
                    className={`lg:col-span-7 ${!isEven ? 'lg:order-2' : ''}`}
                    data-aos={isEven ? "fade-right" : "fade-left"}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${service.color} flex items-center justify-center text-white shadow-lg ${service.glow}`}>
                        <Icon className="w-5 h-5 animate-pulse" />
                      </div>
                      <h2 className="text-3xl font-extrabold text-text-dark">
                        {service.name}
                      </h2>
                    </div>
                    
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-3.5 mb-8">
                      {service.features.map((feat, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-highlight mr-3 shrink-0 mt-0.5" />
                          <span className="text-slate-600 text-sm md:text-base font-semibold">{feat}</span>
                        </div>
                      ))}
                    </div>

                    <Link 
                      href="/contact" 
                      className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white font-bold px-8 py-3.5 rounded-full shadow-lg inline-flex items-center space-x-2 transition-all hover:scale-105`}
                    >
                      <span>Get Started with {service.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Technical Specs box / Image */}
                  <div 
                    className={`lg:col-span-5 ${!isEven ? 'lg:order-1' : ''}`}
                    data-aos={isEven ? "fade-left" : "fade-right"}
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white group hover:scale-[1.02] transition-transform duration-500">
                      <img 
                        src={
                          service.image_url ||
                          (service.id === 'bulk' || service.name === 'Bulk Email Service'
                            ? "/bulk_service.png" 
                            : service.id === 'smtp' || service.name === 'SMTP Service'
                              ? "/smtp_service.png" 
                              : service.id === 'transactional' || service.name === 'Transactional Email'
                                ? "/transactional_service.png"
                                : "/extractor_service.png")
                        } 
                        alt={`${service.name} Preview`} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Pricing CTA */}
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        {/* Glow backgrounds */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" data-aos="zoom-in">
          <span className="text-secondary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-secondary/15 rounded-full mb-4 inline-block">
            Pricing Plans
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Transparent Pricing Structured for Your Sending Goals
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Whether you are testing the waters with a small startup list or sending millions of alerts to global client hubs, we have packages tailored to you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-all inline-flex items-center space-x-2"
            >
              Request Custom Pricing Quote
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent text-white border border-white/30 hover:bg-white/10 font-bold px-8 py-4 rounded-full hover:scale-105 transition-all inline-flex items-center space-x-2"
            >
              Talk to Deliverability Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
