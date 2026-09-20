'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Flame,
  Zap,
  Target,
  Timer,
  Compass,
  Award,
  Activity,
  Trophy,
} from 'lucide-react';

export interface EventItem {
  _id: string;
  title: string;
  slug: string;
  sportType: string;
  category: 'Individual' | 'Team' | 'Family';
  description: string;
  rules?: string[];
  minAge: number;
  maxAge: number;
  teamSize: number;
  maxParticipants: number;
  registeredCount: number;
  venue: string;
  scheduleDate: string;
  scheduleTime: string;
  status: 'open' | 'closing-soon' | 'closed' | 'completed';
  iconName?: string;
  bannerImage?: string;
}

const SPORT_IMAGE_FALLBACKS: Record<string, string> = {
  'Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
  'Football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
  'Hockey': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=800&q=80',
  'Table Tennis': 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
  'Race': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  'Slow Cycling': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
  'Badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  'Custom': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
};

export default function EventCard({ event }: { event: EventItem }) {
  const registered = event.registeredCount || 0;
  const max = event.maxParticipants || 32;
  const percentFilled = Math.min(100, Math.round((registered / max) * 100));
  const spotsLeft = Math.max(0, max - registered);

  const displayImage = event.bannerImage || SPORT_IMAGE_FALLBACKS[event.sportType] || SPORT_IMAGE_FALLBACKS['Custom'];

  return (
    <div className="group bg-white border border-[#111111]/20 hover:border-[#111111] transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* High-Contrast Swiss Photo Frame */}
      <div className="relative h-48 w-full overflow-hidden bg-[#111111] border-b border-[#111111]/20">
        <img
          src={displayImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#111111]/25" />

        {/* Top Architectural Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <div className="px-2 py-0.5 bg-[#111111] text-white font-mono text-[10px] font-bold tracking-widest uppercase border border-white/20">
            {event.sportType}
          </div>

          <div>
            {event.status === 'open' && (
              <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-white text-[#111111] border border-[#111111]/30">
                {spotsLeft <= 6 ? `${spotsLeft} SPOTS LEFT` : 'OPEN'}
              </span>
            )}
            {event.status === 'closing-soon' && (
              <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#dc2626] text-white">
                CLOSING FAST
              </span>
            )}
            {event.status === 'closed' && (
              <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#111111] text-white">
                CAPACITY FULL
              </span>
            )}
            {event.status === 'completed' && (
              <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-[#888888] text-white">
                COMPLETED
              </span>
            )}
          </div>
        </div>

        {/* Bottom Format Badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 bg-white/95 text-[#111111] font-mono text-[9px] font-bold uppercase tracking-widest border border-[#111111]/20">
            {event.category} • TEAM OF {event.teamSize}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h3 className="text-base font-black uppercase tracking-tight text-[#111111] group-hover:text-[#dc2626] transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed mt-1 font-normal">
            {event.description}
          </p>
        </div>

        {/* Meta Info Grid */}
        <div className="space-y-1.5 pt-3 border-t border-[#111111]/10 font-mono text-[11px] text-[#444444]">
          <div className="flex items-center justify-between">
            <span className="text-[#888888] uppercase">SCHEDULE:</span>
            <span className="font-bold text-[#111111] truncate max-w-[180px]">
              {event.scheduleDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#888888] uppercase">VENUE:</span>
            <span className="font-bold text-[#111111] truncate max-w-[180px]">
              {event.venue}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#888888] uppercase">ELIGIBILITY:</span>
            <span className="font-bold text-[#111111]">
              AGE {event.minAge}–{event.maxAge} YRS
            </span>
          </div>
        </div>

        {/* Precision Capacity Meter */}
        <div className="space-y-1 pt-1 font-mono">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#888888] uppercase">ROSTER CAPACITY</span>
            <span className="text-[#111111] font-bold">
              {registered}/{max} ({percentFilled}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#ebebe6] overflow-hidden border border-[#111111]/15">
            <div
              className={`h-full transition-all duration-300 ${
                percentFilled >= 90
                  ? 'bg-[#dc2626]'
                  : 'bg-[#111111]'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={`/events/${event.slug || event._id}`}
            className="w-full py-2.5 px-4 bg-[#111111] hover:bg-[#dc2626] text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group/btn border border-[#111111]"
          >
            <span>VIEW RULES & REGISTER</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
