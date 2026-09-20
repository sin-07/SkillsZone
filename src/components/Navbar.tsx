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
    <header className="sticky top-0 z-40 w-full border-b-[3px] border-black bg-[#fdfbf7]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo - Brutalist Block */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-black text-[#facc15] flex items-center justify-center font-mono font-black text-base tracking-tight border-2 border-black shadow-[3px_3px_0px_#facc15] group-hover:bg-[#ef4444] group-hover:text-white group-hover:shadow-[3px_3px_0px_#000000] transition-all">
              CG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-black">
                  COLONY<span className="text-[#ef4444]">GAMES</span>
                </span>
                <span className="text-[10px] font-mono font-black tracking-wider px-2 py-0.5 border-2 border-black bg-[#facc15] text-black shadow-[2px_2px_0px_#000000]">
                  2026
                </span>
              </div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60 hidden sm:block">
                SOCIETY SPORTS FEST • OCT 15–18
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="ml-2 px-4 py-2 text-xs font-mono font-black uppercase tracking-wider bg-[#facc15] hover:bg-[#ef4444] hover:text-white text-black transition-all border-2 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center gap-2"
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
                  className={`px-3 py-1.5 text-xs font-mono font-black uppercase tracking-wider transition-all border-2 ${
                    active
                      ? 'border-black bg-white text-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-black/70 hover:text-black hover:border-black/30'
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-black uppercase tracking-wider border-2 border-black text-black bg-[#facc15] shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                ADMIN
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000] hover:bg-[#fefce8] transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 bg-white border-2 border-black text-black hover:bg-[#ef4444] hover:text-white shadow-[2px_2px_0px_#000000] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black hover:underline transition-all"
                >
                  LOGIN
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs font-mono font-black uppercase tracking-wider bg-black hover:bg-[#ef4444] text-white border-2 border-black shadow-[3px_3px_0px_#000000] transition-all"
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
                className="p-2 bg-[#facc15] text-black border-2 border-black"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000000]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-black bg-[#fdfbf7] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-mono font-black uppercase tracking-wider border-2 border-black transition-all ${
                  link.highlight
                    ? 'bg-[#facc15] text-black shadow-[3px_3px_0px_#000000]'
                    : active
                    ? 'bg-white text-black shadow-[3px_3px_0px_#000000]'
                    : 'bg-transparent text-black hover:bg-white'
                }`}
              >
                <span>{link.label}</span>
                <span>→</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t-2 border-black flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white border-2 border-black"
                >
                  <span>PROFILE / {user.name}</span>
                  <User className="w-4 h-4" />
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#facc15] border-2 border-black"
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
                  className="flex items-center justify-between px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#ef4444] border-2 border-black"
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
                  className="text-center py-2.5 text-xs font-mono font-black uppercase tracking-wider text-black bg-white border-2 border-black shadow-[2px_2px_0px_#000000]"
                >
                  LOG IN
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-mono font-black uppercase tracking-wider text-white bg-black hover:bg-[#ef4444] border-2 border-black shadow-[2px_2px_0px_#000000]"
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
