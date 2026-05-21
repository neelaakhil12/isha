'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail, ShieldCheck, Users, Headphones } from 'lucide-react';

const stats = [
  {
    targetNum: 10000,
    suffix: "+",
    label: "Campaigns Sent",
    icon: Mail,
    color: "from-primary to-accent"
  },
  {
    targetNum: 5000,
    suffix: "+",
    label: "Happy Clients",
    icon: Users,
    color: "from-secondary to-accent"
  },
  {
    targetNum: 99,
    suffix: "%",
    label: "Delivery Success",
    icon: ShieldCheck,
    color: "from-highlight to-primary"
  },
  {
    targetText: "24/7",
    label: "Technical Support",
    icon: Headphones,
    color: "from-accent to-secondary"
  }
];

export default function StatsCounter() {
  const [counts, setCounts] = useState([0, 0, 0]);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || hasAnimated.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom >= 0;

      if (inView) {
        hasAnimated.current = true;
        
        const durations = [1500, 1500, 1500];
        const steps = 40;
        
        stats.slice(0, 3).forEach((stat, i) => {
          let current = 0;
          const increment = stat.targetNum / steps;
          const intervalTime = durations[i] / steps;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= stat.targetNum) {
              current = stat.targetNum;
              clearInterval(timer);
            }
            setCounts(prev => {
              const next = [...prev];
              next[i] = Math.floor(current);
              return next;
            });
          }, intervalTime);
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatNumber = (num, i) => {
    if (i === 0 && num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    if (i === 1 && num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  return (
    <section ref={sectionRef} className="py-20 relative bg-slate-900 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const displayValue = i < 3 
              ? formatNumber(counts[i], i) + stat.suffix 
              : stat.targetText;

            return (
              <div 
                key={i} 
                className="glass-dark hover:border-primary/30 p-3 sm:p-5 md:p-8 rounded-2xl md:rounded-3xl text-center group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 flex flex-col items-center"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* Icon box */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3 md:mb-6 shadow-lg shadow-primary/15 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                
                {/* Number */}
                <h3 className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black mb-1 md:mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {displayValue}
                </h3>
                
                {/* Label */}
                <p className="text-[9px] sm:text-[10px] md:text-sm font-semibold uppercase tracking-wide md:tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors leading-tight">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
