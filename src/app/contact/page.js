'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Linkedin, Instagram, ShieldCheck, CheckCircle2 } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    // Mock API Submission
    setTimeout(() => {
      setStatus({ loading: false, success: true, error: null });
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'bulk-email',
        message: ''
      });
    }, 1500);
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
                <div className="bg-highlight/5 border border-highlight/20 p-8 rounded-2xl text-center flex flex-col items-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-highlight/15 text-highlight flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-text-dark text-xl mb-2">Message Sent Successfully!</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Thank you for reaching out to Isha Software Solutions. A developer or system analyst has been assigned to your query and will contact you shortly.
                  </p>
                  <button 
                    onClick={() => setStatus({ loading: false, success: false, error: null })}
                    className="bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-primary-hover transition-colors"
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
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {status.loading ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Submit Details</span>
                        <Send className="w-4.5 h-4.5" />
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

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Headquarters</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      123 SaaS Street, Suite 400, Tech Park, Hyderabad, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Phone Inquiries</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Sales: +91 98765 43210 <br />
                      Support: +91 98765 43211
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Email Network</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      General: info@ishasoftwares.com <br />
                      Technical support: support@ishasoftwares.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-slate-800">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Connect with us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-slate-400">
                    <Facebook className="w-4.5 h-4.5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-slate-400">
                    <Twitter className="w-4.5 h-4.5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-slate-400">
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-slate-400">
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section representation */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="zoom-in">
        <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-xl bg-slate-50 p-6">
          <div className="absolute top-6 left-6 z-10 glass border border-slate-200/50 p-4 rounded-2xl shadow-md hidden sm:block">
            <h4 className="font-extrabold text-text-dark text-sm mb-1">Our Location Coordinate</h4>
            <p className="text-slate-500 text-xs flex items-center">
              <MapPin className="w-3.5 h-3.5 text-primary mr-1" />
              <span>Hyderabad Tech Hub, India</span>
            </p>
          </div>
          {/* Stylized custom grid pattern mapping out a vector mock map */}
          <div className="w-full h-80 md:h-96 rounded-2xl bg-slate-900 relative overflow-hidden flex items-center justify-center">
            {/* SVG grid lines to resemble a technical coordinate map */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
            
            {/* Pulsing Location pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white relative z-10 shadow-lg shadow-primary/30">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-white text-xs font-bold mt-3 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                Isha Software Solutions
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
