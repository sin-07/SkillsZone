'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import EventCard, { EventItem } from '@/components/EventCard';
import {
  Calendar,
  ArrowRight,
  ChevronRight,
  Clock,
  Megaphone,
  QrCode,
  Trophy,
  Activity,
  Check,
  Shield,
} from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: string;
  isPinned?: boolean;
}

interface FamilyLeaderboardItem {
  _id: string;
  familyName: string;
  blockTower: string;
  houseNumber: string;
  points: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [topFamilies, setTopFamilies] = useState<FamilyLeaderboardItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [eventsRes, announceRes, resultsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/announcements'),
          fetch('/api/results'),
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData.events || []);
        }
        if (announceRes.ok) {
          const aData = await announceRes.json();
          setAnnouncements(aData.announcements || []);
        }
        if (resultsRes.ok) {
          const rData = await resultsRes.json();
          setTopFamilies(rData.familyLeaderboard?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter((e) => e.category === activeCategory);

  const totalRegistered = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);
  const totalCapacity = events.reduce((acc, curr) => acc + (curr.maxParticipants || 0), 0) || 300;
  const overallPercent = Math.min(100, Math.round((totalRegistered / totalCapacity) * 100));

  return (
    <div className="pb-20 overflow-hidden">
      {/* Pinned Urgent Announcements Banner - Swiss Dispatch */}
      {announcements.length > 0 && announcements[0]?.isPinned && (
        <div className="bg-[#111111] text-white px-4 py-2 border-b border-[#111111]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2 h-2 bg-[#dc2626] animate-pulse shrink-0" />
              <Megaphone className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
              <strong className="text-white uppercase tracking-wider shrink-0">[DISPATCH]:</strong>
              <span className="text-[#cccccc] truncate">{announcements[0].title} — {announcements[0].content}</span>
            </div>
            <Link
              href="/events"
              className="text-[#dc2626] hover:text-white uppercase font-bold text-[10px] tracking-widest shrink-0 underline"
            >
              DETAILS →
            </Link>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION (SWISS INTERNATIONAL TYPOGRAPHIC STYLE) ================= */}
      <section className="relative pt-3 sm:pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background Monogram Watermark */}
        <div className="absolute right-0 top-10 pointer-events-none select-none text-[20vw] font-black text-[#111111]/[0.025] leading-none tracking-tighter uppercase font-mono">
          2026
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
          {/* Left Column: Mathematically Scaled Swiss Typography */}
          <div className="lg:col-span-7 min-w-0 space-y-6 sm:space-y-8">
            {/* Swiss Catalog Reference */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#111111]">
              <span className="px-1.5 py-0.5 bg-[#dc2626] text-white">REF 01</span>
              <span>GREEN MEADOWS ANNUAL SPORTS FESTIVAL</span>
              <span className="text-[#888888]">•</span>
              <span className="text-[#555555]">OCT 15 – 18, 2026</span>
            </div>

            {/* Disciplined Swiss Headline (Scaled to never overlap or clip behind cards) */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#111111] tracking-tighter uppercase leading-[0.98] break-normal">
                9 TOURNAMENTS.<br />
                6 TOWERS.<br />
                <span className="text-[#dc2626]">ONE TROPHY.</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#444444] max-w-lg leading-relaxed font-normal pt-2 border-t border-[#111111]/15 font-sans">
                The official inter-tower residential championship. Uniting 50+ families and 250+ resident athletes across
                certified Box Cricket, Football, Badminton, Track Sprint, Table Tennis, and Tug of War.
              </p>
            </div>

            {/* Swiss Tabular Countdown Ticker */}
            <div className="pt-1">
              <CountdownTimer targetDate="2026-10-15T08:00:00" />
            </div>

            {/* Action Station */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/register"
                className="px-7 py-4 bg-[#111111] hover:bg-[#dc2626] text-white font-mono font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-[#111111] group shadow-xs"
              >
                <span>REGISTER FAMILY & GET PASS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/events"
                className="px-6 py-4 bg-white hover:bg-[#f4f4f0] text-[#111111] font-mono font-bold text-xs uppercase tracking-widest border border-[#111111] transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#dc2626]" />
                <span>ALL 9 DISCIPLINES</span>
              </Link>
            </div>

            {/* Swiss Specifications */}
            <div className="pt-1 flex flex-wrap items-center gap-5 font-mono text-[10px] text-[#555555] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#dc2626]" /> FREE RESIDENT ENTRY
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#dc2626]" /> OFFICIAL SOCIETY KIT
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#dc2626]" /> DIGITAL QR ENTRY PASS
              </span>
            </div>
          </div>

          {/* Right Column: Swiss Match Command Center Card */}
          <div className="lg:col-span-5 min-w-0">
            <div className="bg-white border border-[#111111] overflow-hidden shadow-xs">
              {/* Stadium Arena Blueprint Graphic (SVG, 100% reliable, zero broken images) */}
              <div className="bg-[#111111] text-white p-6 relative overflow-hidden border-b border-[#111111]">
                {/* SVG Blueprint Grid */}
                <svg
                  className="absolute right-[-10px] top-[-10px] w-44 h-44 opacity-20 pointer-events-none"
                  viewBox="0 0 200 200"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <circle cx="100" cy="100" r="85" strokeDasharray="6 6" />
                  <circle cx="100" cy="100" r="50" />
                  <circle cx="100" cy="100" r="10" fill="white" />
                  <line x1="15" y1="100" x2="185" y2="100" strokeWidth="2" />
                  <line x1="100" y1="15" x2="100" y2="185" strokeWidth="2" />
                  <rect x="60" y="60" width="80" height="80" strokeWidth="1.5" />
                </svg>

                <div className="flex items-center justify-between gap-2 mb-4 relative z-10 font-mono">
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-[#dc2626] text-white text-[9px] font-bold tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 bg-white animate-pulse" />
                    <span>GATE STATUS: ACTIVE</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#aaaaaa]">
                    NO. 2026-HQ
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#888888] block">
                    EDITION 2026 // LOGISTICS
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    TOURNAMENT COMMAND CENTER
                  </h3>
                  <p className="text-[11px] font-mono text-[#aaaaaa]">
                    CENTRAL RESIDENTIAL SPORTS COMPLEX
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Live Capacity Meter */}
                <div className="p-4 bg-[#f4f4f0] border border-[#111111]/15 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#555555] uppercase">TOTAL ROSTER QUOTA</span>
                    <span className="text-[#111111]">
                      {totalRegistered || 184} / {totalCapacity || 250} ({overallPercent || 74}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white border border-[#111111]/20 overflow-hidden">
                    <div
                      className="h-full bg-[#111111] transition-all duration-500"
                      style={{ width: `${overallPercent || 74}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#666666] uppercase tracking-wider">
                    REMAINING SLOTS OPEN ACROSS TOWERS A–F. REGISTRATION CLOSES OCT 12.
                  </p>
                </div>

                {/* Opening Day Spotlight */}
                <div className="space-y-2 font-mono">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#888888]">
                    OPENING DAY SPOTLIGHT
                  </span>
                  <div className="p-3 border border-[#111111]/20 hover:border-[#111111] transition-colors flex items-center justify-between bg-white">
                    <div>
                      <h4 className="font-bold text-[#111111] text-xs uppercase">
                        BOX CRICKET LEAGUE (T10)
                      </h4>
                      <p className="text-[10px] text-[#666666] flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-[#dc2626]" /> OCT 15 • 08:00 AM • MAIN OVAL
                      </p>
                    </div>
                    <Link
                      href="/events/cricket-t10"
                      className="text-xs font-bold text-[#dc2626] hover:underline"
                    >
                      RULES →
                    </Link>
                  </div>
                </div>

                {/* Tower Standings Snapshot */}
                <div className="pt-3 border-t border-[#111111]/15 flex items-center justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-[#666666] uppercase">CURRENT TOWER LEADER:</span>
                    <p className="text-xs font-black text-[#111111]">TOWER A GLADIATORS (140 PTS)</p>
                  </div>
                  <Link
                    href="/results"
                    className="text-xs font-bold text-[#dc2626] hover:underline flex items-center gap-1 uppercase"
                  >
                    STANDINGS <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LOWER SECTIONS CONTAINER ================= */}
      <div className="space-y-14 sm:space-y-20 mt-10 sm:mt-14">
        {/* ================= STATS COUNTER STRIP (SWISS MODULAR GRID) ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[#111111] bg-white divide-x divide-y md:divide-y-0 divide-[#111111]/15 font-mono shadow-xs">
          <div className="p-6 sm:p-8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#888888] tracking-widest block">
              [01] PARTICIPATION
            </span>
            <div className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight">50+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              FAMILIES ENROLLED
            </div>
            <p className="text-[10px] text-[#777777] uppercase">ACROSS ALL 6 TOWERS</p>
          </div>

          <div className="p-6 sm:p-8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#888888] tracking-widest block">
              [02] ATHLETES
            </span>
            <div className="text-4xl sm:text-5xl font-black text-[#dc2626] tracking-tight">250+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              RESIDENT ATHLETES
            </div>
            <p className="text-[10px] text-[#777777] uppercase">AGES 6 TO 75 COMPETING</p>
          </div>

          <div className="p-6 sm:p-8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#888888] tracking-widest block">
              [03] DISCIPLINES
            </span>
            <div className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight">09</div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              TOURNAMENTS
            </div>
            <p className="text-[10px] text-[#777777] uppercase">TEAM, INDIVIDUAL & FAMILY</p>
          </div>

          <div className="p-6 sm:p-8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#888888] tracking-widest block">
              [04] HONORS
            </span>
            <div className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight">27</div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              PODIUM MEDALS & CUPS
            </div>
            <p className="text-[10px] text-[#777777] uppercase">GOLD, SILVER & BRONZE</p>
          </div>
        </div>
      </section>

      {/* ================= FEATURED SPORTS EXHIBITION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#111111]/20">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">
              [ DIRECTORY // 09 DISCIPLINES ]
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
              OFFICIAL SPORTS ROSTER
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-xl font-normal font-sans">
              Every tournament is officially officiated with certified referees, standardized equipment, and electronic scoring.
            </p>
          </div>

          {/* Category Switcher - Swiss Modular Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#111111]/20 self-start md:self-auto font-mono">
            {['All', 'Individual', 'Team', 'Family'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-white'
                    : 'text-[#555555] hover:text-[#111111] hover:bg-[#f4f4f0]'
                }`}
              >
                [{cat}]
              </button>
            ))}
          </div>
        </div>

        {/* Sports Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-[#111111] hover:text-white border border-[#111111] font-mono text-xs font-bold uppercase tracking-widest text-[#111111] transition-colors"
          >
            <span>VIEW ALL TOURNAMENT SPECIFICATIONS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#dc2626]" />
          </Link>
        </div>
      </section>

      {/* ================= TOURNAMENT STANDARDS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="pb-4 border-b border-[#111111]/20">
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">
            [ STANDARDS // REGULATIONS ]
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            BUILT FOR SERIOUS SPORT
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] mt-1 font-sans">
            A professional championship standard upheld across all venues and tournament gates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-[#111111] bg-white divide-y lg:divide-y-0 lg:divide-x divide-[#111111]/15 font-mono shadow-xs">
          <div className="p-6 space-y-3">
            <span className="text-[10px] font-bold text-[#888888] tracking-widest uppercase">REG.01</span>
            <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4 text-[#dc2626]" />
            </div>
            <h3 className="font-bold text-sm uppercase text-[#111111]">DIGITAL QR ENTRY PASS</h3>
            <p className="text-xs text-[#555555] leading-relaxed font-sans">
              Personalized passes with cryptographic QR codes and printable PDF credentials for gate validation.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <span className="text-[10px] font-bold text-[#888888] tracking-widest uppercase">REG.02</span>
            <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center font-bold">
              <Trophy className="w-4 h-4 text-[#dc2626]" />
            </div>
            <h3 className="font-bold text-sm uppercase text-[#111111]">TOWER CUP SCORING</h3>
            <p className="text-xs text-[#555555] leading-relaxed font-sans">
              Automated points table updated immediately after each match. Gold earns 10 pts, Silver 7, Bronze 5.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <span className="text-[10px] font-bold text-[#888888] tracking-widest uppercase">REG.03</span>
            <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center font-bold">
              <Shield className="w-4 h-4 text-[#dc2626]" />
            </div>
            <h3 className="font-bold text-sm uppercase text-[#111111]">OFFICIAL ATHLETIC KIT</h3>
            <p className="text-xs text-[#555555] leading-relaxed font-sans">
              Every registered participant receives an official tournament jersey tailored to their exact size.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <span className="text-[10px] font-bold text-[#888888] tracking-widest uppercase">REG.04</span>
            <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center font-bold">
              <Activity className="w-4 h-4 text-[#dc2626]" />
            </div>
            <h3 className="font-bold text-sm uppercase text-[#111111]">REFEREES & MEDICAL</h3>
            <p className="text-xs text-[#555555] leading-relaxed font-sans">
              External certified referees ensure unbiased fair play, alongside on-site first aid and hydration points.
            </p>
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD PODIUM PREVIEW ================= */}
      {topFamilies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#111111]/20">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#dc2626]">
                [ 2026 // STANDINGS ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
                FAMILY & TOWER LEADERBOARD
              </h2>
            </div>
            <Link
              href="/results"
              className="font-mono text-xs font-bold text-[#111111] hover:text-[#dc2626] uppercase flex items-center gap-1"
            >
              FULL TALLY <ChevronRight className="w-4 h-4 text-[#dc2626]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {topFamilies.map((fam, idx) => (
              <div
                key={fam._id}
                className="p-6 bg-white border border-[#111111] flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 font-black text-sm flex items-center justify-center ${
                      idx === 0
                        ? 'bg-[#111111] text-white'
                        : idx === 1
                        ? 'bg-[#444444] text-white'
                        : 'bg-[#777777] text-white'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111111] text-sm uppercase">{fam.familyName}</h4>
                    <p className="text-[10px] text-[#666666] uppercase">
                      {fam.blockTower} • UNIT {fam.houseNumber}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-[#111111]">
                    {fam.points} <span className="text-[10px] text-[#888888]">PTS</span>
                  </div>
                  <div className="text-[10px] text-[#dc2626] font-bold">
                    {fam.medals?.gold || 0}G • {fam.medals?.silver || 0}S
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 3-STEP ENROLLMENT PROCESS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#111111] bg-white p-8 sm:p-12 space-y-10 shadow-xs">
          <div className="pb-4 border-b border-[#111111]/20">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#dc2626]">
              [ PROTOCOL // 03 STEPS ]
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
              HOW YOUR FAMILY ENROLLS
            </h2>
            <p className="text-xs text-[#555555] font-mono uppercase mt-1">
              DESIGNED FOR SPEED ON MOBILE OR DESKTOP IN UNDER 2 MINUTES.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono">
            <div className="p-6 bg-[#f4f4f0] border border-[#111111]/20 space-y-3">
              <div className="w-8 h-8 bg-[#111111] text-white font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="text-xs font-bold uppercase text-[#111111]">TOWER & ROSTER DETAILS</h3>
              <p className="text-xs text-[#555555] leading-relaxed font-sans">
                Provide flat number, select block/tower, and enter participating members with custom kit sizes.
              </p>
            </div>

            <div className="p-6 bg-[#f4f4f0] border border-[#111111]/20 space-y-3">
              <div className="w-8 h-8 bg-[#111111] text-white font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="text-xs font-bold uppercase text-[#111111]">ALLOCATE TOURNAMENTS</h3>
              <p className="text-xs text-[#555555] leading-relaxed font-sans">
                Assign eligible sports per member. Age criteria and team restrictions are validated in real-time.
              </p>
            </div>

            <div className="p-6 bg-[#f4f4f0] border border-[#111111]/20 space-y-3">
              <div className="w-8 h-8 bg-[#111111] text-white font-bold text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="text-xs font-bold uppercase text-[#111111]">INSTANT QR & PDF PASS</h3>
              <p className="text-xs text-[#555555] leading-relaxed font-sans">
                Receive your official pass with embedded QR code. Also dispatched instantly to your email inbox.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#111111] hover:bg-[#dc2626] text-white font-mono font-bold text-xs uppercase tracking-widest transition-colors border border-[#111111]"
            >
              <span>START FAMILY REGISTRATION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FINAL REGISTRATION ARCHITECTURAL CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#111111] bg-[#111111] p-8 sm:p-16 text-center text-white space-y-6 relative overflow-hidden shadow-xs">
          {/* Architectural Background Lettering */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 font-mono text-[20vw] font-black text-white">
            CHAMPION
          </div>

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#dc2626]">
              [ DEADLINE: OCT 12 // FINAL CALL ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              REPRESENT YOUR TOWER. <br /> CLAIM YOUR GLORY.
            </h2>
            <p className="text-xs sm:text-sm text-[#aaaaaa] font-normal leading-relaxed font-mono">
              Join 50+ families in the biggest sporting celebration of Green Meadows.
              Official jersey quotas close once team slots are filled.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 font-mono">
            <Link
              href="/register"
              className="px-8 py-4 bg-white hover:bg-[#dc2626] hover:text-white text-[#111111] font-bold text-xs uppercase tracking-widest transition-colors"
            >
              CLAIM OFFICIAL ENTRY PASS
            </Link>
            <Link
              href="/events"
              className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-colors border border-white/30"
            >
              BROWSE 9 TOURNAMENTS
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
