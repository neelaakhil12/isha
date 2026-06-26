'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, ShieldCheck, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link: Missing token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password reset failed.');
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Password Reset Successful</h2>
        <p className="text-slate-400 text-sm">
          Your administrator password has been updated in the database settings. Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-lg font-bold text-white mb-2">Choose New Password</h2>
      <p className="text-slate-400 text-xs mb-6">Specify a secure new password for your administrator account.</p>

      {error && (
        <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-600/50 text-white rounded-2xl px-4 py-3.5 pl-11 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-500"
              placeholder="••••••••"
              required
              disabled={!token}
            />
            <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-600/50 text-white rounded-2xl px-4 py-3.5 pl-11 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-slate-500"
              placeholder="••••••••"
              required
              disabled={!token}
            />
            <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
          ) : (
            <><ShieldCheck className="w-4 h-4" /><span>Update Password</span></>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense fallback={
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <span className="text-white text-sm">Loading recovery panel...</span>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center text-slate-600 text-xs mt-6">
          © Isha Software Solutions — Restricted Access
        </p>
      </div>
    </div>
  );
}
