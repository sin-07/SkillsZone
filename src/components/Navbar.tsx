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
    { href: '/', label: '01 / OVERVIEW', icon: Home },
    { href: '/events', label: '02 / TOURNAMENTS', icon: Calendar },
    { href: '/results', label: '03 / LEADERBOARD', icon: Award },
    { href: '/register', label: '04 / REGISTER PASS', icon: PlusCircle, highlight: true },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#111111]/20 bg-[#f4f4f0]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Swiss Clean */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#111111] text-white flex items-center justify-center font-mono font-bold text-sm tracking-tight border border-[#111111] group-hover:bg-[#dc2626] transition-colors">
              CG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tighter uppercase text-[#111111]">
                  COLONY<span className="text-[#dc2626]">GAMES</span>
                </span>
                <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 border border-[#111111] bg-[#111111] text-white">
                  2026
                </span>
              </div>
              <p className="text-[9px] font-mono font-medium uppercase tracking-widest text-[#666666] hidden sm:block">
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
                    className="ml-2 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#111111] hover:bg-[#dc2626] text-white transition-colors border border-[#111111] flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                    <span>→</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-mono font-medium uppercase tracking-wider transition-colors border ${
                    active
                      ? 'border-[#111111] bg-[#111111] text-white'
                      : 'border-transparent text-[#333333] hover:text-[#111111] hover:border-[#111111]/30'
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10 hover:bg-[#dc2626] hover:text-white transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                ADMIN
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium uppercase tracking-wider bg-white border border-[#111111]/30 text-[#111111] hover:border-[#111111] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 bg-white border border-[#111111]/30 text-[#111111] hover:bg-[#dc2626] hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-mono font-medium uppercase tracking-wider text-[#111111] hover:underline transition-all"
                >
                  LOGIN
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#111111] hover:bg-[#dc2626] text-white border border-[#111111] transition-colors"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="p-2 bg-[#dc2626] text-white border border-[#dc2626]"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111111] bg-white border border-[#111111]/30"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#111111]/20 bg-[#f4f4f0] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border transition-colors ${
                  link.highlight
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : active
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111]'
                }`}
              >
                <span>{link.label}</span>
                <span>→</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-[#111111]/20 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 text-xs font-mono font-medium uppercase tracking-wider text-[#111111] bg-white border border-[#111111]/20"
                >
                  <span>PROFILE / {user.name}</span>
                  <User className="w-4 h-4" />
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-xs font-mono font-medium uppercase tracking-wider text-[#dc2626] bg-[#dc2626]/10 border border-[#dc2626]"
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
                  className="flex items-center justify-between px-3 py-2.5 text-xs font-mono font-medium uppercase tracking-wider text-white bg-[#dc2626]"
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
                  className="text-center py-2.5 text-xs font-mono font-medium uppercase tracking-wider text-[#111111] bg-white border border-[#111111]/20"
                >
                  LOG IN
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#dc2626] border border-[#111111]"
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
