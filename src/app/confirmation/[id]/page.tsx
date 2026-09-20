'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Download,
  Printer,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ConfirmationPassPage({ params }: Props) {
  const { id } = use(params);
  const { success } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPass() {
      try {
        const res = await fetch(`/api/registrations/${id}`);
        if (!res.ok) {
          setError('Pass not found or registration code is invalid.');
          return;
        }
        const data = await res.json();
        setRegistration(data.registration);
      } catch (err) {
        console.error('Error fetching pass:', err);
        setError('Failed to load pass details.');
      } finally {
        setLoading(false);
      }
    }
    fetchPass();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ColonyGames 2026 Athlete Pass',
        text: `Official ColonyGames 2026 entry pass for ${registration?.contactName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Pass link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Loading Official Pass...
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
          <Trophy className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Registration Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          We couldn&apos;t find an official tournament pass with registration code <strong>{id}</strong>.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-[#dc2626] text-white text-xs font-mono font-bold uppercase tracking-wider border border-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    );
  }

  const family = registration.familyId;

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Top Actions Bar (Hidden when printing) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium uppercase tracking-wider text-[#111111] hover:text-[#dc2626] transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f4f4f0] text-[#111111] text-xs font-mono font-medium uppercase tracking-wider border border-[#111111]/30 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#f4f4f0] text-[#111111] text-xs font-mono font-medium uppercase tracking-wider border border-[#111111]/30 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print Pass
            </button>
            <a
              href={`/api/registrations/${registration.registrationId}/pdf`}
              download
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#111111] hover:bg-[#dc2626] text-white text-xs font-mono font-bold uppercase tracking-wider border border-[#111111] transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> PDF Pass
            </a>
          </div>
        </div>

        {/* Physical Pass Design Container - Swiss Cultural Event Ticket */}
        <div className="bg-white border border-[#111111] overflow-hidden font-mono print:border-none shadow-xs">
          {/* Header Banner */}
          <div className="bg-[#111111] p-6 sm:p-8 text-white relative border-b border-[#111111]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#aaaaaa] border border-white/20 px-2 py-0.5">
                  OFFICIAL ATHLETIC CREDENTIAL • 2026
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white mt-2 uppercase tracking-tight">
                  COLONYGAMES 2026
                </h1>
                <p className="text-[11px] text-[#cccccc] mt-1 flex items-center gap-1.5 uppercase">
                  <MapPin className="w-3.5 h-3.5 text-[#dc2626]" /> CENTRAL SPORTS COMPLEX & GROUNDS
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dc2626] text-white text-[11px] font-black tracking-widest uppercase">
                  <ShieldCheck className="w-4 h-4" /> CONFIRMED
                </div>
                <div className="text-[10px] text-[#aaaaaa] mt-1 font-mono uppercase">
                  PASS ID: <strong className="text-white">{registration.registrationId}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Details & QR Section */}
          <div className="p-6 sm:p-8 space-y-8 bg-white">
            {/* Section 01: Household Dossier */}
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111] mb-3">
                [01] REGISTRATION & HOUSEHOLD DOSSIER
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-5 border border-[#111111]/20 bg-[#fafaf7]">
                <div className="md:col-span-2 space-y-4 font-mono">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#666666] block">
                      Family & Residence
                    </span>
                    <div className="text-base font-bold text-[#111111] mt-0.5">
                      {family?.familyName || registration.contactName}
                    </div>
                    <div className="text-xs text-[#dc2626] font-bold mt-0.5">
                      {family?.blockTower || 'Society Block'} • Unit {family?.houseNumber || '-'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-1 border-t border-[#111111]/10">
                    <div>
                      <span className="text-[10px] uppercase text-[#666666] block">Primary Contact</span>
                      <span className="text-[#111111] font-bold">{registration.contactName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#666666] block">Phone</span>
                      <span className="text-[#111111] font-bold">{registration.contactPhone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#666666] block">Email Address</span>
                      <span className="text-[#111111] font-bold truncate block">{registration.contactEmail}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#666666] block">Gate Status</span>
                      <span
                        className={`font-bold ${
                          registration.checkIn?.isCheckedIn ? 'text-emerald-700' : 'text-[#dc2626]'
                        }`}
                      >
                        {registration.checkIn?.isCheckedIn ? 'CHECKED IN' : 'READY AT GATE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-[#111111] shadow-xs">
                  {registration.qrCodeDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={registration.qrCodeDataUrl}
                      alt="Registration Pass QR"
                      className="w-36 h-36 object-contain"
                    />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center text-xs text-[#666666] font-mono">
                      QR Ready
                    </div>
                  )}
                  <span className="text-[9px] font-mono font-bold text-[#111111] tracking-widest uppercase mt-2">
                    SCAN FOR GATE ENTRY
                  </span>
                </div>
              </div>
            </div>

            {/* Section 02: Registered Athletes & Sports Table */}
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111] mb-3 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#dc2626]" />
                [02] REGISTERED ATHLETES & SPORTS ({registration.entries.length} ENTRIES)
              </div>
              <div className="border border-[#111111] overflow-hidden divide-y divide-[#111111]/15 font-mono">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-3 p-3 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-4">Athlete</div>
                  <div className="col-span-4">Sport & Event</div>
                  <div className="col-span-3 text-right">Details / Role</div>
                </div>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {registration.entries.map((entry: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3.5 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center text-xs ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#fafaf7]'
                    }`}
                  >
                    <div className="col-span-1 hidden sm:block text-center font-bold text-[#666666]">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="col-span-4">
                      <div className="font-bold text-[#111111] text-sm">
                        {entry.participantName}
                      </div>
                      <div className="text-[11px] text-[#666666]">
                        Athlete #{idx + 1}
                      </div>
                    </div>

                    <div className="col-span-4">
                      <div className="font-bold text-[#111111]">{entry.eventTitle}</div>
                      <div className="text-[10px] text-[#dc2626] font-bold uppercase tracking-wider">
                        {entry.sportType}
                      </div>
                    </div>

                    <div className="col-span-3 sm:text-right flex flex-wrap sm:justify-end items-center gap-1.5 pt-1 sm:pt-0">
                      {entry.sportSpecificInfo?.role && (
                        <span className="text-[10px] px-2 py-0.5 bg-white text-[#111111] border border-[#111111]/30 font-bold">
                          {entry.sportSpecificInfo.role}
                        </span>
                      )}
                      {entry.sportSpecificInfo?.partnerName && (
                        <span className="text-[10px] px-2 py-0.5 bg-white text-[#111111] border border-[#111111]/30 font-bold">
                          P: {entry.sportSpecificInfo.partnerName}
                        </span>
                      )}
                      {entry.sportSpecificInfo?.bicycleOption && (
                        <span className="text-[10px] px-2 py-0.5 bg-white text-[#111111] border border-[#111111]/30 font-bold">
                          {entry.sportSpecificInfo.bicycleOption}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 03: Gate Protocols & Directives */}
            <div className="p-4 bg-[#fdf2f2] border border-[#fca5a5] border-l-4 border-l-[#dc2626] text-xs font-mono space-y-1.5">
              <div className="font-bold text-[#991b1b] text-[10px] uppercase tracking-wider mb-1">
                [03] GATE ACCESS PROTOCOLS & ATHLETE DIRECTIVES
              </div>
              <p className="text-[#7f1d1d] text-[11px] leading-relaxed">
                [01] Present this digital pass or printed QR code at Tower-C Club Lounge to collect athlete jerseys.
              </p>
              <p className="text-[#7f1d1d] text-[11px] leading-relaxed">
                [02] Arrive at designated courts/grounds 15 minutes before scheduled match fixtures.
              </p>
              <p className="text-[#7f1d1d] text-[11px] leading-relaxed">
                [03] Non-marking footwear is mandatory for indoor badminton and table tennis arenas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
