'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Linkedin, Instagram, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const defaultContact = {
  email: 'support@ishasoftwares.com',
  email_general: 'info@ishasoftwares.com',
  phone_sales: '+91 98765 43210',
  phone_support: '+91 98765 43211',
  address: '123 SaaS Street, Suite 400, Tech Park, Hyderabad, India',
  map_url: '',
  map_visible: true,
  social_visible: true,
  facebook_url: '',
  twitter_url: '',
  linkedin_url: '',
  instagram_url: '',
};
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'bulk-email',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [contact, setContact] = useState(defaultContact);

  useEffect(() => {
    const loadContact = async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && data) setContact(data);
    };
    loadContact();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    // Format the phone number: strip non-digits, ensure it has country code
    const rawPhone = (contact.phone_sales || '').replace(/\D/g, '');
    const waPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    // Build a clean WhatsApp message from the form data
    const serviceLabels = {
      'bulk-email': 'Bulk Email Service',
      'smtp-relay': 'SMTP Relay Service',
      'transactional-api': 'Transactional API',
      'email-extractor': 'Email Extractor Tool',
      'multiple-services': 'Multiple / Custom Package',
    };
    const message = [
      `Hello Isha Software Solutions!`,
      ``,
      `*New Enquiry from Website Contact Form*`,
      ``,
      `👤 *Name:* ${formData.name}`,
      `📧 *Email:* ${formData.email}`,
      formData.phone ? `📞 *Phone:* ${formData.phone}` : null,
      formData.company ? `🏢 *Company:* ${formData.company}` : null,
      `🛠️ *Service:* ${serviceLabels[formData.service] || formData.service}`,
      formData.message ? `\n💬 *Message:*\n${formData.message}` : null,
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank');
    setStatus({ loading: false, success: true, error: null });

  };

  return (
    <div className="py-12 bg-white">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden rounded-b-[50px] md:rounded-b-[80px]">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-secondary font-bold text-xs tracking-widest uppercase py-1 px-3.5 bg-secondary/15 rounded-full mb-4 inline-block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-secondary bg-clip-text text-transparent">
            Contact Our Deliverability Experts
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed">
            Have questions about campaign volume setups or API connections? Drop us a message, and our technical team will reply within 2 hours.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7" data-aos="fade-right">
            <div className="glass border border-slate-100 p-8 md:p-10 rounded-3xl shadow-xl bg-white/70 relative overflow-hidden">
              <h2 className="text-2xl font-bold text-text-dark mb-2">Send Us a Message</h2>
              <p className="text-slate-500 text-sm mb-8">Fill in the fields below to schedule a call or request API credential authorization.</p>

              {status.success ? (
                <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center flex flex-col items-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-text-dark text-xl mb-2">WhatsApp Opened!</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Your message has been pre-filled in WhatsApp. Just hit <strong>Send</strong> in WhatsApp to complete your enquiry. We'll get back to you shortly!
                  </p>
                  <button 
                    onClick={() => setStatus({ loading: false, success: false, error: null })}
                    className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">Business Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-2">Service of Interest</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all"
                    >
                      <option value="bulk-email">Bulk Email Service</option>
                      <option value="smtp-relay">SMTP Relay Service</option>
                      <option value="transactional-api">Transactional API</option>
                      <option value="email-extractor">Email Extractor Tool</option>
                      <option value="multiple-services">Multiple / Custom Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-2">Detailed Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Tell us about your campaign details or developer requirements..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {status.loading ? (
                      <span>Opening WhatsApp...</span>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        <span>Send via WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Business Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between" data-aos="fade-left">
            <div className="space-y-8 bg-slate-900 text-slate-300 p-8 md:p-10 rounded-3xl shadow-xl h-full">
              <div>
                <h3 className="text-white text-xl font-bold mb-6 border-b border-slate-800 pb-3">Business Information</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Visit our regional office to discuss scaling configurations, or use our digital contact points for prompt tech assistance.
                </p>
              </div>

              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed pt-2">
                    {contact.address}
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-sm">{contact.phone_sales}</p>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-sm">{contact.email}</p>
                </div>
              </div>


              {/* Social Channels - loaded from Supabase */}
              {contact.social_visible !== false && (
                <div className="pt-6 border-t border-slate-800">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Connect with us</h4>
                  <div className="flex space-x-4">
                    {contact.facebook_url && (
                      <a href={contact.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-slate-400">
                        <Facebook className="w-4.5 h-4.5" />
                      </a>
                    )}
                    {contact.twitter_url && (
                      <a href={contact.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-slate-400">
                        <Twitter className="w-4.5 h-4.5" />
                      </a>
                    )}
                    {contact.linkedin_url && (
                      <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-slate-400">
                        <Linkedin className="w-4.5 h-4.5" />
                      </a>
                    )}
                    {contact.instagram_url && (
                      <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-slate-400">
                        <Instagram className="w-4.5 h-4.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section — controlled from admin panel */}
      {contact.map_visible !== false && (
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="zoom-in">
          <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-xl bg-slate-50 p-6">

            {contact.map_url ? (
              /* Real Google Maps embed */
              <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden">
                <iframe
                  src={
                    contact.map_url.includes('output=embed') || contact.map_url.includes('/maps/embed')
                      ? contact.map_url
                      : contact.map_url.includes('?')
                        ? `${contact.map_url}&output=embed`
                        : `${contact.map_url}?output=embed`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Isha Software Solutions Location"
                />
                {/* View on Google Maps button */}
                <a
                  href={contact.map_url.replace('&output=embed', '').replace('?output=embed', '').replace('output=embed&', '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 z-10 flex items-center space-x-2 bg-white hover:bg-primary hover:text-white text-slate-700 font-bold text-xs px-4 py-2.5 rounded-full shadow-lg border border-slate-200 hover:border-primary transition-all duration-300 group"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" />
                  <span>View on Google Maps</span>
                </a>
              </div>
            ) : (
              /* Decorative mock map fallback */
              <div className="relative w-full h-80 md:h-96 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute" />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white relative z-10 shadow-lg shadow-primary/30">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-white text-xs font-bold mt-3 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                    Isha Software Solutions
                  </span>
                </div>
                {contact.address && (
                  <a
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(contact.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 z-10 flex items-center space-x-2 bg-white hover:bg-primary hover:text-white text-slate-700 font-bold text-xs px-4 py-2.5 rounded-full shadow-lg border border-slate-200 hover:border-primary transition-all duration-300 group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" />
                    <span>View on Google Maps</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
