'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  {
    title: "Powerful email marketing platform for growing businesses",
    subtitle: "CAMPAIGNS THAT CONVERT",
    description: "Connect with your audience using personalized email templates, automated workflows, and instant SMTP delivery tracking."
  },
  {
    title: "Saves time by automating repetitive marketing and sales tasks",
    subtitle: "MARKETING AUTOMATION",
    description: "Build robust visual automation workflows that trigger emails based on user behavior, actions, or specific schedules."
  },
  {
    title: "One platform - endless possibilities",
    subtitle: "ALL-IN-ONE EMAIL SUITE",
    description: "From extraction to execution: manage list building, secure SMTP routing, bulk campaigns, and detailed real-time performance analytics."
  },
  {
    title: "A powerful email marketing automation platform that gives you full control, no vendor lock-in, and the flexibility to build campaigns your way.",
    subtitle: "ENTERPRISE CAPABILITIES",
    description: "Deploy on your own infrastructure or use our ultra-scalable SMTP relays. Pay for what you send, not the size of your contacts list."
  },
  {
    title: "Whether you are a startup, a growing business, or managing multiple clients, Isha Software Solutions helps you personalize at scale without losing your edge.",
    subtitle: "SCALE WITHOUT LIMITS",
    description: "Manage client campaigns in separate sub-accounts, integrate via SMTP/API, and execute transactional messages with zero delay."
  }
];

export default function HeroSlider() {
  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-slate-950">
      {/* Full-Screen Modern Tech Office Background with Purple-Orange Brand Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-out scale-105 hover:scale-100"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(124, 58, 237, 0.4) 50%, rgba(249, 115, 22, 0.2) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />

      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full bg-transparent relative z-10"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full bg-transparent overflow-hidden">
            {/* Content Container */}
            <div className="absolute inset-0 flex items-center pt-16 md:pt-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl text-left" data-aos="fade-up">
                  <span className="inline-flex items-center space-x-1 bg-primary/10 border border-primary/20 text-primary font-bold text-xs tracking-widest uppercase py-1 px-3.5 rounded-full mb-4">
                    <Zap className="w-3.5 h-3.5 fill-current animate-bounce text-secondary" />
                    <span>{slide.subtitle}</span>
                  </span>
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href="/contact" 
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                      href="/services" 
                      className="glass text-white hover:bg-white hover:text-text-dark font-bold px-8 py-3.5 rounded-full border border-white/20 hover:scale-105 transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Explore Services</span>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
