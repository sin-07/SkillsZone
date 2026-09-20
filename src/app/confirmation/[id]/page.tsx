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
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Family & Household
                  </h3>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {family?.familyName || registration.contactName}
                  </div>
                  <div className="text-sm text-blue-600 font-semibold">
                    {family?.blockTower || 'Society Block'} • Unit {family?.houseNumber || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Primary Contact</span>
                    <span className="text-slate-800 font-semibold">{registration.contactName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone</span>
                    <span className="text-slate-800 font-semibold">{registration.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email Address</span>
                    <span className="text-slate-800 font-semibold">{registration.contactEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gate Check-in Status</span>
                    <span
                      className={`font-semibold ${
                        registration.checkIn?.isCheckedIn ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {registration.checkIn?.isCheckedIn ? 'Checked In' : 'Pending at Gate'}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl shadow-xs border border-slate-200">
                {registration.qrCodeDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={registration.qrCodeDataUrl}
                    alt="Registration Pass QR"
                    className="w-40 h-40 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-xs text-slate-500">
                    QR Ready
                  </div>
                )}
                <span className="text-[10px] font-bold text-slate-700 tracking-wider uppercase mt-1">
                  Scan for Gate Entry
                </span>
              </div>
            </div>

            {/* Registered Athletes & Sports Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Registered Athletes & Sports ({registration.entries.length} entries)
              </h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {registration.entries.map((entry: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {entry.participantName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Sport: <strong className="text-blue-700">{entry.eventTitle}</strong> ({entry.sportType})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {entry.sportSpecificInfo?.role && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                          Role: {entry.sportSpecificInfo.role}
                        </span>
                      )}
                      {entry.sportSpecificInfo?.partnerName && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                          Partner: {entry.sportSpecificInfo.partnerName}
                        </span>
                      )}
                      {entry.sportSpecificInfo?.bicycleOption && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                          Cycle: {entry.sportSpecificInfo.bicycleOption}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Instructions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-900 mb-1">Gate Pass & Event Day Instructions:</div>
              <p>1. Present this digital pass or printed QR code at the Central Clubhouse desk to claim official society t-shirts.</p>
              <p>2. Arrive at designated courts 15 minutes before scheduled match fixtures.</p>
              <p>3. Non-marking footwear is mandatory for indoor badminton and table tennis arenas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
