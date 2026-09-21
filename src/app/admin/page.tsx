'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useToast } from '@/components/ToastContext';
import {
  Shield,
  Users,
  Trophy,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Plus,
  Trash2,
  QrCode,
  Megaphone,
  Award,
  FileSpreadsheet,
  Building,
  RefreshCw,
  Mail,
} from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'checkin' | 'registrations' | 'events' | 'families' | 'results' | 'announcements'
  >('overview');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [statsData, setStatsData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [registrations, setRegistrations] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [families, setFamilies] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Check-In Scanner / Input State
  const [checkInInput, setCheckInInput] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [checkInResult, setCheckInResult] = useState<any>(null);
  const [processingCheckIn, setProcessingCheckIn] = useState(false);

  // Email Resend Loading State
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);

  // New Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventSport, setEventSport] = useState('Cricket');
  const [eventCategory, setEventCategory] = useState<'Individual' | 'Team' | 'Family'>('Individual');
  const [eventVenue, setEventVenue] = useState('Central Society Sports Complex');
  const [eventDate, setEventDate] = useState('2026-10-16');
  const [eventTime, setEventTime] = useState('09:00 AM - 12:00 PM');
  const [eventMinAge, setEventMinAge] = useState(8);
  const [eventMaxAge, setEventMaxAge] = useState(65);
  const [eventMaxCapacity, setEventMaxCapacity] = useState(32);
  const [eventRules, setEventRules] = useState('Standard match rules apply.\nArrive 15 minutes prior to game time.');
  const [eventDesc, setEventDesc] = useState('');

  // Results Entry State
  const [resultEventId, setResultEventId] = useState('');
  const [goldWinnerName, setGoldWinnerName] = useState('');
  const [goldFamilyId, setGoldFamilyId] = useState('');
  const [goldScore, setGoldScore] = useState('');
  const [silverWinnerName, setSilverWinnerName] = useState('');
  const [silverFamilyId, setSilverFamilyId] = useState('');
  const [silverScore, setSilverScore] = useState('');
  const [bronzeWinnerName, setBronzeWinnerName] = useState('');
  const [bronzeFamilyId, setBronzeFamilyId] = useState('');
  const [bronzeScore, setBronzeScore] = useState('');
  const [submittingResult, setSubmittingResult] = useState(false);

  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [annPinned, setAnnPinned] = useState(false);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, regRes, evRes, famRes, annRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/registrations'),
        fetch('/api/events'),
        fetch('/api/families'),
        fetch('/api/announcements'),
      ]);

      if (statsRes.ok) setStatsData(await statsRes.json());
      if (regRes.ok) {
        const data = await regRes.json();
        setRegistrations(data.registrations || []);
      }
      if (evRes.ok) {
        const data = await evRes.json();
        setEvents(data.events || []);
      }
      if (famRes.ok) {
        const data = await famRes.json();
        setFamilies(data.families || []);
      }
      if (annRes.ok) {
        const data = await annRes.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      toastError('Failed to load real-time admin metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quick Gate Check-In Submit
  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInInput.trim()) return;

    setProcessingCheckIn(true);
    setCheckInResult(null);

    let searchCode = checkInInput.trim();
    try {
      if (searchCode.startsWith('{') && searchCode.endsWith('}')) {
        const parsed = JSON.parse(searchCode);
        if (parsed.id) searchCode = parsed.id;
      }
    } catch {
      // Not JSON, use raw input
    }

    try {
      const res = await fetch(`/api/registrations/${searchCode}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkedInBy: user?.name || 'Gate Marshal' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCheckInResult({
          success: true,
          registration: data.registration,
          alreadyCheckedIn: data.alreadyCheckedIn,
        });
        success(
          data.alreadyCheckedIn
            ? `Pass ${searchCode} was already checked in.`
            : `Gate Entry Approved for ${data.registration.contactName}!`
        );
        setCheckInInput('');
        fetchAllAdminData();
      } else {
        setCheckInResult({
          error: data.error || 'Invalid QR code or Pass ID not found.',
        });
        toastError(data.error || 'Gate check-in failed.');
      }
    } catch {
      setCheckInResult({ error: 'Network error checking in pass.' });
      toastError('Network error checking in pass.');
    } finally {
      setProcessingCheckIn(false);
    }
  };

  // Resend Confirmation Email with PDF Pass
  const handleResendEmail = async (regId: string, email: string) => {
    setResendingEmailId(regId);
    try {
      const res = await fetch(`/api/registrations/${regId}/email`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        success(data.message || `Official confirmation email resent to ${email}`);
      } else {
        toastError(data.error || 'Failed to dispatch confirmation email.');
      }
    } catch {
      toastError('Network error while resending confirmation email.');
    } finally {
      setResendingEmailId(null);
    }
  };

  // Create Event Handler
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    try {
      const slug = eventTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const rulesArray = eventRules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle.trim(),
          slug,
          sportType: eventSport,
          category: eventCategory,
          venue: eventVenue,
          scheduleDate: eventDate,
          scheduleTime: eventTime,
          minAge: Number(eventMinAge),
          maxAge: Number(eventMaxAge),
          maxParticipants: Number(eventMaxCapacity),
          registeredCount: 0,
          rules: rulesArray,
          description: eventDesc || `${eventSport} championship for all residents.`,
          status: 'open',
        }),
      });

      if (res.ok) {
        success(`Event "${eventTitle}" created successfully!`);
        setShowEventModal(false);
        setEventTitle('');
        setEventDesc('');
        fetchAllAdminData();
      } else {
        const data = await res.json();
        toastError(data.error || 'Failed to create event.');
      }
    } catch {
      toastError('Network error creating event.');
    }
  };

  // Delete Event Handler
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        success('Event deleted.');
        fetchAllAdminData();
      } else {
        toastError('Failed to delete event.');
      }
    } catch {
      toastError('Network error deleting event.');
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          priority: annPriority,
          isPinned: annPinned,
        }),
      });

      if (res.ok) {
        success('Announcement published to society portal!');
        setAnnTitle('');
        setAnnContent('');
        fetchAllAdminData();
      } else {
        toastError('Failed to post announcement.');
      }
    } catch {
      toastError('Network error.');
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        success('Announcement removed.');
        fetchAllAdminData();
      }
    } catch {
      toastError('Failed to delete announcement.');
    }
  };

  // Submit Match Results
  const handleSubmitResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultEventId) {
      toastError('Please select an event.');
      return;
    }

    const selectedGoldFam = families.find((f) => f._id === goldFamilyId);
    const selectedSilverFam = families.find((f) => f._id === silverFamilyId);
    const selectedBronzeFam = families.find((f) => f._id === bronzeFamilyId);

    const winners = [
      {
        rank: 1,
        participantName: goldWinnerName || 'Gold Medalist',
        familyId: goldFamilyId || undefined,
        familyName: selectedGoldFam?.familyName || 'Family',
        houseNumber: selectedGoldFam?.houseNumber || '',
        blockTower: selectedGoldFam?.blockTower || '',
        scoreOrTime: goldScore || '1st Place',
      },
    ];

    if (silverWinnerName) {
      winners.push({
        rank: 2,
        participantName: silverWinnerName,
        familyId: silverFamilyId || undefined,
        familyName: selectedSilverFam?.familyName || 'Family',
        houseNumber: selectedSilverFam?.houseNumber || '',
        blockTower: selectedSilverFam?.blockTower || '',
        scoreOrTime: silverScore || '2nd Place',
      });
    }

    if (bronzeWinnerName) {
      winners.push({
        rank: 3,
        participantName: bronzeWinnerName,
        familyId: bronzeFamilyId || undefined,
        familyName: selectedBronzeFam?.familyName || 'Family',
        houseNumber: selectedBronzeFam?.houseNumber || '',
        blockTower: selectedBronzeFam?.blockTower || '',
        scoreOrTime: bronzeScore || '3rd Place',
      });
    }

    setSubmittingResult(true);
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: resultEventId,
          winners,
        }),
      });

      if (res.ok) {
        success('Results published and championship points allocated!');
        setGoldWinnerName('');
        setSilverWinnerName('');
        setBronzeWinnerName('');
        fetchAllAdminData();
      } else {
        const d = await res.json();
        toastError(d.error || 'Failed to submit results.');
      }
    } catch {
      toastError('Network error submitting results.');
    } finally {
      setSubmittingResult(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#666666] font-mono px-4">
        <div className="flex items-center gap-3 text-center">
          <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent animate-spin shrink-0" />
          <span className="text-xs sm:text-sm">[SYSTEM: LOADING ADMIN COMMAND CENTER...]</span>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="w-14 h-14 bg-[#111111] text-white flex items-center justify-center mb-4 border border-[#111111]">
          <Shield className="w-7 h-7 text-[#dc2626]" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wider text-[#111111] mb-2">
          ADMIN CLEARANCE REQUIRED
        </h2>
        <p className="text-xs text-[#666666] max-w-sm mb-6 font-sans">
          You must be signed in with a Society Sports Committee Admin account to view this command center.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-[#111111] hover:bg-[#dc2626] text-white font-bold text-xs uppercase tracking-widest border border-[#111111] transition-colors"
        >
          Sign In as Admin ↗
        </Link>
      </div>
    );
  }

  const metrics = statsData?.metrics || {
    totalFamilies: 0,
    totalParticipants: 0,
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    checkedInCount: 0,
    checkInRate: 0,
  };

  const filteredRegs = registrations.filter((reg) => {
    const matchesStatus = statusFilter === 'All' || reg.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      reg.registrationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.familyId?.familyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.familyId?.houseNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-mono">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#111111]/20">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1 text-[10px] font-bold uppercase tracking-widest text-[#111111]">
            <span className="w-2.5 h-2.5 bg-[#dc2626]" />
            <Shield className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>SOCIETY COMMITTEE ADMIN PANEL</span>
            <span className="text-[#888888] hidden sm:inline">•</span>
            <span className="text-[#666666] hidden sm:inline">LIVE SYSTEM V2.6</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#111111] tracking-tight mt-1 uppercase break-words">
            COLONY<span className="text-[#dc2626]">GAMES</span> 2026 COMMAND CENTER
          </h1>
          <p className="text-xs text-[#555555] mt-1 font-sans">
            Real-time athlete registration metrics, gate credential scanner, sports fixtures, and medal tally.
          </p>
        </div>

        {/* Global Action Buttons - Mobile Responsive Wrap */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={fetchAllAdminData}
            title="Refresh Data"
            className="p-2.5 bg-white hover:bg-[#f4f4f0] text-[#111111] border border-[#111111]/30 transition-colors shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/api/export?view=roster"
            download
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-white hover:bg-[#f4f4f0] text-[#111111] text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-[#111111]/30 transition-colors text-center whitespace-nowrap"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#dc2626]" /> Export Roster
          </a>
          <button
            onClick={() => setShowEventModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 bg-[#111111] hover:bg-[#dc2626] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-[#111111] transition-colors text-center whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" /> Add Sport / Event
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Mobile Dropdown + Scrollable Strip */}
      <div className="space-y-2">
        {/* Mobile Tab Select Dropdown (Visible on small screens) */}
        <div className="block sm:hidden">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#666666] mb-1 block">
            SELECT MODULE:
          </label>
          <select
            value={activeTab}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-white border border-[#111111] text-[#111111] font-mono font-bold text-xs uppercase focus:outline-none"
          >
            <option value="overview">01 / METRICS OVERVIEW</option>
            <option value="checkin">02 / GATE QR CHECK-IN</option>
            <option value="registrations">03 / PASSES ({registrations.length})</option>
            <option value="events">04 / EVENTS ({events.length})</option>
            <option value="families">05 / FAMILIES ({families.length})</option>
            <option value="results">06 / PODIUM & MEDALS</option>
            <option value="announcements">07 / BROADCASTS ({announcements.length})</option>
          </select>
        </div>

        {/* Scrollable Tab Strip (Desktop & Swipeable on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#111111]/20 -mx-3 px-3 sm:mx-0 sm:px-0 touch-pan-x">
          {[
            { id: 'overview', label: '01 / METRICS', icon: Trophy },
            { id: 'checkin', label: '02 / GATE CHECK-IN', icon: QrCode },
            { id: 'registrations', label: `03 / PASSES (${registrations.length})`, icon: Users },
            { id: 'events', label: `04 / EVENTS (${events.length})`, icon: Calendar },
            { id: 'families', label: `05 / FAMILIES (${families.length})`, icon: Building },
            { id: 'results', label: '06 / PODIUM', icon: Award },
            { id: 'announcements', label: '07 / BROADCASTS', icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border shrink-0 ${
                  isActive
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111] hover:bg-[#f4f4f0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW METRICS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Key Stat Cards - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="p-3.5 sm:p-5 bg-white border border-[#111111] space-y-1.5 shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#666666] uppercase tracking-widest block truncate">
                [01] TOTAL HOUSEHOLDS
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#111111]">{metrics.totalFamilies}</div>
              <span className="text-[10px] sm:text-[11px] text-[#dc2626] font-bold block uppercase tracking-wider truncate">
                Society Residences
              </span>
            </div>

            <div className="p-3.5 sm:p-5 bg-white border border-[#111111] space-y-1.5 shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#666666] uppercase tracking-widest block truncate">
                [02] ATHLETE ENTRIES
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#111111]">{metrics.totalParticipants}</div>
              <span className="text-[10px] sm:text-[11px] text-[#666666] font-bold block uppercase tracking-wider truncate">
                Competitors
              </span>
            </div>

            <div className="p-3.5 sm:p-5 bg-white border border-[#111111] space-y-1.5 shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#666666] uppercase tracking-widest block truncate">
                [03] PASSES ISSUED
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#111111]">{metrics.totalRegistrations}</div>
              <span className="text-[10px] sm:text-[11px] text-[#dc2626] font-bold block uppercase tracking-wider truncate">
                {metrics.confirmedRegistrations} Confirmed
              </span>
            </div>

            <div className="p-3.5 sm:p-5 bg-white border border-[#111111] space-y-1.5 shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#666666] uppercase tracking-widest block truncate">
                [04] GATE CHECK-IN
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#111111]">
                {metrics.checkedInCount}{' '}
                <span className="text-xs sm:text-sm font-normal text-[#666666]">({metrics.checkInRate}%)</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#666666] font-bold block uppercase tracking-wider truncate">
                Verified at Gates
              </span>
            </div>
          </div>

          {/* Event Capacity Meters Grid */}
          <div className="bg-white border border-[#111111] p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#111111]/15 pb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
                  EVENT-WISE CAPACITY ALLOCATION
                </h3>
                <p className="text-[11px] sm:text-xs text-[#666666] mt-0.5 font-sans">
                  Real-time quota utilization for each tournament
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => {
                const filledPct = Math.min(
                  100,
                  Math.round(((ev.registeredCount || 0) / (ev.maxParticipants || 32)) * 100)
                );
                return (
                  <div
                    key={ev._id}
                    className="p-3.5 sm:p-4 bg-[#fafaf7] border border-[#111111]/20 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#111111] truncate">
                        {ev.title}
                      </span>
                      <span className="text-[9px] font-bold text-white bg-[#111111] px-1.5 py-0.5 uppercase tracking-wider shrink-0">
                        {ev.sportType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#555555]">
                      <span>
                        {ev.registeredCount} / {ev.maxParticipants} entries
                      </span>
                      <span className="font-bold text-[#111111]">{filledPct}%</span>
                    </div>

                    <div className="w-full h-2 bg-[#e5e5e0] overflow-hidden border border-[#111111]/15">
                      <div
                        className={`h-full transition-all duration-500 ${
                          filledPct >= 90 ? 'bg-[#dc2626]' : 'bg-[#111111]'
                        }`}
                        style={{ width: `${filledPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: GATE QR CHECK-IN ================= */}
      {activeTab === 'checkin' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-4 sm:p-8 bg-white border border-[#111111] space-y-5 shadow-xs">
            <div className="text-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[#111111] text-white flex items-center justify-center mx-auto mb-3 border border-[#111111]">
                <QrCode className="w-5 sm:w-6 h-5 sm:h-6 text-[#dc2626]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#111111]">
                [GATE ACCESS TERMINAL • SCANNER]
              </h2>
              <p className="text-xs text-[#666666] mt-1 font-sans">
                Scan athlete QR credential with camera / scanner or enter Registration Pass ID (e.g. CG-2026-XXXX).
              </p>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-3.5">
              <div className="relative">
                <input
                  type="text"
                  value={checkInInput}
                  onChange={(e) => setCheckInInput(e.target.value)}
                  placeholder="Scan QR payload or enter ID (e.g. CG-2026-XXXX)..."
                  className="w-full px-3.5 py-3 bg-[#fafaf7] border border-[#111111] text-[#111111] placeholder-[#888888] text-xs font-mono focus:outline-none focus:bg-white"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={processingCheckIn}
                className="w-full py-3 bg-[#111111] hover:bg-[#dc2626] text-white font-bold text-xs uppercase tracking-widest border border-[#111111] transition-colors"
              >
                {processingCheckIn ? 'VERIFYING CREDENTIAL...' : 'VERIFY PASS & MARK CHECK-IN ↗'}
              </button>
            </form>

            {/* Scan Feedback Result Card */}
            {checkInResult && (
              <div
                className={`p-4 border text-xs space-y-3 ${
                  checkInResult.error
                    ? 'bg-[#fdf2f2] border-[#fca5a5] border-l-4 border-l-[#dc2626] text-[#7f1d1d]'
                    : 'bg-[#f0fdf4] border-[#86efac] border-l-4 border-l-[#16a34a] text-[#14532d]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wide">
                  {checkInResult.error ? (
                    <>
                      <XCircle className="w-4 sm:w-5 h-4 sm:h-5 text-[#dc2626] shrink-0" />
                      CHECK-IN REJECTED: {checkInResult.error}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-[#16a34a] shrink-0" />
                      {checkInResult.alreadyCheckedIn
                        ? 'NOTICE: PASS WAS ALREADY CHECKED-IN'
                        : 'GATE ENTRY VERIFIED & CHECKED-IN!'}
                    </>
                  )}
                </div>

                {checkInResult.registration && (
                  <div className="p-3 sm:p-4 bg-white border border-[#111111]/20 space-y-1.5 text-[#111111]">
                    <p>
                      <strong>PASS ID:</strong>{' '}
                      <span className="text-[#dc2626] font-bold">
                        {checkInResult.registration.registrationId}
                      </span>
                    </p>
                    <p className="truncate">
                      <strong>PRIMARY CONTACT:</strong> {checkInResult.registration.contactName} (
                      {checkInResult.registration.contactPhone})
                    </p>
                    <p>
                      <strong>REGISTERED ATHLETES:</strong>{' '}
                      {checkInResult.registration.entries?.length || 0} Entries
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: REGISTRATIONS MANAGEMENT ================= */}
      {activeTab === 'registrations' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Pass ID, Contact, Unit, or Family..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#111111]/30 text-[#111111] text-xs font-mono focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2.5 bg-white border border-[#111111]/30 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              >
                <option value="All">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* MOBILE CARD VIEW: Dedicated touch-friendly cards on small screens */}
          <div className="block md:hidden space-y-3">
            {filteredRegs.map((reg) => (
              <div key={reg._id} className="p-3.5 bg-white border border-[#111111] space-y-3 shadow-xs">
                {/* Header: ID + Status + Gate */}
                <div className="flex items-center justify-between gap-2 border-b border-[#111111]/10 pb-2">
                  <div>
                    <span className="text-[9px] text-[#888888] uppercase block">PASS ID</span>
                    <span className="font-bold text-xs sm:text-sm text-[#111111]">{reg.registrationId}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 border uppercase tracking-wider ${
                        reg.status === 'confirmed'
                          ? 'bg-[#fdf2f2] text-[#dc2626] border-[#dc2626]'
                          : 'bg-[#fafaf7] text-[#666666] border-[#cccccc]'
                      }`}
                    >
                      {reg.status}
                    </span>
                    {reg.checkIn?.isCheckedIn ? (
                      <span className="text-[9px] font-bold text-white bg-[#111111] px-1.5 py-0.5 border border-[#111111] uppercase tracking-wider">
                        CHECKED IN
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-[#666666] bg-[#e5e5e0] px-1.5 py-0.5 uppercase tracking-wider">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] text-[#666666] uppercase block">Contact</span>
                    <span className="font-bold text-[#111111] block truncate">{reg.contactName}</span>
                    <a href={`tel:${reg.contactPhone}`} className="text-[11px] text-[#dc2626] block truncate">
                      {reg.contactPhone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#666666] uppercase block">Household</span>
                    <span className="font-bold text-[#111111] block truncate">
                      {reg.familyId?.familyName || '-'}
                    </span>
                    <span className="text-[11px] text-[#666666] block truncate">
                      {reg.familyId?.blockTower} • Unit {reg.familyId?.houseNumber}
                    </span>
                  </div>
                </div>

                {/* Sports entries */}
                <div className="text-xs pt-1">
                  <div className="text-[10px] text-[#666666] uppercase mb-1">
                    Athletes ({reg.entries.length} entries):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {reg.entries.map((e: any, i: number) => (
                      <span
                        key={i}
                        className="text-[9px] font-bold bg-[#fafaf7] border border-[#111111]/20 px-1.5 py-0.5 text-[#111111]"
                      >
                        {e.participantName}: {e.sportType}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons with Full Mobile Tap Targets */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#111111]/10">
                  <a
                    href={`/api/registrations/${reg.registrationId}/pdf`}
                    download
                    className="flex items-center justify-center gap-1 py-2 px-1 bg-white hover:bg-[#111111] hover:text-white text-[#111111] text-[10px] font-bold uppercase tracking-wider border border-[#111111]/30 transition-colors text-center"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>

                  <Link
                    href={`/confirmation/${reg.registrationId}`}
                    className="flex items-center justify-center gap-1 py-2 px-1 bg-white hover:bg-[#111111] hover:text-white text-[#111111] text-[10px] font-bold uppercase tracking-wider border border-[#111111]/30 transition-colors text-center"
                    title="View Pass"
                  >
                    <QrCode className="w-3.5 h-3.5" /> PASS
                  </Link>

                  <button
                    onClick={() => handleResendEmail(reg.registrationId, reg.contactEmail)}
                    disabled={resendingEmailId === reg.registrationId}
                    className="flex items-center justify-center gap-1 py-2 px-1 bg-white hover:bg-[#dc2626] hover:text-white text-[#111111] text-[10px] font-bold uppercase tracking-wider border border-[#111111]/30 transition-colors disabled:opacity-50 text-center"
                    title="Resend Email"
                  >
                    <Mail
                      className={`w-3.5 h-3.5 ${
                        resendingEmailId === reg.registrationId ? 'animate-spin' : ''
                      }`}
                    />
                    EMAIL
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW: Full table on larger screens */}
          <div className="hidden md:block bg-white border border-[#111111] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111111]">
                <thead className="bg-[#111111] text-white text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Registration ID</th>
                    <th className="px-5 py-3.5">Contact / Family</th>
                    <th className="px-5 py-3.5">Tower & Unit</th>
                    <th className="px-5 py-3.5">Athletes & Sports</th>
                    <th className="px-5 py-3.5">Gate Status</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions (PDF / Web / Email)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/15">
                  {filteredRegs.map((reg, idx) => (
                    <tr
                      key={reg._id}
                      className={`hover:bg-[#f4f4f0] transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#fafaf7]'
                      }`}
                    >
                      <td className="px-5 py-4 font-mono font-bold text-[#111111]">
                        {reg.registrationId}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#111111]">{reg.contactName}</div>
                        <div className="text-[11px] text-[#666666]">{reg.contactPhone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-[#111111] font-bold">
                          {reg.familyId?.blockTower || '-'}
                        </div>
                        <div className="text-[11px] text-[#666666]">
                          Unit {reg.familyId?.houseNumber || '-'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-[#111111]">{reg.entries.length} entries</span>
                        <div className="text-[10px] text-[#666666] truncate max-w-[200px]">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {reg.entries.map((e: any) => e.sportType).join(', ')}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {reg.checkIn?.isCheckedIn ? (
                          <span className="text-[9px] font-bold text-white bg-[#111111] px-2 py-0.5 border border-[#111111] uppercase tracking-wider">
                            CHECKED IN
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-[#666666] bg-[#e5e5e0] px-2 py-0.5 uppercase tracking-wider">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 border uppercase tracking-wider ${
                            reg.status === 'confirmed'
                              ? 'bg-[#fdf2f2] text-[#dc2626] border-[#dc2626]'
                              : 'bg-[#fafaf7] text-[#666666] border-[#cccccc]'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Download PDF Pass */}
                          <a
                            href={`/api/registrations/${reg.registrationId}/pdf`}
                            download
                            className="p-1.5 bg-white hover:bg-[#111111] hover:text-white text-[#111111] border border-[#111111]/30 transition-colors"
                            title="Download Official Swiss PDF Pass"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>

                          {/* View Digital Pass */}
                          <Link
                            href={`/confirmation/${reg.registrationId}`}
                            className="p-1.5 bg-white hover:bg-[#111111] hover:text-white text-[#111111] border border-[#111111]/30 transition-colors"
                            title="View Digital Pass & QR"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </Link>

                          {/* Resend Confirmation Email */}
                          <button
                            onClick={() => handleResendEmail(reg.registrationId, reg.contactEmail)}
                            disabled={resendingEmailId === reg.registrationId}
                            className="p-1.5 bg-white hover:bg-[#dc2626] hover:text-white text-[#111111] border border-[#111111]/30 transition-colors disabled:opacity-50"
                            title="Resend Confirmation Email with PDF Pass"
                          >
                            <Mail
                              className={`w-3.5 h-3.5 ${
                                resendingEmailId === reg.registrationId ? 'animate-spin' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: EVENTS MANAGEMENT ================= */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="p-4 sm:p-5 bg-white border border-[#111111] shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-white bg-[#111111] px-2 py-0.5 uppercase tracking-wider">
                      {ev.sportType}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 border uppercase tracking-wider ${
                        ev.status === 'open'
                          ? 'bg-[#fdf2f2] text-[#dc2626] border-[#dc2626]'
                          : 'bg-[#fafaf7] text-[#666666] border-[#cccccc]'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#111111] text-base uppercase tracking-tight">{ev.title}</h3>
                  <p className="text-xs text-[#555555] line-clamp-2 mt-1 font-sans">{ev.description}</p>
                  <div className="mt-3 text-xs text-[#444444] space-y-1">
                    <div>
                      <strong>VENUE:</strong> {ev.venue}
                    </div>
                    <div>
                      <strong>SCHEDULE:</strong> {ev.scheduleDate} • {ev.scheduleTime}
                    </div>
                    <div>
                      <strong>CAPACITY:</strong> {ev.registeredCount} / {ev.maxParticipants}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#111111]/15 flex items-center justify-between text-xs">
                  <Link
                    href={`/events/${ev.slug}`}
                    className="text-[#111111] hover:text-[#dc2626] font-bold uppercase tracking-wider transition-colors"
                  >
                    View Page ↗
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(ev._id)}
                    className="text-[#dc2626] hover:underline font-bold uppercase tracking-wider"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: FAMILIES ================= */}
      {activeTab === 'families' && (
        <div className="space-y-4">
          {/* Mobile Card View for Families */}
          <div className="block md:hidden space-y-3">
            {families.map((f) => (
              <div key={f._id} className="p-3.5 bg-white border border-[#111111] space-y-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#111111]/10 pb-2">
                  <div>
                    <h4 className="font-bold text-sm text-[#111111]">{f.familyName}</h4>
                    <span className="text-xs text-[#666666]">
                      {f.blockTower} - {f.houseNumber}
                    </span>
                  </div>
                  <span className="text-base font-black text-[#dc2626]">{f.points || 0} pts</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-[#666666] uppercase block">Contact</span>
                    <span className="font-bold text-[#111111]">{f.primaryContactName}</span>
                    <span className="text-[11px] text-[#666666] block">{f.primaryPhone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#666666] uppercase block">Medals</span>
                    <span className="font-bold text-[#111111]">
                      🥇 {f.medals?.gold || 0} • 🥈 {f.medals?.silver || 0} • 🥉 {f.medals?.bronze || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View for Families */}
          <div className="hidden md:block bg-white border border-[#111111] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-[#111111]">
              <thead className="bg-[#111111] text-white text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Family Name</th>
                  <th className="px-5 py-3.5">Tower & Unit</th>
                  <th className="px-5 py-3.5">Contact Person</th>
                  <th className="px-5 py-3.5">Members</th>
                  <th className="px-5 py-3.5">Championship Points</th>
                  <th className="px-5 py-3.5">Medal Tally</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/15">
                {families.map((f, idx) => (
                  <tr
                    key={f._id}
                    className={`hover:bg-[#f4f4f0] transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#fafaf7]'
                    }`}
                  >
                    <td className="px-5 py-4 font-bold text-[#111111]">{f.familyName}</td>
                    <td className="px-5 py-4">
                      {f.blockTower} - {f.houseNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[#111111] font-bold">{f.primaryContactName}</div>
                      <div className="text-[#666666] text-[11px]">{f.primaryPhone}</div>
                    </td>
                    <td className="px-5 py-4 font-bold">{f.membersCount || 1} members</td>
                    <td className="px-5 py-4 font-black text-[#dc2626] text-sm">
                      {f.points || 0} pts
                    </td>
                    <td className="px-5 py-4 text-xs font-bold">
                      🥇 {f.medals?.gold || 0} • 🥈 {f.medals?.silver || 0} • 🥉 {f.medals?.bronze || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: RESULTS & MEDAL ENTRY ================= */}
      {activeTab === 'results' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-4 sm:p-8 bg-white border border-[#111111] shadow-xs space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#dc2626] shrink-0" />
                [RECORD WINNERS & ALLOCATE POINTS]
              </h2>
              <p className="text-xs text-[#666666] mt-1 font-sans">
                Submitting podium winners automatically awards Gold (10pts), Silver (7pts), and Bronze (5pts)
                to family and tower standings.
              </p>
            </div>

            <form onSubmit={handleSubmitResults} className="space-y-4 sm:space-y-5">
              {/* Event Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Select Completed Event *
                </label>
                <select
                  value={resultEventId}
                  onChange={(e) => setResultEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fafaf7] border border-[#111111] text-[#111111] text-xs font-mono focus:bg-white"
                  required
                >
                  <option value="">-- Choose Completed Event --</option>
                  {events.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title} ({ev.sportType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Gold Winner (1st Place) */}
              <div className="p-3.5 sm:p-4 bg-[#fafaf7] border border-[#111111] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                  🥇 1ST PLACE (GOLD MEDAL • 10 POINTS)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#666666] mb-1">Winner Name *</label>
                    <input
                      type="text"
                      value={goldWinnerName}
                      onChange={(e) => setGoldWinnerName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#666666] mb-1">Winning Family</label>
                    <select
                      value={goldFamilyId}
                      onChange={(e) => setGoldFamilyId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                    >
                      <option value="">-- Select Family --</option>
                      {families.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.familyName} ({f.blockTower})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#666666] mb-1">Score / Time</label>
                    <input
                      type="text"
                      value={goldScore}
                      onChange={(e) => setGoldScore(e.target.value)}
                      placeholder="e.g. 11.8s or 21-18"
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Silver Winner (2nd Place) */}
              <div className="p-3.5 sm:p-4 bg-[#fafaf7] border border-[#111111]/30 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                  🥈 2ND PLACE (SILVER MEDAL • 7 POINTS)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div>
                    <input
                      type="text"
                      value={silverWinnerName}
                      onChange={(e) => setSilverWinnerName(e.target.value)}
                      placeholder="Silver winner name"
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={silverFamilyId}
                      onChange={(e) => setSilverFamilyId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                    >
                      <option value="">-- Select Family --</option>
                      {families.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.familyName} ({f.blockTower})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={silverScore}
                      onChange={(e) => setSilverScore(e.target.value)}
                      placeholder="Score / Time"
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bronze Winner (3rd Place) */}
              <div className="p-3.5 sm:p-4 bg-[#fafaf7] border border-[#111111]/30 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                  🥉 3RD PLACE (BRONZE MEDAL • 5 POINTS)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div>
                    <input
                      type="text"
                      value={bronzeWinnerName}
                      onChange={(e) => setBronzeWinnerName(e.target.value)}
                      placeholder="Bronze winner name"
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={bronzeFamilyId}
                      onChange={(e) => setBronzeFamilyId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                    >
                      <option value="">-- Select Family --</option>
                      {families.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.familyName} ({f.blockTower})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={bronzeScore}
                      onChange={(e) => setBronzeScore(e.target.value)}
                      placeholder="Score / Time"
                      className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingResult}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#dc2626] text-white font-bold text-xs uppercase tracking-widest border border-[#111111] transition-colors"
              >
                {submittingResult ? 'PUBLISHING RESULTS...' : 'PUBLISH PODIUM & UPDATE STANDINGS ↗'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 7: ANNOUNCEMENTS ================= */}
      {activeTab === 'announcements' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="p-4 sm:p-6 bg-white border border-[#111111] shadow-xs space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111]">
              [POST NEW SOCIETY BROADCAST / ALERT]
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Headline (e.g. Badminton Court Timings Updated)..."
                  className="w-full px-3.5 py-2.5 bg-[#fafaf7] border border-[#111111]/30 text-[#111111] text-xs focus:bg-white focus:border-[#111111]"
                  required
                />
              </div>

              <div>
                <textarea
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  rows={3}
                  placeholder="Details of the announcement for society residents..."
                  className="w-full px-3.5 py-2.5 bg-[#fafaf7] border border-[#111111]/30 text-[#111111] text-xs focus:bg-white focus:border-[#111111]"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-4 text-xs">
                  <select
                    value={annPriority}
                    onChange={(e) =>
                      setAnnPriority(e.target.value as 'normal' | 'high' | 'urgent')
                    }
                    className="px-3 py-1.5 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Banner</option>
                  </select>

                  <label className="flex items-center gap-1.5 cursor-pointer text-[#111111]">
                    <input
                      type="checkbox"
                      checked={annPinned}
                      onChange={(e) => setAnnPinned(e.target.checked)}
                      className="border-[#111111]"
                    />
                    Pin to Top
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#111111] hover:bg-[#dc2626] text-white font-bold text-xs uppercase tracking-wider border border-[#111111] transition-colors"
                >
                  Publish Broadcast ↗
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className="p-3.5 sm:p-4 bg-white border border-[#111111]/20 shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111111] text-xs sm:text-sm uppercase">{ann.title}</span>
                    {ann.isPinned && (
                      <span className="text-[9px] font-bold text-white bg-[#dc2626] px-1.5 py-0.5 uppercase tracking-wider shrink-0">
                        PINNED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#555555] mt-1 font-sans">{ann.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(ann._id)}
                  className="p-2 text-[#888888] hover:text-[#dc2626] transition-colors shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SPORT / EVENT - Mobile Friendly ================= */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#111111]/60 backdrop-blur-xs overflow-y-auto font-mono">
          <div className="w-full max-w-lg bg-white border-2 border-[#111111] p-4 sm:p-8 shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#111111]/20 pb-3 shrink-0">
              <h3 className="text-xs sm:text-base font-bold uppercase tracking-wider text-[#111111]">
                [CREATE NEW SPORT DISCIPLINE]
              </h3>
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="text-[#666666] hover:text-[#dc2626] text-xs font-bold p-1"
              >
                ✕ CLOSE
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Society Carrom Open, Badminton Veterans"
                  className="w-full px-3 py-2 bg-[#fafaf7] border border-[#111111]/30 text-[#111111] text-xs focus:border-[#111111] focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Sport Discipline
                  </label>
                  <select
                    value={eventSport}
                    onChange={(e) => setEventSport(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fafaf7] border border-[#111111]/30 text-[#111111] text-xs focus:border-[#111111] focus:bg-white"
                  >
                    <option value="Cricket">Cricket</option>
                    <option value="Football">Football</option>
                    <option value="Hockey">Hockey</option>
                    <option value="Table Tennis">Table Tennis</option>
                    <option value="Race">Race</option>
                    <option value="Slow Cycling">Slow Cycling</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) =>
                      setEventCategory(e.target.value as 'Individual' | 'Team' | 'Family')
                    }
                    className="w-full px-3 py-2 bg-[#fafaf7] border border-[#111111]/30 text-[#111111] text-xs focus:border-[#111111] focus:bg-white"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Team">Team</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                  Venue Location
                </label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fafaf7] border border-[#111111]/30 text-[#111111] text-xs focus:border-[#111111] focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fafaf7] border border-[#111111]/30 text-[#111111] text-xs focus:border-[#111111] focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="09:00 AM - 12:00 PM"
                    className="w-full px-3 py-2 bg-[#fafaf7] border border-[#111111]/30 text-[#111111] text-xs focus:border-[#111111] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Min Age
                  </label>
                  <input
                    type="number"
                    value={eventMinAge}
                    onChange={(e) => setEventMinAge(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Max Age
                  </label>
                  <input
                    type="number"
                    value={eventMaxAge}
                    onChange={(e) => setEventMaxAge(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={eventMaxCapacity}
                    onChange={(e) => setEventMaxCapacity(parseInt(e.target.value) || 32)}
                    className="w-full px-2.5 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                  Description
                </label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-[#111111]/30 text-[#111111] text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[#111111]/15 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2.5 bg-white text-[#111111] border border-[#111111]/30 text-xs font-bold uppercase hover:bg-[#f4f4f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#dc2626] border border-[#111111]"
                >
                  Save & Publish Event ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
