import Link from 'next/link';
import * as Lucide from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import StatsCounter from '@/components/StatsCounter';
import Testimonials from '@/components/Testimonials';
import FaqSection from '@/components/FaqSection';
import ServiceCard from '@/components/ServiceCard';
import { supabase } from '@/lib/supabase';

const services = [
  {
    name: "Bulk Email Service",
    iconName: "Send",
    description: "Send thousands of emails instantly with advanced campaign management, analytics, scheduling, and delivery optimization tools designed for businesses of all sizes.",
    features: ["High Delivery Rate", "Campaign Analytics", "Email Templates", "List Management", "Auto Scheduling"],
    color: "from-primary to-accent",
    href: "/services#bulk"
  },
  {
    name: "SMTP Service",
    iconName: "Server",
    description: "Reliable SMTP relay servers with secure authentication, fast email delivery, scalability, and enterprise-grade email sending infrastructure.",
    features: ["Secure SMTP Relay", "Fast Email Delivery", "API Integration", "Server Monitoring", "High Scalability"],
    color: "from-secondary to-accent",
    href: "/services#smtp"
  },
  {
    name: "Transactional Email",
    iconName: "Zap",
    description: "Deliver automated transactional emails such as OTPs, invoices, password resets, notifications, and order confirmations with high reliability.",
    features: ["Instant Delivery", "OTP Emails", "Order Notifications", "Real-Time Tracking", "Secure Delivery"],
    color: "from-highlight to-primary",
    href: "/services#transactional"
  },
  {
    name: "Email Extractor Tool",
    iconName: "Search",
    description: "Extract targeted business emails and generate high-quality leads using intelligent filtering and advanced extraction technology.",
    features: ["Lead Generation", "Domain Search", "Smart Filtering", "Export Data", "Fast Extraction"],
    color: "from-accent to-secondary",
    href: "/services#extractor"
  }
];

const whyChooseUs = [
  { title: "Fast & Secure Platform", desc: "Enterprise-grade security protocols alongside multi-node fast delivery networks.", icon: Lucide.ShieldCheck },
  { title: "High Email Deliverability", desc: "Engineered to bypass spam filters and land directly in user inboxes.", icon: Lucide.CheckCircle2 },
  { title: "Advanced Automation", desc: "Build intricate drip sequences and behavior-based automated emails.", icon: Lucide.Settings },
  { title: "Affordable Solutions", desc: "Pay for what you send. Flexible packages crafted to scale with your budget.", icon: Lucide.Coins },
  { title: "24/7 Dedicated Support", desc: "A team of expert system admins is ready to assist you at any time of day.", icon: Lucide.PhoneCall },
  { title: "Scalable Infrastructure", desc: "Elastic mail queues built to process millions of transactions without breaking.", icon: Lucide.Clock }
];

export const metadata = {
  title: "Premium Email Marketing & SMTP Platform",
  description: "Isha Software Solutions is a powerful email marketing platform and SMTP relay service designed to automate communication and improve deliverability.",
};

export default async function Home() {
  let displayServices = services;
  let heroSlides = [];
  let displayAbout = {
    badge: "About The Company",
    title: "Empowering Smart Businesses with Advanced Email Solutions",
    description_1: "Isha Software Solutions helps businesses automate communication, improve marketing performance, and scale customer engagement through powerful email technologies.",
    description_2: "Our infrastructure is built for high volume, secure delivery, and smart tracking. We focus on giving business owners and marketers absolute control over their outbound and transactional mailing systems, without vendor lock-ins or restrictive contacts billing.",
    link_text: "Read Our Mission Story",
    link_url: "/about",
    smtp_rate: "99.8%",
    sender_score: "98/100",
    queue_latency: "< 150ms",
    queue_latency_pct: "10"
  };
  let displayBenefits = null;
  let displayStats = null;
  let displayTestimonials = null;
  let displayFaqs = null;

  try {
    const [
      servicesRes, 
      slidesRes,
      aboutRes,
      benefitsRes,
      statsRes,
      testimonialsRes,
      faqsRes
    ] = await Promise.all([
      supabase.from('services').select('*').order('created_at', { ascending: true }),
      supabase.from('hero_slides').select('*').order('order_index', { ascending: true }),
      supabase.from('about_company').select('*').eq('id', 1).maybeSingle(),
      supabase.from('benefits').select('*').order('order_index', { ascending: true }),
      supabase.from('stats').select('*').order('order_index', { ascending: true }),
      supabase.from('testimonials').select('*').order('order_index', { ascending: true }),
      supabase.from('faqs').select('*').order('order_index', { ascending: true })
    ]);

    if (!servicesRes.error && servicesRes.data && servicesRes.data.length > 0) {
      displayServices = servicesRes.data;
    }
    if (!slidesRes.error && slidesRes.data && slidesRes.data.length > 0) {
      heroSlides = slidesRes.data;
    }
    if (!aboutRes.error && aboutRes.data) {
      displayAbout = aboutRes.data;
    }
    if (!benefitsRes.error && benefitsRes.data && benefitsRes.data.length > 0) {
      displayBenefits = benefitsRes.data;
    }
    if (!statsRes.error && statsRes.data && statsRes.data.length > 0) {
      displayStats = statsRes.data;
    }
    if (!testimonialsRes.error && testimonialsRes.data && testimonialsRes.data.length > 0) {
      displayTestimonials = testimonialsRes.data;
    }
    if (!faqsRes.error && faqsRes.data && faqsRes.data.length > 0) {
      displayFaqs = faqsRes.data;
    }
  } catch (err) {
    console.error('Error fetching database content:', err);
  }

  return (
    <div className="relative">
      {/* 1. Hero Slider */}
      <HeroSlider initialSlides={heroSlides} />

      {/* 2. About Company Preview */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <span className="text-primary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-primary/10 rounded-full">
                {displayAbout.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4 mb-6 leading-tight">
                {displayAbout.title}
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {displayAbout.description_1}
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                {displayAbout.description_2}
              </p>
              <Link 
                href={displayAbout.link_url || "/about"} 
                className="inline-flex items-center space-x-2 font-bold text-primary hover:text-primary-hover group transition-colors"
              >
                <span>{displayAbout.link_text || "Read Our Mission Story"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Visual element representing platform dashboard */}
            <div className="relative" data-aos="fade-left">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl -z-10" />
              <div className="glass border border-slate-100 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <div className="w-3 h-3 rounded-full bg-highlight" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Platform Performance Preview</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-text-dark mb-2">
                      <span>SMTP Delivery Rate</span>
                      <span className="text-highlight">{displayAbout.smtp_rate}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-highlight rounded-full" style={{ width: displayAbout.smtp_rate?.includes('%') ? displayAbout.smtp_rate : `${displayAbout.smtp_rate}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-text-dark mb-2">
                      <span>Sender Score Reputation</span>
                      <span className="text-primary">{displayAbout.sender_score}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${parseFloat(displayAbout.sender_score) || 98}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-text-dark mb-2">
                      <span>Queue Latency</span>
                      <span className="text-secondary">{displayAbout.queue_latency}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-secondary to-accent rounded-full" style={{ width: `${parseFloat(displayAbout.queue_latency_pct) || 10}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Overview */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <span className="text-primary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-primary/10 rounded-full">
              Our Core Services
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4 mb-4">
              Comprehensive Email Suite For Growing Businesses
            </h2>
            <p className="text-slate-600 text-lg">
              Unlock industry-leading delivery systems, list scrapers, and automation channels designed to scale your operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayServices.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <span className="text-primary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-primary/10 rounded-full">
              Platform Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4 mb-4">
              Why Businesses Trust Isha Software Solutions
            </h2>
            <p className="text-slate-600 text-lg">
              We focus on speed, reliability, and robust analytics to guarantee your outreach flows seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(displayBenefits || whyChooseUs).map((benefit, index) => {
              const IconComponent = benefit.icon || Lucide[benefit.icon_name] || Lucide.ShieldCheck;
              const title = benefit.title;
              const description = benefit.desc || benefit.description;
              return (
                <div 
                  key={index} 
                  className="bg-bg-custom/40 border border-secondary/10 rounded-3xl p-8 hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-300 group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Statistics Counter */}
      <StatsCounter initialStats={displayStats} />

      {/* 6. Testimonials */}
      <Testimonials initialTestimonials={displayTestimonials} />

      {/* 7. FAQ Accordion */}
      <FaqSection initialFaqs={displayFaqs} />

      {/* 8. Call To Action (Lead Gen) */}
      <section className="py-20 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-accent to-secondary p-8 md:p-16 text-white text-center shadow-xl shadow-primary/25" data-aos="zoom-in">
            {/* Visual glow details */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            
            <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Ready to Scale Your Customer Communication?
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Connect with our email experts to customize an SMTP relay solution or get started with high-deliverability bulk marketing tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/contact" 
                  className="bg-white text-primary hover:bg-slate-50 font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contact" 
                  className="bg-transparent text-white border border-white/40 hover:bg-white/10 font-bold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Contact Sales</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
