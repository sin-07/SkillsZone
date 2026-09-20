'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import EventCard, { EventItem } from '@/components/EventCard';
import {
  Calendar,
  Shield,
  ArrowRight,
  ChevronRight,
  Clock,
  Megaphone,
  QrCode,
  Trophy,
  Activity,
  Flame,
  Award,
  Zap,
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
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* Pinned Urgent Announcements Banner - Brutalist Hazard Ticker */}
      {announcements.length > 0 && announcements[0]?.isPinned && (
        <div className="bg-[#facc15] text-black px-4 py-3 border-b-2 border-black font-mono font-bold shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3 truncate">
              <span className="w-3 h-3 bg-[#ef4444] border border-black animate-ping shrink-0" />
              <Megaphone className="w-4 h-4 shrink-0" />
              <strong className="uppercase bg-black text-white px-2 py-0.5 text-xs shrink-0">
                DISPATCH:
              </strong>
              <span className="truncate">{announcements[0].title} — {announcements[0].content}</span>
            </div>
            <Link
              href="/events"
              className="bg-black text-white hover:bg-[#ef4444] px-3 py-1 uppercase text-xs font-black tracking-widest shrink-0 border border-black transition-colors"
            >
              DETAILS →
            </Link>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION (HIGH IMPACT NEO-BRUTALIST) ================= */}
      <section className="relative pt-6 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heavy Typographic Composition */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Brutalist Ref Badge */}
            <div className="flex flex-wrap items-center gap-2 font-mono">
              <span className="bg-[#ef4444] text-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_#000000]">
                REF 01 // 2026
              </span>
              <span className="bg-[#facc15] text-black border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_#000000]">
                GREEN MEADOWS ANNUAL SPORTS FESTIVAL
              </span>
              <span className="bg-white text-black border-2 border-black px-2.5 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_#000000]">
                OCT 15 – 18
              </span>
            </div>

            {/* Massive Monumental Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-black tracking-tighter uppercase leading-[0.88]">
                9 TOURNAMENTS.<br />
                6 TOWERS.<br />
                <span className="inline-block bg-[#ef4444] text-white px-3 sm:px-4 py-1 border-[3px] border-black shadow-[6px_6px_0px_#000000] -rotate-1 mt-2">
                  ONE TROPHY.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-black font-medium max-w-xl leading-relaxed pt-3 border-l-4 border-black pl-4 bg-white/60 py-2 border-y border-r border-black/20">
                The premier inter-tower residential championship. Uniting 50+ families and 250+ resident athletes across
                floodlit Box Cricket, Football, Badminton, Track Sprint, Table Tennis, and Tug of War.
              </p>
            </div>

            {/* Brutalist Mechanical Countdown Ticker */}
            <div className="pt-2">
              <CountdownTimer targetDate="2026-10-15T08:00:00" />
            </div>

            {/* Unmissable Brutalist Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/register"
                className="px-8 py-5 bg-black hover:bg-[#ef4444] text-white font-mono font-black text-sm sm:text-base uppercase tracking-wider border-[3px] border-black shadow-[6px_6px_0px_#facc15] hover:shadow-[2px_2px_0px_#facc15] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 group"
              >
                <span>CLAIM ENTRY PASS NOW</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/events"
                className="px-7 py-5 bg-[#facc15] hover:bg-[#fde047] text-black font-mono font-black text-sm sm:text-base uppercase tracking-wider border-[3px] border-black shadow-[6px_6px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>EXPLORE 9 SPORTS</span>
              </Link>
            </div>

            {/* Brutalist Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="px-3 py-1 bg-white border-2 border-black font-mono text-[11px] font-black uppercase shadow-[3px_3px_0px_#000000] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#ef4444]" /> 100% FREE RESIDENT ENTRY
              </span>
              <span className="px-3 py-1 bg-white border-2 border-black font-mono text-[11px] font-black uppercase shadow-[3px_3px_0px_#000000] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#facc15]" /> OFFICIAL DRI-FIT KIT
              </span>
              <span className="px-3 py-1 bg-white border-2 border-black font-mono text-[11px] font-black uppercase shadow-[3px_3px_0px_#000000] flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-black" /> DIGITAL QR GATE PASS
              </span>
            </div>
          </div>

          {/* Right Column: Brutalist Match Command Center Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_#000000] overflow-hidden">
              {/* Top Hazard Warning Strip */}
              <div className="h-3 brutal-stripes border-b-2 border-black" />

              {/* Graphic Stadium Ticket Header */}
              <div className="bg-black text-white p-6 relative overflow-hidden border-b-[3px] border-black">
                {/* Stylized Arena SVG Graphic in Background */}
                <svg
                  className="absolute right-[-20px] top-[-10px] w-48 h-48 opacity-15 pointer-events-none"
                  viewBox="0 0 200 200"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  <circle cx="100" cy="100" r="80" strokeDasharray="10 10" />
                  <circle cx="100" cy="100" r="50" />
                  <line x1="20" y1="100" x2="180" y2="100" strokeWidth="4" />
                  <line x1="100" y1="20" x2="100" y2="180" strokeWidth="4" />
                  <rect x="70" y="70" width="60" height="60" strokeWidth="3" />
                </svg>

                <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                  <div className="flex items-center gap-2 bg-[#ef4444] text-white border-2 border-white px-2.5 py-0.5 font-mono text-[10px] font-black tracking-widest uppercase">
                    <span className="w-2 h-2 bg-white animate-ping" />
                    <span>GATE STATUS: ACTIVE</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#facc15]">
                    NO. 2026-HQ
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#aaaaaa] block">
                    MATCH COMMAND CENTER
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    GREEN MEADOWS STADIUM
                  </h3>
                  <p className="text-xs font-mono text-[#cccccc]">
                    INTER-TOWER TOURNAMENT HEADQUARTERS
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-5">
                {/* Live Quota Meter */}
                <div className="p-4 bg-[#fefce8] border-2 border-black shadow-[3px_3px_0px_#000000] space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="uppercase text-black">TOTAL ROSTER QUOTA</span>
                    <span className="text-black bg-[#facc15] px-2 py-0.5 border border-black">
                      {totalRegistered || 184} / {totalCapacity || 250} ({overallPercent || 74}%)
                    </span>
                  </div>
                  <div className="h-3.5 w-full bg-white border-2 border-black overflow-hidden">
                    <div
                      className="h-full bg-[#ef4444] transition-all duration-500"
                      style={{ width: `${overallPercent || 74}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-black font-bold uppercase tracking-wider">
                    ⚡ 74% SPOTS OCCUPIED ACROSS TOWERS A–F. REGISTER BEFORE OCT 12.
                  </p>
                </div>

                {/* Opening Day Spotlight */}
                <div className="border-2 border-black bg-white p-4 shadow-[3px_3px_0px_#000000] space-y-2 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                      OPENING SPOTLIGHT
                    </span>
                    <Link
                      href="/events/cricket-t10"
                      className="text-xs font-black text-[#ef4444] hover:underline"
                    >
                      RULES →
                    </Link>
                  </div>
                  <div className="pt-1">
                    <h4 className="font-black text-black text-sm uppercase">
                      BOX CRICKET LEAGUE (T10)
                    </h4>
                    <p className="text-xs text-black/70 flex items-center gap-1.5 mt-1 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#ef4444]" /> OCT 15 • 08:00 AM • MAIN OVAL
                    </p>
                  </div>
                </div>

                {/* Tower Leader Snapshot */}
                <div className="p-4 bg-[#f4f4f0] border-2 border-black flex items-center justify-between font-mono shadow-[3px_3px_0px_#000000]">
                  <div>
                    <span className="text-[10px] text-black/60 font-bold uppercase block">
                      CURRENT TOWER LEADER:
                    </span>
                    <p className="text-xs font-black text-black uppercase">
                      🏆 TOWER A GLADIATORS (140 PTS)
                    </p>
                  </div>
                  <Link
                    href="/results"
                    className="bg-black hover:bg-[#ef4444] text-white px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-colors border border-black"
                  >
                    STANDINGS →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS COUNTER STRIP (BRUTALIST COLOR BLOCKS) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 font-mono">
          <div className="p-6 sm:p-8 bg-[#fef08a] border-2 border-black shadow-[5px_5px_0px_#000000] space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-black bg-white px-1.5 py-0.5 border border-black">
              [01] FAMILIES
            </span>
            <div className="text-4xl sm:text-6xl font-black text-black tracking-tight pt-1">50+</div>
            <div className="text-xs font-black uppercase text-black">
              HOUSEHOLDS ENROLLED
            </div>
            <p className="text-[10px] font-bold text-black/70 uppercase">ACROSS ALL 6 TOWERS</p>
          </div>

          <div className="p-6 sm:p-8 bg-[#fecaca] border-2 border-black shadow-[5px_5px_0px_#000000] space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-black bg-white px-1.5 py-0.5 border border-black">
              [02] ATHLETES
            </span>
            <div className="text-4xl sm:text-6xl font-black text-[#ef4444] tracking-tight pt-1">250+</div>
            <div className="text-xs font-black uppercase text-black">
              RESIDENT COMPETITORS
            </div>
            <p className="text-[10px] font-bold text-black/70 uppercase">AGES 6 TO 75 COMPETING</p>
          </div>

          <div className="p-6 sm:p-8 bg-[#bae6fd] border-2 border-black shadow-[5px_5px_0px_#000000] space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-black bg-white px-1.5 py-0.5 border border-black">
              [03] DISCIPLINES
            </span>
            <div className="text-4xl sm:text-6xl font-black text-black tracking-tight pt-1">09</div>
            <div className="text-xs font-black uppercase text-black">
              OFFICIAL TOURNAMENTS
            </div>
            <p className="text-[10px] font-bold text-black/70 uppercase">TEAM, SOLO & FAMILY</p>
          </div>

          <div className="p-6 sm:p-8 bg-[#bbf7d0] border-2 border-black shadow-[5px_5px_0px_#000000] space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-black bg-white px-1.5 py-0.5 border border-black">
              [04] HONORS
            </span>
            <div className="text-4xl sm:text-6xl font-black text-black tracking-tight pt-1">27</div>
            <div className="text-xs font-black uppercase text-black">
              PODIUM MEDALS & CUPS
            </div>
            <p className="text-[10px] font-bold text-black/70 uppercase">GOLD, SILVER & BRONZE</p>
          </div>
        </div>
      </section>

      {/* ================= FEATURED SPORTS SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-black">
          <div>
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#ef4444] mb-1">
              [ DIRECTORY // 09 DISCIPLINES ]
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
              OFFICIAL SPORTS ROSTER
            </h2>
            <p className="text-xs sm:text-sm text-black/70 mt-1 max-w-xl font-medium">
              Every tournament is officiated with certified referees, standardized equipment, and electronic score tracking.
            </p>
          </div>

          {/* Category Switcher - Brutalist Tabs */}
          <div className="flex items-center gap-2 font-mono">
            {['All', 'Individual', 'Team', 'Family'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-black transition-all border-2 border-black ${
                  activeCategory === cat
                    ? 'bg-black text-white shadow-[3px_3px_0px_#facc15]'
                    : 'bg-white text-black hover:bg-[#fef08a] shadow-[3px_3px_0px_#000000]'
                }`}
              >
                {cat}
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
            className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-black hover:text-white border-2 border-black font-mono text-xs font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <span>VIEW ALL 9 TOURNAMENTS & RULEBOOKS</span>
            <ArrowRight className="w-4 h-4 text-[#ef4444]" />
          </Link>
        </div>
      </section>

      {/* ================= TOURNAMENT STANDARDS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="pb-4 border-b-2 border-black">
          <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ef4444] mb-1 block">
            [ STANDARDS // REGULATIONS ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            BUILT FOR SERIOUS SPORT
          </h2>
          <p className="text-xs sm:text-sm text-black/70 mt-1 font-medium">
            A professional championship standard upheld across all residential blocks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          <div className="p-6 bg-white border-2 border-black shadow-[5px_5px_0px_#000000] space-y-3">
            <span className="text-xs font-black text-[#ef4444] tracking-widest uppercase">REG.01</span>
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold border-2 border-black shadow-[2px_2px_0px_#facc15]">
              <QrCode className="w-5 h-5 text-[#facc15]" />
            </div>
            <h3 className="font-black text-sm uppercase text-black">DIGITAL QR ENTRY PASS</h3>
            <p className="text-xs text-black/70 leading-relaxed font-sans font-medium">
              Personalized passes with cryptographic QR codes and printable PDF credentials for gate attendance.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-black shadow-[5px_5px_0px_#000000] space-y-3">
            <span className="text-xs font-black text-[#ef4444] tracking-widest uppercase">REG.02</span>
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold border-2 border-black shadow-[2px_2px_0px_#facc15]">
              <Trophy className="w-5 h-5 text-[#facc15]" />
            </div>
            <h3 className="font-black text-sm uppercase text-black">TOWER CUP SCORING</h3>
            <p className="text-xs text-black/70 leading-relaxed font-sans font-medium">
              Automated points table updated immediately after each match. Gold earns 10 pts, Silver 7, Bronze 5.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-black shadow-[5px_5px_0px_#000000] space-y-3">
            <span className="text-xs font-black text-[#ef4444] tracking-widest uppercase">REG.03</span>
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold border-2 border-black shadow-[2px_2px_0px_#facc15]">
              <Shield className="w-5 h-5 text-[#facc15]" />
            </div>
            <h3 className="font-black text-sm uppercase text-black">OFFICIAL ATHLETIC KIT</h3>
            <p className="text-xs text-black/70 leading-relaxed font-sans font-medium">
              Every registered participant receives an official society tournament jersey tailored to their exact size.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-black shadow-[5px_5px_0px_#000000] space-y-3">
            <span className="text-xs font-black text-[#ef4444] tracking-widest uppercase">REG.04</span>
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold border-2 border-black shadow-[2px_2px_0px_#facc15]">
              <Activity className="w-5 h-5 text-[#facc15]" />
            </div>
            <h3 className="font-black text-sm uppercase text-black">REFEREES & MEDICAL</h3>
            <p className="text-xs text-black/70 leading-relaxed font-sans font-medium">
              External certified referees ensure unbiased fair play, alongside on-site first aid and hydration lounges.
            </p>
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD PODIUM PREVIEW ================= */}
      {topFamilies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-black">
            <div>
              <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ef4444]">
                [ 2026 // STANDINGS ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
                FAMILY & TOWER LEADERBOARD
              </h2>
            </div>
            <Link
              href="/results"
              className="font-mono text-xs font-black text-black hover:text-[#ef4444] uppercase flex items-center gap-1 bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000000]"
            >
              FULL TALLY <ChevronRight className="w-4 h-4 text-[#ef4444]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {topFamilies.map((fam, idx) => (
              <div
                key={fam._id}
                className="p-6 bg-white border-2 border-black shadow-[5px_5px_0px_#000000] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 font-black text-sm flex items-center justify-center border-2 border-black ${
                      idx === 0
                        ? 'bg-[#facc15] text-black shadow-[2px_2px_0px_#000000]'
                        : idx === 1
                        ? 'bg-[#e2e8f0] text-black'
                        : 'bg-[#fed7aa] text-black'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-black text-sm uppercase">{fam.familyName}</h4>
                    <p className="text-[10px] text-black/70 font-bold uppercase">
                      {fam.blockTower} • UNIT {fam.houseNumber}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-black">
                    {fam.points} <span className="text-[10px] text-black/60">PTS</span>
                  </div>
                  <div className="text-[10px] text-[#ef4444] font-black">
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
        <div className="border-[3px] border-black bg-white p-8 sm:p-12 space-y-10 shadow-[8px_8px_0px_#000000]">
          <div className="pb-4 border-b-2 border-black">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ef4444]">
              [ PROTOCOL // 03 STEPS ]
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              HOW YOUR FAMILY ENROLLS
            </h2>
            <p className="text-xs text-black/70 font-mono uppercase mt-1 font-bold">
              SPEED ON SMARTPHONE OR LAPTOP IN UNDER 2 MINUTES.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono">
            <div className="p-6 bg-[#fefce8] border-2 border-black shadow-[4px_4px_0px_#000000] space-y-3">
              <div className="w-9 h-9 bg-black text-white font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#facc15]">
                01
              </div>
              <h3 className="text-xs font-black uppercase text-black">TOWER & ROSTER DETAILS</h3>
              <p className="text-xs text-black/70 leading-relaxed font-sans font-medium">
                Provide flat number, select block/tower, and enter participating members with custom kit sizes.
              </p>
            </div>

            <div className="p-6 bg-[#fefce8] border-2 border-black shadow-[4px_4px_0px_#000000] space-y-3">
              <div className="w-9 h-9 bg-black text-white font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#facc15]">
                02
              </div>
              <h3 className="text-xs font-black uppercase text-black">ALLOCATE TOURNAMENTS</h3>
              <p className="text-xs text-black/70 leading-relaxed font-sans font-medium">
                Assign eligible sports per member. Age criteria and team restrictions are validated in real-time.
              </p>
            </div>

            <div className="p-6 bg-[#fefce8] border-2 border-black shadow-[4px_4px_0px_#000000] space-y-3">
              <div className="w-9 h-9 bg-black text-white font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#facc15]">
                03
              </div>
              <h3 className="text-xs font-black uppercase text-black">INSTANT QR & PDF PASS</h3>
              <p className="text-xs text-black/70 leading-relaxed font-sans font-medium">
                Receive your official pass with embedded QR code. Also dispatched instantly to your email inbox.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-8 py-5 bg-black hover:bg-[#ef4444] text-white font-mono font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-[6px_6px_0px_#facc15] hover:shadow-[2px_2px_0px_#facc15] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <span>START FAMILY REGISTRATION</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FINAL BRUTALIST STADIUM BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-[3px] border-black bg-[#facc15] p-8 sm:p-16 text-center text-black space-y-6 relative overflow-hidden shadow-[8px_8px_0px_#000000]">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="font-mono text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1 inline-block">
              DEADLINE: OCT 12 // FINAL REGISTRATION CALL
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-black leading-none">
              REPRESENT YOUR TOWER. CLAIM YOUR TROPHY.
            </h2>
            <p className="text-xs sm:text-sm text-black font-bold leading-relaxed font-mono">
              Join 50+ families in the biggest sporting celebration of Green Meadows.
              Official jersey quotas close once team slots are filled.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 font-mono">
            <Link
              href="/register"
              className="px-8 py-5 bg-black hover:bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              CLAIM OFFICIAL ENTRY PASS
            </Link>
            <Link
              href="/events"
              className="px-8 py-5 bg-white hover:bg-black hover:text-white text-black font-black text-sm uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              BROWSE 9 TOURNAMENTS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
