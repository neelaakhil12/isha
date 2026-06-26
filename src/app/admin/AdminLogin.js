'use client';

import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminLogin() {
  const [view, setView] = useState('login'); // 'login', 'forgot', 'sent'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await fetch('/api/admin/forgot-password/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send recovery link.');
      setSuccessMessage(`A password reset link has been successfully sent to ${email}.`);
      setView('sent');
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

        {/* Login/Recover Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          {view === 'login' && (
            <>
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
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setSuccessMessage('');
                        setView('forgot');
                      }}
                      className="text-xs font-bold text-primary hover:text-primary-hover transition-colors focus:outline-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
            </>
          )}

          {view === 'forgot' && (
            <>
              <h2 className="text-lg font-bold text-white mb-2">Recover Credentials</h2>
              <p className="text-slate-400 text-xs mb-6">Enter the email associated with the administrative account to receive a secure password reset link.</p>

              {error && (
                <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold flex items-center space-x-2">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSendLink} className="space-y-5">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending Link...</span></>
                  ) : (
                    <><Mail className="w-4 h-4" /><span>Send Reset Link</span></>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setSuccessMessage('');
                      setView('login');
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}

          {view === 'sent' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Reset Link Dispatched</h2>
              <p className="text-slate-400 text-sm mb-6">
                {successMessage} The link is valid for 15 minutes.
              </p>

              <button
                onClick={() => {
                  setError('');
                  setSuccessMessage('');
                  setView('login');
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl border border-slate-700/80 transition-all cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © Isha Software Solutions — Restricted Access
        </p>
      </div>
    </div>
  );
}
