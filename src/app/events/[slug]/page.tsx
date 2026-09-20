'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Users,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';
import { EventItem } from '@/components/EventCard';

interface Props {
  params: Promise<{ slug: string }>;
}

const SPORT_IMAGE_FALLBACKS: Record<string, string> = {
  'Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
  'Football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
  'Hockey': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=1200&q=80',
  'Table Tennis': 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80',
  'Race': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  'Slow Cycling': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
  'Badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
  'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  'Custom': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
};

export default function EventDetailPage({ params }: Props) {
  const { slug } = use(params);
  const { success } = useToast();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (!res.ok) {
          setError('Event not found.');
          return;
        }
        const data = await res.json();
        setEvent(data.event);
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Failed to fetch event.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title || 'ColonyGames Event',
        text: `Check out ${event?.title} at ColonyGames 2026!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Loading tournament details...
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-mono">
        <h2 className="text-xl font-bold text-[#111111] mb-2 uppercase">Event Not Found</h2>
        <p className="text-xs text-[#666666] mb-6">The requested sports discipline does not exist in the official roster.</p>
        <Link
          href="/events"
          className="px-5 py-2.5 bg-[#111111] hover:bg-[#dc2626] text-white text-xs font-mono font-bold uppercase tracking-wider border border-[#111111] transition-colors"
        >
          Back to All Tournaments
        </Link>
      </div>
    );
  }

  const percentFilled = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.maxParticipants || 32)) * 100)
  );

  const spotsRemaining = Math.max(0, event.maxParticipants - event.registeredCount);
  const heroImage = event.bannerImage || SPORT_IMAGE_FALLBACKS[event.sportType] || SPORT_IMAGE_FALLBACKS['Custom'];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back Link and Share */}
      <div className="flex items-center justify-between gap-4 mb-6 font-mono">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#111111] hover:text-[#dc2626] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sports Directory
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#111111]/30 text-[#111111] text-xs font-medium uppercase tracking-wider hover:border-[#111111] transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" /> Share Sport
        </button>
      </div>

      {/* Main Banner Card with Real Photography */}
      <div className="bg-white border border-[#111111] overflow-hidden shadow-xs mb-8">
        <div className="relative h-64 sm:h-80 w-full bg-[#111111] overflow-hidden">
          <img
            src={heroImage}
            alt={event.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider">
              <span className="text-white bg-[#111111] px-2.5 py-1 border border-white/20">
                {event.sportType}
              </span>
              <span className="text-white bg-black/60 px-2.5 py-1 border border-white/15">
                {event.category} Category • Team of {event.teamSize}
              </span>
              <span
                className={`px-2.5 py-1 text-white border ${
                  event.status === 'open'
                    ? 'bg-[#111111] border-[#dc2626] text-white'
                    : 'bg-[#dc2626] border-[#dc2626] text-white'
                }`}
              >
                {event.status === 'open' ? `${spotsRemaining} Spots Available` : 'Closed'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mb-6">
            {event.description}
          </p>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Schedule Date
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                {event.scheduleDate}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Match Time Slot
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                {event.scheduleTime}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Venue Location
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                {event.venue}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Age Requirement
              </span>
              <span className="text-sm font-bold text-blue-700 mt-1 block flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                {event.minAge} – {event.maxAge} years
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules and Registration Action Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Official Tournament Rules */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-md">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              Tournament Rules & Guidelines
            </h2>

            {event.rules && event.rules.length > 0 ? (
              <ul className="space-y-3 text-sm text-slate-700">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Standard society sports fest guidelines apply.</p>
            )}
          </div>
        </div>

        {/* Right: Registration Sticky Card - Swiss Module */}
        <div>
          <div className="bg-white border border-[#111111] p-6 space-y-5 sticky top-24 shadow-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111]">ENROLLMENT STATUS</h3>
              <span className="text-[10px] bg-[#111111] text-white px-1.5 py-0.5">ROSTER</span>
            </div>

            {/* Capacity Progress */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#666666] uppercase text-[10px]">SLOTS FILLED</span>
                <span className="text-[#111111] font-bold">
                  {event.registeredCount} / {event.maxParticipants} ATHLETES
                </span>
              </div>
              <div className="w-full h-2 bg-[#f4f4f0] border border-[#111111]/20 overflow-hidden">
                <div
                  className="h-full bg-[#dc2626] transition-all duration-500"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <span className="text-[10px] text-[#dc2626] font-bold uppercase tracking-wider mt-1.5 block">
                {spotsRemaining} SLOTS REMAINING IN THIS EVENT
              </span>
            </div>

            <div className="pt-2 border-t border-[#111111]/15 text-xs text-[#555555] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                <span>Zero registration fee for society families</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                <span>Official T-shirt &amp; digital QR pass included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                <span>Points count toward Tower Championship</span>
              </div>
            </div>

            <Link
              href={`/register?sport=${encodeURIComponent(event.sportType)}`}
              className="w-full py-3.5 px-4 bg-[#111111] hover:bg-[#dc2626] text-white font-mono font-bold text-xs uppercase tracking-widest border border-[#111111] transition-colors flex items-center justify-center gap-2 text-center"
            >
              <span>REGISTER FAMILY FOR THIS SPORT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
