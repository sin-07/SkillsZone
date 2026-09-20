'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import {
  Calendar,
  Award,
  User,
  Shield,
  Menu,
  X,
  PlusCircle,
  LogOut,
  Home,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '01 / Overview', icon: Home },
    { href: '/events', label: '02 / Tournaments', icon: Calendar },
    { href: '/results', label: '03 / Leaderboard', icon: Award },
    { href: '/register', label: '04 / Register Pass', icon: PlusCircle, highlight: true },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#111111]/15 bg-[#f4f4f0]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo - Swiss Editorial Masthead */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#111111] text-white flex items-center justify-center font-mono font-black text-sm tracking-tighter transition-colors group-hover:bg-[#dc2626]">
              CG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tighter uppercase text-[#111111]">
                  COLONY<span className="text-[#dc2626]">GAMES</span>
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest px-1.5 py-0.5 border border-[#111111]/20 bg-white text-[#111111]">
                  EDITION.2026
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#666666] hidden sm:block">
                SOCIETY SPORTS FEST • OCT 15–18
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="ml-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest bg-[#111111] text-white hover:bg-[#dc2626] transition-colors flex items-center gap-2 border border-[#111111]"
                  >
                    <span>{link.label}</span>
                    <span className="text-[#dc2626] group-hover:text-white">→</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors border ${
                    active
                      ? 'border-[#111111] bg-white text-[#111111] font-bold'
                      : 'border-transparent text-[#555555] hover:text-[#111111] hover:border-[#111111]/20'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User / Admin Action Area */}
          <div className="hidden md:flex items-center gap-2">
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border border-[#dc2626] text-[#dc2626] bg-[#dc2626]/5 hover:bg-[#dc2626] hover:text-white transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                ADMIN
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white border border-[#111111]/20 text-[#111111] hover:border-[#111111] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#111111]" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 bg-white border border-[#111111]/20 text-[#555555] hover:text-[#dc2626] hover:border-[#dc2626] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#333333] hover:text-[#111111] transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-widest bg-[#111111] hover:bg-[#dc2626] text-white border border-[#111111] transition-colors"
                >
                  REGISTER PASS
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="p-2 bg-white text-[#dc2626] border border-[#dc2626]"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] bg-white border border-[#111111]/20"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#111111]/15 bg-[#f4f4f0] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
                  link.highlight
                    ? 'bg-[#111111] text-white border-[#111111] font-bold'
                    : active
                    ? 'bg-white text-[#111111] border-[#111111] font-bold'
                    : 'bg-transparent text-[#333333] border-transparent hover:border-[#111111]/20'
                }`}
              >
                <span>{link.label}</span>
                <span>→</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-[#111111]/15 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-[#111111] bg-white border border-[#111111]/20"
                >
                  <span>PROFILE / {user.name}</span>
                  <User className="w-4 h-4 text-[#111111]" />
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-[#dc2626] bg-white border border-[#dc2626]"
                  >
                    <span>ADMIN COMMAND CENTER</span>
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-between px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-[#dc2626] border border-[#dc2626]/30 bg-white"
                >
                  <span>SIGN OUT</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-mono font-bold uppercase tracking-widest text-[#111111] bg-white border border-[#111111]/20"
                >
                  LOG IN
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-mono font-bold uppercase tracking-widest text-white bg-[#111111] hover:bg-[#dc2626] border border-[#111111]"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
