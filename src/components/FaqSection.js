'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is SMTP relay and how does it benefit my business?",
    answer: "An SMTP relay service routes your transactional and marketing emails through high-reputation servers instead of your local server. This prevents your messages from landing in the spam folder, ensures fast delivery, and provides detailed tracking logs for every sent message."
  },
  {
    question: "How does the Email Extractor Tool gather B2B leads?",
    answer: "Our extractor scans public business listings and domain structures based on targeted search queries. It filters duplicates and non-work emails, outputting clean lead lists that you can export in CSV format for immediate outreach campaigns."
  },
  {
    question: "Can I scale my email sending volume dynamically?",
    answer: "Absolutely. Our cloud-native SMTP infrastructure is highly scalable. You can start with thousands of emails and seamlessly scale to millions of monthly sends. Dedicated IP addresses are also available to protect your sending reputation."
  },
  {
    question: "Is there support for building email templates?",
    answer: "Yes, our Bulk Email service includes an interactive email template builder. You can choose from pre-designed layouts or customize your own responsive emails that look premium and render perfectly across mobile, desktop, and tablet clients."
  },
  {
    question: "Do you offer APIs for developer integrations?",
    answer: "Yes, we provide robust SMTP credentials as well as REST APIs and webhook support. Developers can integrate transactional email workflows, track bounce events, and receive delivery notifications programmatically in minutes."
  }
];

export default function FaqSection({ initialFaqs }) {
  const displayFaqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : faqs;
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Decorative gradients */}
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-primary font-bold text-xs tracking-widest uppercase py-1 px-3 bg-primary/10 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mt-4 mb-4">
            Have Questions? We Have Answers.
          </h2>
          <p className="text-slate-600 text-lg">
            Find answers to common questions about our bulk messaging, SMTP delivery, lead extraction, and system scaling.
          </p>
        </div>

        <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
          {displayFaqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-300 ${
                  isOpen 
                    ? 'border-primary bg-bg-custom/50 shadow-lg shadow-primary/5' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-text-dark hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="flex items-center space-x-3 pr-4">
                    <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-primary' : 'text-slate-400'}`} />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-primary' : ''}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 opacity-100 border-t border-slate-100/50' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="p-6 text-slate-600 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
