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

export default function EventCard({ event }: { event: EventItem }) {
  const Icon = getSportIcon(event.sportType);
  const percentFilled = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.maxParticipants || 32)) * 100)
  );

  const spotsLeft = Math.max(0, event.maxParticipants - event.registeredCount);

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10">
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-blue-600 opacity-90 group-hover:opacity-100 transition" />

      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                {event.sportType}
              </span>
              <span className="text-[11px] block text-slate-500">
                {event.category} Event
              </span>
            </div>
          </div>

          <div>
            {event.status === 'open' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                {spotsLeft <= 5 ? `${spotsLeft} Spots Left!` : 'Open'}
              </span>
            )}
            {event.status === 'closing-soon' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Closing Soon
              </span>
            )}
            {event.status === 'closed' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Full / Closed
              </span>
            )}
            {event.status === 'completed' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
          {event.title}
        </h3>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {event.description}
        </p>

        {/* Meta Info Grid */}
        <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Date & Time:
            </span>
            <span className="font-medium text-slate-800 text-right truncate max-w-[170px]">
              {event.scheduleDate} • {event.scheduleTime.split('-')[0]}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Venue:
            </span>
            <span className="font-medium text-slate-800 text-right truncate max-w-[170px]">
              {event.venue}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Age Bracket:
            </span>
            <span className="font-semibold text-blue-700">
              {event.minAge} – {event.maxAge} years
            </span>
          </div>
        </div>

        {/* Capacity Meter */}
        <div className="mt-4 mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-slate-500">Registration Capacity</span>
            <span className="text-slate-700">
              <strong className="text-slate-900">{event.registeredCount}</strong> / {event.maxParticipants} athletes
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentFilled >= 90
                  ? 'bg-rose-500'
                  : percentFilled >= 70
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
        <Link
          href={`/events/${event.slug || event._id}`}
          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition flex items-center justify-center gap-1.5"
        >
          View Rules & Details
        </Link>
        <Link
          href={`/register?sport=${encodeURIComponent(event.sportType)}`}
          className="py-2.5 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition flex items-center justify-center gap-1 shadow-sm"
        >
          Register <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
