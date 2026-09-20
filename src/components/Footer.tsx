import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#111111]/20 bg-[#f4f4f0] text-[#111111] text-xs no-print relative overflow-hidden">
      {/* Background Architectural Monogram */}
      <div className="absolute right-0 bottom-0 pointer-events-none select-none text-[12vw] font-black text-[#111111]/[0.03] leading-none tracking-tighter uppercase font-mono">
        CG•26
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1 border-b md:border-b-0 md:border-r border-[#111111]/15 pb-8 md:pb-0 md:pr-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">
              [01] OFFICIAL ORGAN
            </div>
            <div className="space-y-1">
              <span className="text-xl font-black tracking-tighter uppercase text-[#111111] block">
                COLONY<span className="text-[#dc2626]">GAMES</span>
              </span>
              <p className="text-[11px] text-[#444444] leading-relaxed">
                Green Meadows Annual Inter-Tower Championship. An uncompromising festival of athletic discipline and community prestige.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#111111]">
              <ShieldCheck className="w-4 h-4 text-[#dc2626]" />
              <span>RWA ACCREDITED • 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 border-b md:border-b-0 md:border-r border-[#111111]/15 pb-8 md:pb-0 md:pr-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">
              [02] DIRECTORY
            </div>
            <ul className="space-y-2.5 font-mono text-[11px] uppercase tracking-wider">
              <li>
                <Link href="/events" className="hover:text-[#dc2626] transition-colors flex items-center justify-between">
                  <span>Tournaments & Rules</span>
                  <span>↗</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#dc2626] transition-colors flex items-center justify-between">
                  <span>Roster Registration</span>
                  <span>↗</span>
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-[#dc2626] transition-colors flex items-center justify-between">
                  <span>Podium & Leaderboard</span>
                  <span>↗</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#dc2626] transition-colors flex items-center justify-between">
                  <span>Athlete Passes</span>
                  <span>↗</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports Disciplines */}
          <div className="space-y-4 border-b md:border-b-0 md:border-r border-[#111111]/15 pb-8 md:pb-0 md:pr-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">
              [03] 9 DISCIPLINES
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase tracking-wider text-[#444444]">
              <span>01. Cricket T10</span>
              <span>02. Football 5v5</span>
              <span>03. Hockey SO</span>
              <span>04. Table Tennis</span>
              <span>05. 100m Sprint</span>
              <span>06. Slow Cycling</span>
              <span>07. Badminton</span>
              <span>08. 3x3 Basketball</span>
              <span>09. Tug of War</span>
            </div>
          </div>

          {/* Committee / Logistics */}
          <div className="space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">
              [04] DISPATCH & HQ
            </div>
            <div className="space-y-2.5 text-[11px] font-mono text-[#444444]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                <span>Central Sports Complex, Green Meadows Ground</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>+91 98765 43210 (Desk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>hq@colonygames.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-14 pt-6 border-t border-[#111111]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-[#666666]">
          <p>© 2026 COLONYGAMES • PUBLISHED BY GREEN MEADOWS SPORTS COMMITTEE</p>
          <p className="text-[#111111]">
            TYPOGRAPHY: NEUE GROTESK • BUILT FOR RESIDENTS
          </p>
        </div>
      </div>
    </footer>
  );
}
