'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
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
    <div className="group bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000] hover:shadow-[10px_10px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-150 flex flex-col justify-between overflow-hidden">
      {/* High-Contrast Photo Frame */}
      <div className="relative h-48 w-full overflow-hidden bg-black border-b-[3px] border-black">
        <img
          src={displayImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            // Fallback gracefully on broken images
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Top Brutalist Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <div className="px-2.5 py-1 bg-[#facc15] text-black font-mono text-[10px] font-black tracking-wider uppercase border-2 border-black shadow-[2px_2px_0px_#000000]">
            {event.sportType}
          </div>

          <div>
            {event.status === 'open' && (
              <span className="px-2.5 py-1 font-mono text-[10px] font-black bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                {spotsLeft <= 6 ? `${spotsLeft} SPOTS LEFT` : 'OPEN'}
              </span>
            )}
            {event.status === 'closing-soon' && (
              <span className="px-2.5 py-1 font-mono text-[10px] font-black bg-[#ef4444] text-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                CLOSING FAST
              </span>
            )}
            {event.status === 'closed' && (
              <span className="px-2.5 py-1 font-mono text-[10px] font-black bg-black text-white border-2 border-white shadow-[2px_2px_0px_#000000]">
                CAPACITY FULL
              </span>
            )}
            {event.status === 'completed' && (
              <span className="px-2.5 py-1 font-mono text-[10px] font-black bg-[#64748b] text-white border-2 border-black">
                COMPLETED
              </span>
            )}
          </div>
        </div>

        {/* Bottom Format Badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 bg-white text-black font-mono text-[9px] font-black uppercase tracking-wider border-2 border-black">
            {event.category} • TEAM OF {event.teamSize}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:text-[#ef4444] transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-black/75 line-clamp-2 leading-relaxed mt-1 font-medium">
            {event.description}
          </p>
        </div>

        {/* Meta Info Grid */}
        <div className="space-y-1.5 pt-3 border-t-2 border-black font-mono text-[11px] text-black">
          <div className="flex items-center justify-between">
            <span className="text-black/60 uppercase font-bold">SCHEDULE:</span>
            <span className="font-black text-black truncate max-w-[180px]">
              {event.scheduleDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-black/60 uppercase font-bold">VENUE:</span>
            <span className="font-black text-black truncate max-w-[180px]">
              {event.venue}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-black/60 uppercase font-bold">ELIGIBILITY:</span>
            <span className="font-black text-black">
              AGE {event.minAge}–{event.maxAge} YRS
            </span>
          </div>
        </div>

        {/* Precision Capacity Meter */}
        <div className="space-y-1 pt-1 font-mono">
          <div className="flex items-center justify-between text-[10px] font-black">
            <span className="text-black/70 uppercase">ROSTER CAPACITY</span>
            <span className="text-black">
              {registered}/{max} ({percentFilled}%)
            </span>
          </div>
          <div className="h-3 w-full bg-white border-2 border-black overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                percentFilled >= 90
                  ? 'bg-[#ef4444]'
                  : 'bg-[#facc15]'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={`/events/${event.slug || event._id}`}
            className="w-full py-3 px-4 bg-black hover:bg-[#ef4444] text-white font-mono text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group/btn border-2 border-black shadow-[3px_3px_0px_#facc15] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <span>VIEW RULES & REGISTER</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
