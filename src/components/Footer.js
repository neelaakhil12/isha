'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const defaultContact = {
  email: 'support@ishasoftwares.com',
  phone_sales: '+91 98765 43210',
  address: '123 SaaS Street, Suite 400, Tech Park, Hyderabad, India',
  social_visible: true,
  facebook_url: '',
  twitter_url: '',
  linkedin_url: '',
  instagram_url: '',
};

const formatExternalLink = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('Subscribing...');
    setTimeout(() => {
      setStatus('Thank you for subscribing!');
      setEmail('');
    }, 1200);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center group">
              <img
                src="/logo.png"
                alt="Isha Software Solutions Logo"
                className="h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-sm text-slate-400">
              Empowering smart businesses with industry-grade SMTP servers, automated bulk email campaigns, and advanced extraction technologies.
            </p>
            {contact.social_visible !== false && (
              <div className="flex space-x-4 pt-2">
                {contact.facebook_url && (
                  <a href={formatExternalLink(contact.facebook_url)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {contact.twitter_url && (
                  <a href={formatExternalLink(contact.twitter_url)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {contact.linkedin_url && (
                  <a href={formatExternalLink(contact.linkedin_url)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {contact.instagram_url && (
                  <a href={formatExternalLink(contact.instagram_url)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-base mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Client Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details - loaded from Supabase */}
          <div>
            <h3 className="font-semibold text-white text-base mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span>{contact.phone_sales}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <span>{contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white text-base mb-4">Newsletter</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to get the latest product releases, marketing tips, and platform updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-full px-4 py-2.5 pr-10 text-sm text-slate-200 focus:outline-none focus:border-primary transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white rounded-full p-1.5 transition-all duration-300 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>
              {status && (
                <p className="text-xs text-highlight font-medium mt-1 animate-pulse">
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Isha Software Solutions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/spam-policy" className="hover:text-primary transition-colors">Spam Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}