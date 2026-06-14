'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Eye, X, Send, Server, Zap, Search } from 'lucide-react';

const imageMap = {
  "Bulk Email Service": "/bulk_service.png",
  "SMTP Service": "/smtp_service.png",
  "Transactional Email": "/transactional_service.png",
  "Email Extractor Tool": "/extractor_service.png",
};

const iconMap = {
  Send,
  Server,
  Zap,
  Search,
};

const nameToIconKey = {
  "Bulk Email Service": "Send",
  "SMTP Service": "Server",
  "Transactional Email": "Zap",
  "Email Extractor Tool": "Search",
};

export default function ServiceCard({ service, index }) {
  const [modalOpen, setModalOpen] = useState(false);
  const iconKey = service.iconName || nameToIconKey[service.name] || "Send";
  const Icon = iconMap[iconKey] || Send;
  const imageSrc = service.image_url || imageMap[service.name] || "/bulk_service.png";

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  return (
    <>
      <div 
        className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between"
        data-aos="fade-up"
        data-aos-delay={index * 100}
      >
        <div>
          {/* Service Image — clickable */}
          <div 
            className="mx-auto mb-6 w-full max-w-[380px] aspect-[3/2] overflow-hidden rounded-2xl border border-slate-100 relative group/img bg-slate-50 shadow-sm cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <img 
              src={imageSrc} 
              alt={`${service.name} Preview`} 
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">View Details</span>
              </div>
            </div>
          </div>

          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${service.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary/10`}>
            <Icon className="w-6 h-6 animate-pulse" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-text-dark mb-4 group-hover:text-primary transition-colors">
            {service.name}
          </h3>

          {/* Description — clamp to 3 lines */}
          <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
            {service.description}
          </p>

          {/* View Details button */}
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-2 font-bold text-sm bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 cursor-pointer mb-6"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>

        {/* Learn More link */}
        <Link 
          href={service.href} 
          className="inline-flex items-center space-x-2 font-bold text-primary group-hover:text-primary-hover transition-colors"
        >
          <span>Learn More Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ========= MODAL POPUP ========= */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-28 px-4 pb-4"
          onClick={() => setModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />

          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[75vh] overflow-y-auto animate-scaleIn z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="w-full aspect-[3/2] overflow-hidden rounded-t-3xl bg-slate-50">
              <img 
                src={imageSrc} 
                alt={`${service.name} Preview`} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Icon + Title */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${service.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-text-dark">
                  {service.name}
                </h3>
              </div>

              {/* Full Description */}
              <p className="text-slate-600 leading-relaxed mb-8 text-base">
                {service.description}
              </p>

              {/* Features List */}
              <div className="mb-8">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Key Features</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-center text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl px-4 py-3">
                      <CheckCircle2 className="w-4 h-4 text-highlight mr-3 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link 
                href={service.href}
                className="inline-flex items-center space-x-2 font-bold bg-gradient-to-r from-primary to-accent text-white px-8 py-3.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300"
                onClick={() => setModalOpen(false)}
              >
                <span>Learn More Details</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
