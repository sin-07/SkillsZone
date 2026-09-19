'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import EventCard, { EventItem } from '@/components/EventCard';
import {
  Trophy,
  Users,
  Flame,
  Shield,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Medal,
  Award,
  ChevronRight,
  Megaphone,
  QrCode,
  Zap,
  Activity,
  MapPin,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [announcements, setAnnouncements] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topFamilies, setTopFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function loadInitialData() {
      try {
        await fetch('/api/seed');

        const [evRes, annRes, resRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/announcements'),
          fetch('/api/results'),
        ]);

        if (evRes.ok) {
          const d = await evRes.json();
          setEvents(d.events || []);
        }
        if (annRes.ok) {
          const d = await annRes.json();
          setAnnouncements(d.announcements || []);
        }
        if (resRes.ok) {
          const d = await resRes.json();
          setTopFamilies((d.familyLeaderboard || []).slice(0, 3));
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
      {/* Pinned Urgent Announcements Banner */}
      {announcements.length > 0 && announcements[0]?.isPinned && (
        <div className="bg-blue-50 text-blue-950 px-4 py-2.5 shadow-xs border-b border-blue-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 font-medium truncate">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping shrink-0" />
              <Megaphone className="w-4 h-4 text-blue-600 shrink-0" />
              <strong className="text-blue-950 shrink-0">{announcements[0].title}:</strong>
              <span className="text-blue-800 truncate">{announcements[0].content}</span>
            </div>
            <Link
              href="/events"
              className="text-blue-700 hover:text-blue-900 whitespace-nowrap font-bold text-[11px] underline shrink-0"
            >
              Learn More →
            </Link>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION (HIGH IMPACT ASYMMETRIC) ================= */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Editorial Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Green Meadows Annual Sports Fest</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-700 font-bold">Oct 15 – 18, 2026</span>
            </div>

            {/* Main Athletic Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
                9 TOURNAMENTS. <br />
                6 TOWERS.{' '}
                <span className="text-blue-600">
                  ONE CUP.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal pt-2">
                The premier inter-block sports championship for Green Meadows. Uniting 50+ families
                and 250+ resident athletes across floodlit Cricket, Football, Badminton, Track Sprint, and Table Tennis.
              </p>
            </div>

            {/* Countdown Widget */}
            <div className="pt-1">
              <CountdownTimer targetDate="2026-10-15T08:00:00" />
            </div>

            {/* Hero Action Station */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-sm sm:text-base hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Register Family & Get Pass</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/events"
                className="px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>View 9 Tournaments</span>
              </Link>
            </div>

            {/* Society Guarantee Points */}
            <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Free Resident Entry
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Official Dry-Fit Society Jersey
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Digital QR Code Pass
              </span>
            </div>
          </div>

          {/* Right Column: Live Tournament Match Center Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-lg">
              {/* Stadium Header Visual */}
              <div className="relative h-56 w-full bg-slate-950 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80"
                  alt="Green Meadows Sports Fest Stadium"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-slate-950/40" />

                {/* Live Status Pill */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/90 text-white text-[11px] font-bold tracking-wider uppercase border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Registrations Active</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300 block">
                    Society Sports Festival 2026
                  </span>
                  <h3 className="text-xl font-black text-white">
                    Tournament Command Center
                  </h3>
                </div>
              </div>

              {/* Card Body: Live Numbers & Next Matches */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Live Capacity Ticker */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Total Athlete Capacity</span>
                    <span className="text-blue-700">
                      {totalRegistered || 184} / {totalCapacity || 250} Athletes ({overallPercent || 74}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${overallPercent || 74}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Remaining slots filling across Tower A, B, C, D, E, F. Register before Oct 12 deadline.
                  </p>
                </div>

                {/* Opening Event Highlight */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Opening Day Spotlight
                  </span>
                  <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          Box Cricket League (T10)
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-blue-600" /> Oct 15 • 08:00 AM • Main Oval
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/events/cricket-t10"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Rules →
                    </Link>
                  </div>
                </div>

                {/* Tower Standings Quick Look */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500">Current Tower Cup Leader:</span>
                    <p className="text-xs font-bold text-slate-900">🏆 Tower A Gladiators (140 pts)</p>
                  </div>
                  <Link
                    href="/results"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Standings <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS COUNTER STRIP ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">50+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Participating Families
            </div>
            <p className="text-[11px] text-slate-400">Representing all 6 towers</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-600">250+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resident Athletes
            </div>
            <p className="text-[11px] text-slate-400">Ages 6 to 75 competing</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">9</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sports Tournaments
            </div>
            <p className="text-[11px] text-slate-400">Team, Individual & Family</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-500">27</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Podium Medals & Cups
            </div>
            <p className="text-[11px] text-slate-400">Gold, Silver & Bronze honors</p>
          </div>
        </div>
      </section>

      {/* ================= FEATURED SPORTS SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
              Championship Tournaments
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2.5">
              Official Sports Roster
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Every tournament is officially officiated with dedicated referees, certified equipment, and electronic score tracking.
            </p>
          </div>

          {/* Category Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs self-start md:self-auto">
            {['All', 'Individual', 'Team', 'Family'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 transition shadow-xs"
          >
            <span>View All Tournaments, Age Categories & Venues</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </Link>
        </div>
      </section>

      {/* ================= THE COLONYGAMES EXPERIENCE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            Tournament Standards
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Built for Serious Sport & Society Pride
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Experience a professional-grade championship environment right in our residential community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Instant Digital Pass</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalized digital passes with security QR codes and printable PDF passes for check-in at tournament gates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Live Tower Standings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated points table updated after every match. Tower pride is on the line for the Annual Society Champions Trophy.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Official Dri-Fit Kit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every registered participant receives an official tournament jersey tailored to their selected size before opening ceremony.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Referees & Medical</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              External certified referees for unbiased fair play, alongside on-site first aid, hydration lounges, and score marshals.
            </p>
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD PODIUM PREVIEW ================= */}
      {topFamilies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Championship Standings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Family & Tower Leaderboard
              </h2>
            </div>
            <Link
              href="/results"
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              Full Standings & Medals <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topFamilies.map((fam, idx) => (
              <div
                key={fam._id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800 font-bold'
                        : 'bg-amber-700 text-white font-bold'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{fam.familyName}</h4>
                    <p className="text-xs text-slate-500">
                      {fam.blockTower} • Flat {fam.houseNumber}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">{fam.points} <span className="text-xs text-slate-500 font-semibold">pts</span></div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {fam.medals?.gold || 0} Gold • {fam.medals?.silver || 0} Silver
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= HOW REGISTRATION WORKS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white border border-slate-200 p-8 sm:p-12 space-y-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Simple 3-Step Roster Registration
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              How Your Family Enrolls
            </h2>
            <p className="text-xs text-slate-500">
              Designed for speed on smartphone or desktop in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Add Flat & Family Roster</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your flat number, tower, and list participating family members with their custom t-shirt sizes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Pick Tournament Sports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select eligible sports for each member. Age criteria and team limits are validated automatically.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Instant QR & PDF Pass</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download your official printable tournament pass with embedded QR code. Also sent directly to your inbox.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition"
            >
              <span>Begin Family Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FINAL REGISTRATION STADIUM CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-blue-700 p-8 sm:p-14 text-center text-white space-y-6 shadow-lg border border-blue-600 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
              Registration Closing Soon
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Ready to Represent Your Tower?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
              Join 50+ society families in the biggest sporting celebration of the year.
              Free participation kits and digital passes close once sport caps are reached.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-bold text-sm shadow-md transition"
            >
              Claim Family Entry Pass
            </Link>
            <Link
              href="/events"
              className="px-8 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm transition border border-blue-500/40"
            >
              Browse Event Schedule
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
