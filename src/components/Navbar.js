'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm py-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="Isha Software Solutions Logo" 
              className="h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`font-semibold transition-colors duration-300 ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-text-dark/80 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-text-dark/85 hover:text-primary font-semibold px-4 py-2 transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link 
              href="/contact" 
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden font-bold rounded-full group bg-gradient-to-br from-primary to-accent hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-300"
            >
              <span className="relative px-6 py-2 transition-all ease-in duration-75 bg-bg-custom rounded-full group-hover:bg-transparent text-primary group-hover:text-white">
                Get Started
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-dark/85 hover:text-primary p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white animate-fade-in border-t border-slate-100 shadow-lg">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-semibold ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-dark/80 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-text-dark/10 flex flex-col space-y-2 px-3">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center font-semibold py-2 text-text-dark/80 hover:text-primary border border-text-dark/10 rounded-full"
              >
                Sign In
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-gradient-to-r from-primary to-accent text-white font-semibold py-2 rounded-full shadow-md shadow-primary/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
