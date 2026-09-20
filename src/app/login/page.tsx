'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useToast } from '@/components/ToastContext';

export default function LoginPage() {
  const { refreshUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      await refreshUser();
      success('Logged in successfully!');

      if (data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      toastError('Network error while logging in.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full border border-[#111111] bg-white p-8 sm:p-10 shadow-xs space-y-8">
        {/* Header - Swiss Technical Catalog Style */}
        <div className="space-y-3 pb-6 border-b border-[#111111]/15">
          <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-[#111111]">
            <span className="px-1.5 py-0.5 bg-[#dc2626] text-white">CG-GATE</span>
            <span className="text-[#666666]">[ AUTH // SYSTEM GATE ]</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] uppercase tracking-tight leading-none">
              RESIDENT &amp; ADMIN ACCESS
            </h1>
            <p className="text-xs text-[#666666] mt-2 font-mono uppercase tracking-wide">
              Official verification for tournament athletes &amp; officials
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111] mb-2">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@greenmeadows.internal"
                className="w-full bg-[#f4f4f0]/60 border border-[#111111]/30 rounded-none px-4 py-3 pl-11 text-xs sm:text-sm font-mono text-[#111111] placeholder:text-[#888888] focus:outline-hidden focus:border-[#111111] focus:bg-white transition-colors"
              />
              <Mail className="w-4 h-4 text-[#666666] absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111] mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f4f4f0]/60 border border-[#111111]/30 rounded-none px-4 py-3 pl-11 text-xs sm:text-sm font-mono text-[#111111] placeholder:text-[#888888] focus:outline-hidden focus:border-[#111111] focus:bg-white transition-colors"
              />
              <Lock className="w-4 h-4 text-[#666666] absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#111111] hover:bg-[#dc2626] text-white font-mono font-bold text-xs uppercase tracking-widest border border-[#111111] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <span>SIGN IN TO PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Admin Tip - Swiss Technical Metadata */}
        <div className="p-4 border border-[#111111]/20 bg-[#f4f4f0] font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between text-[#dc2626] font-bold">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> DEMO OFFICIAL CREDENTIALS
            </span>
            <span className="text-[9px] bg-[#111111] text-white px-1.5 py-0.5">PRE-SET</span>
          </div>
          <div className="text-[#333333] space-y-1 text-[11px]">
            <p>
              USER: <code className="text-[#111111] font-bold bg-white px-1.5 py-0.5 border border-[#111111]/20">admin@colonygames.com</code>
            </p>
            <p>
              PASS: <code className="text-[#111111] font-bold bg-white px-1.5 py-0.5 border border-[#111111]/20">Admin@Colony2026!</code>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@colonygames.com');
              setPassword('Admin@Colony2026!');
            }}
            className="text-[10px] uppercase font-bold text-[#dc2626] hover:underline cursor-pointer block pt-1"
          >
            ⚡ AUTO-FILL DEMO CREDENTIALS →
          </button>
        </div>

        {/* Registration Link */}
        <div className="text-center font-mono text-xs text-[#666666] pt-2 border-t border-[#111111]/15">
          NEW HOUSEHOLD?{' '}
          <Link href="/register" className="text-[#dc2626] font-bold hover:underline">
            REGISTER YOUR FAMILY PASS →
          </Link>
        </div>
      </div>
    </div>
  );
}
