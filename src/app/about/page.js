import * as Lucide from 'lucide-react';
import { Target, Eye, Trophy } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: "About Our Mission & Vision",
  description: "Learn about the mission, vision, expertise, and achievements of Isha Software Solutions in delivering powerful SMTP relays and bulk email systems.",
};

export default async function About() {
  // Default values
  let headers = {
    header_title: "Powering Smart Digital Outreach",
    header_description: "Isha Software Solutions delivers secure, high-reputation SMTP networks and marketing tools that help scaling companies talk to their clients.",
    intro_title: "Next-Generation Email Solutions Crafted for Scalability",
    intro_desc_1: "Founded with the goal of breaking vendor lock-ins in the marketing automation space, Isha Software Solutions has grown into a premier provider of email systems for digital agencies, developers, and global brands.",
    intro_desc_2: "We design software that eliminates complex billing rules. By offering fixed-price and volume-based SMTP services alongside smart extractor and bulk template capabilities, we give businesses the freedom to build outbound campaigns their way."
  };

  const defaultIdeals = [
    { title: "Reputation First", description: "We manage IP warm-ups and routing lists to keep sender reputation at peak." },
    { title: "Developer Freedom", description: "Fully compliant REST APIs and SMTP relays that fit in any codebase in minutes." },
    { title: "Fair Pricing Structures", description: "No penalties for having larger contact lists. Pay only for the messages you send." }
  ];

  let ideals = null;

  let missionVision = {
    mission_text: "To simplify high-volume digital mailing by delivering reliable, self-scalable SMTP relays and analytical campaign creators. We aim to maximize delivery rates while lowering billing barriers for expanding businesses.",
    vision_text: "To stand as the leading global infrastructure network for automated and transactional email deliveries, ensuring that every startup and growing enterprise can send and track outreach with zero speed limits."
  };

  let expertiseHeader = {
    title: "Built by Mail System Experts",
    description: "Our engineers focus on the specialized routing systems required to maintain high inbox deliverability."
  };

  const defaultExpertiseCards = [
    { title: "IP Reputation Management", description: "We monitor blacklist states and manage automated IP warm-ups to ensure your sending blocks are recognized as legitimate by ISPs." },
    { title: "API Delivery Pipelines", description: "Our REST endpoints utilize distributed queuing arrays, meaning massive spikes in transactional requests are routed with zero message drops." },
    { title: "Lead Extraction Filtration", description: "Our advanced filters look for spam traps, catch-all servers, and inactive email structures, saving you from bounces and ISP blocks." }
  ];

  let expertiseCards = null;

  const defaultAchievements = [
    { value: "5B+", label: "Emails Successfully Routed", icon_name: "MailCheck", color: "text-primary" },
    { value: "99.8%", label: "Average Delivery Rate", icon_name: "ShieldCheck", color: "text-highlight" },
    { value: "120+", label: "Dedicated Server Clusters", icon_name: "Trophy", color: "text-secondary" },
    { value: "10K+", label: "Active Enterprise Clients", icon_name: "Users", color: "text-accent" },
  ];

  let displayAchievements = null;

  try {
    const [
      headersRes,
      idealsRes,
      mvRes,
      expHeaderRes,
      expCardsRes,
      achRes
    ] = await Promise.all([
      supabase.from('about_page_headers').select('*').eq('id', 1).maybeSingle(),
      supabase.from('about_page_ideals').select('*').order('order_index', { ascending: true }),
      supabase.from('about_page_mission_vision').select('*').eq('id', 1).maybeSingle(),
      supabase.from('about_page_expertise').select('*').eq('id', 1).maybeSingle(),
      supabase.from('about_page_expertise_cards').select('*').order('order_index', { ascending: true }),
      supabase.from('about_page_achievements').select('*').order('order_index', { ascending: true })
    ]);

    if (!headersRes.error && headersRes.data) {
      headers = headersRes.data;
    }
    if (!idealsRes.error && idealsRes.data && idealsRes.data.length > 0) {
      ideals = idealsRes.data;
    }
    if (!mvRes.error && mvRes.data) {
      missionVision = mvRes.data;
    }
    if (!expHeaderRes.error && expHeaderRes.data) {
      expertiseHeader = expHeaderRes.data;
    }
    if (!expCardsRes.error && expCardsRes.data && expCardsRes.data.length > 0) {
      expertiseCards = expCardsRes.data;
    }
    if (!achRes.error && achRes.data && achRes.data.length > 0) {
      displayAchievements = achRes.data;
    }
  } catch (err) {
    console.error('Error loading About Page content:', err);
  }

  return (
    <div className="py-12 bg-white">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden rounded-b-[50px] md:rounded-b-[80px]">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-secondary font-bold text-xs tracking-widest uppercase py-1 px-3.5 bg-secondary/15 rounded-full mb-4 inline-block">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-secondary bg-clip-text text-transparent">
            {headers.header_title}
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed">
            {headers.header_description}
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <span className="text-primary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-primary/10 rounded-full">
              Introduction
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4 mb-6">
              {headers.intro_title}
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              {headers.intro_desc_1}
            </p>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              {headers.intro_desc_2}
            </p>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-3xl blur-2xl -z-10" />
            <div className="glass border border-slate-100 p-8 rounded-3xl shadow-xl flex flex-col justify-center bg-white/70">
              <h3 className="text-xl font-bold text-text-dark mb-4 border-b pb-3">Core Ideals We Work By:</h3>
              <ul className="space-y-4">
                {(ideals || defaultIdeals).map((ideal, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${
                      idx === 0 ? 'bg-primary/10 text-primary' : idx === 1 ? 'bg-secondary/10 text-secondary' : 'bg-highlight/10 text-highlight'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-text-dark">{ideal.title}</h4>
                      <p className="text-xs text-slate-500">{ideal.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div 
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
              data-aos="fade-up"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-text-dark mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {missionVision.mission_text}
              </p>
            </div>

            <div 
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-text-dark mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {missionVision.vision_text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-primary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-primary/10 rounded-full">
            Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4 mb-4">
            {expertiseHeader.title}
          </h2>
          <p className="text-slate-600 text-lg">
            {expertiseHeader.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(expertiseCards || defaultExpertiseCards).map((card, idx) => (
            <div key={idx} className="p-8 border border-slate-100 rounded-3xl bg-white hover:border-primary/20 transition-all text-center" data-aos="fade-up" data-aos-delay={idx * 100}>
              <h4 className="font-extrabold text-text-dark text-lg mb-3">{card.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements (Stats) */}
      <section className="py-20 relative bg-slate-900 text-white overflow-hidden rounded-[50px] md:rounded-[80px]">
        {/* Glow backgrounds */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
            <span className="text-secondary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-secondary/15 rounded-full">
              Our Success Nodes
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">
              Proven Performance At Scale
            </h2>
            <p className="text-slate-400">
              Numbers that demonstrate our commitment to high reliability, throughput, and happy clients.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {(displayAchievements || defaultAchievements).map((item, i) => {
              const Icon = Lucide[item.icon_name] || Trophy;
              const color = item.color || 'text-primary';
              return (
                <div 
                  key={i} 
                  className="glass-dark p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl text-center group hover:border-primary/30 transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform ${color}`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 md:mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {item.value}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide md:tracking-wider text-slate-400">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Call to Action */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-text-dark mb-6">
            Partner with a Compliant & Trusted Deliverability Expert
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Stop losing leads to junk and spam filters. Build secure, trackable, and affordable email communications with Isha Software Solutions.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
            >
              Contact Sales
            </Link>
            <Link 
              href="/services" 
              className="bg-slate-100 hover:bg-slate-200 text-text-dark font-bold px-8 py-3.5 rounded-full hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
