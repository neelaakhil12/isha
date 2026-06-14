'use client';

import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent mb-4 shadow-xl shadow-primary/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Isha Software Solutions</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Secure Administrator Login</h2>

          {error && (
            <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold flex items-center space-x-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-600/50 text-white rounded-2xl px-4 py-3.5 pl-11 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-500"
                  placeholder="admin@ishasoftware.com"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-600/50 text-white rounded-2xl px-4 py-3.5 pl-11 pr-11 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-500"
                  placeholder="••••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Authenticating...</span></>
              ) : (
                <><ShieldCheck className="w-4 h-4" /><span>Access Admin Panel</span></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © Isha Software Solutions — Restricted Access
        </p>
      </div>
    </div>
  );
}
