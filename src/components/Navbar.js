'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, User, Loader2 } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path) => pathname === path;

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Navbar session check error:', err);
      } finally {
        setSessionLoading(false);
      }
    }
    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

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
            {sessionLoading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/account" 
                  className="flex items-center space-x-2 text-text-dark/85 hover:text-primary font-bold transition-all"
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black uppercase text-xs border border-primary/20">
                    {user.name.slice(0, 2)}
                  </span>
                  <span className="text-sm">Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-500 hover:bg-red-50 px-3.5 py-2 rounded-xl border border-red-100 transition-all cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
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
              {sessionLoading ? (
                <div className="w-full flex justify-center py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : user ? (
                <>
                  <Link 
                    href="/account" 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center font-bold py-2.5 bg-primary/10 text-primary rounded-full flex items-center justify-center space-x-2"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center font-black uppercase text-[10px]">
                      {user.name.slice(0, 2)}
                    </span>
                    <span>My Account</span>
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="w-full text-center text-red-500 font-bold py-2 hover:bg-red-50 border border-red-100 rounded-full cursor-pointer transition-all"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
