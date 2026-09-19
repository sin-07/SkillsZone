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

const getSportIcon = (sportType: string) => {
  switch (sportType) {
    case 'Cricket':
      return Shield;
    case 'Football':
      return Flame;
    case 'Hockey':
      return Zap;
    case 'Table Tennis':
      return Target;
    case 'Race':
      return Timer;
    case 'Slow Cycling':
      return Compass;
    case 'Badminton':
      return Award;
    case 'Basketball':
      return Activity;
    default:
      return Trophy;
  }
};

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
  const Icon = getSportIcon(event.sportType);
  const registered = event.registeredCount || 0;
  const max = event.maxParticipants || 32;
  const percentFilled = Math.min(100, Math.round((registered / max) * 100));
  const spotsLeft = Math.max(0, max - registered);

  const displayImage = event.bannerImage || SPORT_IMAGE_FALLBACKS[event.sportType] || SPORT_IMAGE_FALLBACKS['Custom'];

  return (
    <div className="group rounded-2xl bg-white border border-slate-200 hover:border-blue-600 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg">
      {/* High-Impact Sports Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={displayImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        {/* Scrim overlay for crisp badge readability */}
        <div className="absolute inset-0 bg-slate-950/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold tracking-wider uppercase border border-white/15">
            <Icon className="w-3.5 h-3.5 text-blue-400" />
            <span>{event.sportType}</span>
          </div>

          <div>
            {event.status === 'open' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white text-blue-900 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                {spotsLeft <= 6 ? `${spotsLeft} Spots Left` : 'Open'}
              </span>
            )}
            {event.status === 'closing-soon' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                Closing Fast
              </span>
            )}
            {event.status === 'closed' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white shadow-xs">
                Full / Closed
              </span>
            )}
            {event.status === 'completed' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Bottom Format Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[10px] font-semibold uppercase tracking-wider border border-white/10">
            {event.category} • Team of {event.teamSize}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1.5">
            {event.description}
          </p>
        </div>

        {/* Meta Info Grid */}
        <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Schedule:
            </span>
            <span className="font-semibold text-slate-900 truncate max-w-[180px]">
              {event.scheduleDate} • {event.scheduleTime.split('-')[0]}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Venue:
            </span>
            <span className="font-semibold text-slate-900 truncate max-w-[180px]">
              {event.venue}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Eligibility:
            </span>
            <span className="font-semibold text-slate-900">
              Age {event.minAge} – {event.maxAge} yrs
            </span>
          </div>
        </div>

        {/* Precision Capacity Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-500">Registration Capacity</span>
            <span className="text-slate-900 font-bold">
              {registered} / {max} <span className="text-slate-400 font-normal">({percentFilled}%)</span>
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentFilled >= 90
                  ? 'bg-rose-600'
                  : percentFilled >= 70
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={`/events/${event.slug || event._id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 group/btn shadow-xs"
          >
            <span>View Rulebook & Register</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
