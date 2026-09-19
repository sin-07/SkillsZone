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
  HeartHandshake,
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

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* Pinned Urgent Announcements Banner */}
      {announcements.length > 0 && announcements[0]?.isPinned && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border-b border-blue-200 px-4 py-2.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-medium truncate">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping shrink-0" />
              <Megaphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <strong className="text-blue-950 shrink-0">{announcements[0].title}:</strong>
              <span className="text-slate-600 truncate">{announcements[0].content}</span>
            </div>
            <Link
              href="/events"
              className="text-blue-700 hover:text-blue-800 whitespace-nowrap font-bold text-[11px] underline shrink-0"
            >
              Learn More →
            </Link>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-8 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Soft Blue Mesh Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[350px] bg-gradient-to-tr from-blue-400/10 via-cyan-400/10 to-indigo-400/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Green Meadows Annual Society Championship</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-700 font-bold">Oct 15 - 18, 2026</span>
          </div>

          {/* Massive Athletic Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
            CHAMPIONSHIP GLORY FOR EVERY{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              SOCIETY FAMILY.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Uniting 50+ families and 250+ athletes in a 4-day festival of Cricket, Football,
            Badminton, Table Tennis, 100m Sprint, and Tower Pride.
          </p>

          {/* Countdown Timer Widget */}
          <div className="pt-2 flex justify-center">
            <CountdownTimer targetDate="2026-10-15T08:00:00" />
          </div>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-base shadow-xl shadow-blue-500/25 hover:brightness-110 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 text-white" />
              Register Family & Get Pass
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/events"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-md backdrop-blur-md transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              Explore Sports & Rules
            </Link>
          </div>

          {/* Quick society trust points */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Zero Registration Fee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Official Dry-Fit Society Jersey
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Digital QR Code Gate Pass
            </span>
          </div>
        </div>
      </section>

      {/* ================= STATS COUNTER STRIP ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40">
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">50+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Participating Families
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-600">250+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Potential Athletes
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-cyan-600">9</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sports & Tournaments
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-500">27</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Podium Medals & Trophies
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED SPORTS SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Fest Tournaments
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Sports Roster & Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              From fast cricket knockouts to slow cycling balance, find the perfect sport for you and your family.
            </p>
          </div>

          {/* Category Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-sm self-start md:self-auto">
            {['All', 'Individual', 'Team', 'Family'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900'
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

        <div className="text-center pt-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
          >
            View Full Rulebook, Age Categories & Venues <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ================= HOW REGISTRATION WORKS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-white border border-blue-100 p-8 sm:p-12 space-y-10 shadow-lg">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              How Society Registration Works
            </h2>
            <p className="text-xs text-slate-500">
              Instant digital registration designed for speed on mobile or desktop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-base flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Add Your Family Roster</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your flat number, tower, and list participating family members along with their t-shirt sizes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 font-black text-base flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Pick Your Sports</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enroll each member into eligible sports. Automatic age criteria verification guarantees fair play.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black text-base flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Instant QR & PDF Pass</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download your official printable tournament pass with embedded QR code. Also sent directly to your inbox.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition hover:scale-105 active:scale-95"
            >
              Start Family Registration <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD PODIUM PREVIEW ================= */}
      {topFamilies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Live Standings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Family Championship Podium
              </h2>
            </div>
            <Link
              href="/results"
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              View Full Standings & Medals <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topFamilies.map((fam, idx) => (
              <div
                key={fam._id}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-amber-700 text-white'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{fam.familyName}</h4>
                    <p className="text-xs text-slate-500">
                      {fam.blockTower} • Unit {fam.houseNumber}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-blue-600">{fam.points} pts</div>
                  <div className="text-[10px] text-slate-500">
                    🥇 {fam.medals?.gold || 0} • 🥈 {fam.medals?.silver || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= FINAL REGISTRATION CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Represent Your Tower?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 font-medium">
              Join 50+ society families in the biggest sporting celebration of the year.
              Free participation kits and digital passes close once sport caps are reached.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-blue-900 font-bold text-sm shadow-xl transition hover:scale-105 active:scale-95"
            >
              Claim Family Entry Pass
            </Link>
            <Link
              href="/events"
              className="px-8 py-4 rounded-2xl bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-sm transition border border-blue-400/40"
            >
              Browse Event Schedule
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
