'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Server } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    // Mock Authentication delay
    setTimeout(() => {
      setStatus({ loading: false, success: true, error: null });
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row bg-white relative">
      {/* Left Column: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 z-10">
        <div className="w-full max-w-md" data-aos="fade-right">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center mb-8 group">
              <img 
                src="/logo.png" 
                alt="Isha Software Solutions Logo" 
                className="h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
              />
            </Link>
            <h2 className="text-3xl font-black text-text-dark mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Log in to manage your SMTP server metrics and marketing campaigns.</p>
          </div>

          {status.success ? (
            <div className="bg-highlight/5 border border-highlight/20 p-8 rounded-3xl text-center flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-highlight/15 text-highlight flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="font-extrabold text-text-dark text-xl mb-2">Access Granted</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                You are successfully authenticated. Redirecting to your dashboard hub...
              </p>
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Workspace Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="name@company.com"
                    required
                  />
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-text-dark">Password</label>
                  <a href="#" className="text-xs font-bold text-primary hover:text-primary-hover transition-colors">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-text-dark absolute right-2 top-1/2 -translate-y-1/2 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-200 accent-primary"
                  />
                  <span className="font-medium text-xs select-none">Remember this device for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {status.loading ? (
                  <span>Securing Authentication...</span>
                ) : (
                  <>
                    <span>Enter Cockpit Portal</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social authentication placeholder */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="relative flex justify-center mb-6">
              <span className="bg-white px-4 text-xs font-semibold text-slate-400 absolute -top-2">OR CONTINUE WITH</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 border border-slate-150 rounded-2xl py-3 hover:bg-slate-50 transition-colors text-sm font-bold text-text-dark cursor-pointer">
                <span className="w-4 h-4 bg-red-500 rounded-full shrink-0" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 border border-slate-150 rounded-2xl py-3 hover:bg-slate-50 transition-colors text-sm font-bold text-text-dark cursor-pointer">
                <span className="w-4 h-4 bg-slate-900 rounded-full shrink-0" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Animated Side Banner */}
      <div className="hidden md:flex w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-16 text-white">
        {/* Glow Details */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/25 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />

        <div className="relative z-10" data-aos="fade-left">
          <span className="text-secondary font-bold text-xs tracking-widest uppercase py-1 px-3.5 bg-secondary/15 rounded-full mb-6 inline-block">
            Isha Delivery Platform
          </span>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-6">
            Secure Relays, Uncompromised Inbox Placement.
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-md">
            Our multi-node IP arrays protect your reputation, guaranteeing that critical business transactions land exactly where they belong: in the inbox.
          </p>
        </div>

        {/* Graphic display: Floating mail / server nodes mockup */}
        <div className="relative h-64 flex items-center justify-center my-12" data-aos="zoom-in">
          <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center relative">
            <div className="w-36 h-36 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-xl shadow-primary/30">
                <Server className="w-10 h-10 animate-bounce" />
              </div>
            </div>
            
            {/* Pulsing sub-nodes */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center text-secondary shadow-md animate-pulse">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center text-highlight shadow-md animate-pulse">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center text-primary shadow-md animate-pulse">
              <Mail className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-slate-500 border-t border-white/10 pt-6" data-aos="fade-left" data-aos-delay="100">
          <p>© Isha Software Solutions.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary">Help Center</a>
            <a href="#" className="hover:text-primary">Security Docs</a>
          </div>
        </div>
      </div>
    </div>
  );
}
