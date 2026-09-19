import React from 'react';
import Link from 'next/link';
import { Trophy, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/90 bg-white text-slate-600 text-sm no-print shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Trophy className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                COLONY<span className="text-blue-600">GAMES</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              The premier annual society sports fest bringing 50+ families together across 9 sports, camaraderie, and championship glory.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Official RWA Sanctioned Event
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Tournament</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/events" className="hover:text-blue-600 transition">All Sports & Rules</Link></li>
              <li><Link href="/register" className="hover:text-blue-600 transition">Family Registration</Link></li>
              <li><Link href="/results" className="hover:text-blue-600 transition">Live Medal Tally</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 transition">Download Digital Pass</Link></li>
            </ul>
          </div>

          {/* Sports Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Featured Sports</h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-500">
              <span>Box Cricket T10</span>
              <span>5v5 Football</span>
              <span>Hockey Shootout</span>
              <span>Table Tennis</span>
              <span>100m Sprint</span>
              <span>Slow Cycling</span>
              <span>Badminton Open</span>
              <span>3x3 Basketball</span>
            </div>
          </div>

          {/* Organizing Committee & Help Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Help Desk & First Aid</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Central Clubhouse, Sports Grounds</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>+91 98765 43210 (Control Room)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>sports@colonygames.internal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ColonyGames • Green Meadows Sports Committee. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Society Residents
          </p>
        </div>
      </div>
    </footer>
  );
}
