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
        const d = await regRes.json();
        setRegistrations(d.registrations || []);
      }
      if (evRes.ok) {
        const d = await evRes.json();
        setEvents(d.events || []);
      }
      if (famRes.ok) {
        const d = await famRes.json();
        setFamilies(d.families || []);
      }
      if (annRes.ok) {
        const d = await annRes.json();
        setAnnouncements(d.announcements || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // Handle QR / Pass Check-In
  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInInput.trim()) return;

    setProcessingCheckIn(true);
    setCheckInResult(null);

    let passId = checkInInput.trim();
    if (passId.includes('/confirmation/')) {
      const parts = passId.split('/confirmation/');
      passId = parts[parts.length - 1];
    } else if (passId.startsWith('{')) {
      try {
        const parsed = JSON.parse(passId);
        passId = parsed.id || passId;
      } catch {
        // use raw
      }
    }

    try {
      const res = await fetch(`/api/registrations/${passId}/checkin`, {
        method: 'POST',
      });

      const data = await res.json();
      if (res.ok) {
        setCheckInResult(data);
        success(data.message || 'Check-in recorded!');
        setCheckInInput('');
        fetchAllAdminData();
      } else {
        toastError(data.error || 'Failed to check-in.');
        setCheckInResult({ error: data.error });
      }
    } catch {
      toastError('Network error during check-in verification.');
    } finally {
      setProcessingCheckIn(false);
    }
  };

  // Create Event Handler
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          sportType: eventSport,
          category: eventCategory,
          venue: eventVenue,
          scheduleDate: eventDate,
          scheduleTime: eventTime,
          minAge: eventMinAge,
          maxAge: eventMaxAge,
          maxParticipants: eventMaxCapacity,
          rules: eventRules,
          description: eventDesc,
        }),
      });

      if (res.ok) {
        success('Tournament event created successfully!');
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
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Loading Admin Command Center...
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-200">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Clearance Required</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          You must be signed in with a Society Sports Committee Admin account to view this command center.
        </p>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700"
        >
          Sign In as Admin
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
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              <Shield className="w-3.5 h-3.5" /> Society Committee Admin Panel
            </span>
            <span className="text-xs text-slate-400">v2.4 Live</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            ColonyGames 2026 Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time athlete registration metrics, gate check-in, event scheduling, and points tally.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={fetchAllAdminData}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-xs transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/api/export?view=roster"
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" /> Export Athlete Roster (CSV)
          </a>
          <button
            onClick={() => setShowEventModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Sport / Event
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: 'Metrics Overview', icon: Trophy },
          { id: 'checkin', label: 'Gate QR Check-in', icon: QrCode },
          { id: 'registrations', label: `Registrations (${registrations.length})`, icon: Users },
          { id: 'events', label: `Events & Sports (${events.length})`, icon: Calendar },
          { id: 'families', label: `Families (${families.length})`, icon: Building },
          { id: 'results', label: 'Medal & Results Entry', icon: Award },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW METRICS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Families
              </span>
              <div className="text-3xl font-black text-slate-900">{metrics.totalFamilies}</div>
              <span className="text-xs text-blue-600 font-semibold">Society Households</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Athletes
              </span>
              <div className="text-3xl font-black text-blue-600">{metrics.totalParticipants}</div>
              <span className="text-xs text-slate-500 font-medium">Registered Participants</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Passes Issued
              </span>
              <div className="text-3xl font-black text-cyan-600">{metrics.totalRegistrations}</div>
              <span className="text-xs text-slate-500 font-medium">
                {metrics.confirmedRegistrations} Confirmed
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Gate Check-in Rate
              </span>
              <div className="text-3xl font-black text-amber-500">
                {metrics.checkedInCount}{' '}
                <span className="text-sm font-normal text-slate-500">({metrics.checkInRate}%)</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Verified at Sports Gates</span>
            </div>
          </div>

          {/* Event Capacity Meters Grid */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-md shadow-slate-200/40">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Event-Wise Capacity Analytics</h3>
                <p className="text-xs text-slate-500">Real-time quota utilization for each tournament</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev) => {
                const filledPct = Math.min(
                  100,
                  Math.round(((ev.registeredCount || 0) / (ev.maxParticipants || 32)) * 100)
                );
                return (
                  <div
                    key={ev._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                        {ev.title}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {ev.sportType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {ev.registeredCount} / {ev.maxParticipants} entries
                      </span>
                      <span className="font-bold text-slate-800">{filledPct}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          filledPct >= 90
                            ? 'bg-rose-500'
                            : filledPct >= 70
                            ? 'bg-amber-500'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500'
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
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Event Gate Check-in Scanner</h2>
              <p className="text-xs text-slate-500 mt-1">
                Scan athlete QR code using a handheld barcode scanner or enter the Registration Pass ID (e.g. CG26-XXXX).
              </p>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={checkInInput}
                  onChange={(e) => setCheckInInput(e.target.value)}
                  placeholder="Paste QR payload or enter ID (e.g. CG26-K9F2L)..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={processingCheckIn}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-md transition"
              >
                {processingCheckIn ? 'Verifying...' : 'Verify Pass & Mark Check-In'}
              </button>
            </form>

            {/* Scan Feedback Result Card */}
            {checkInResult && (
              <div
                className={`p-5 rounded-2xl border text-xs space-y-3 ${
                  checkInResult.error
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {checkInResult.error ? (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      Check-In Rejected: {checkInResult.error}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      {checkInResult.alreadyCheckedIn
                        ? 'Notice: Pass Was Already Checked-In Earlier'
                        : 'Gate Entry Verified & Checked-In!'}
                    </>
                  )}
                </div>

                {checkInResult.registration && (
                  <div className="p-3 bg-white rounded-xl space-y-1 text-slate-700 border border-emerald-100">
                    <p>
                      <strong>Pass ID:</strong> {checkInResult.registration.registrationId}
                    </p>
                    <p>
                      <strong>Contact:</strong> {checkInResult.registration.contactName} (
                      {checkInResult.registration.contactPhone})
                    </p>
                    <p>
                      <strong>Total Athlete Entries:</strong>{' '}
                      {checkInResult.registration.entries.length}
                    </p>
                    <p>
                      <strong>Checked in at:</strong>{' '}
                      {new Date(
                        checkInResult.registration.checkIn?.checkedInAt || Date.now()
                      ).toLocaleTimeString('en-IN')}
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
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, Contact, Flat, or Family..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none shadow-xs"
              >
                <option value="All">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xl shadow-slate-200/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Registration ID</th>
                    <th className="px-5 py-3.5">Contact / Family</th>
                    <th className="px-5 py-3.5">Tower & Flat</th>
                    <th className="px-5 py-3.5">Athletes & Sports</th>
                    <th className="px-5 py-3.5">Check-In</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegs.map((reg) => (
                    <tr key={reg._id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4 font-mono font-bold text-blue-700">
                        {reg.registrationId}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">{reg.contactName}</div>
                        <div className="text-[11px] text-slate-500">{reg.contactPhone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-900 font-medium">
                          {reg.familyId?.blockTower || '-'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Unit {reg.familyId?.houseNumber || '-'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900">{reg.entries.length} entries</span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {reg.entries.map((e: any) => e.sportType).join(', ')}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {reg.checkIn?.isCheckedIn ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Checked In
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Gate Pending</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            reg.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/api/registrations/${reg.registrationId}/pdf`}
                            download
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href={`/confirmation/${reg.registrationId}`}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                            title="View Pass"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      {ev.sportType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ev.status === 'open'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{ev.description}</p>
                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <div>
                      <strong>Venue:</strong> {ev.venue}
                    </div>
                    <div>
                      <strong>Schedule:</strong> {ev.scheduleDate} • {ev.scheduleTime}
                    </div>
                    <div>
                      <strong>Capacity:</strong> {ev.registeredCount} / {ev.maxParticipants}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/events/${ev.slug}`}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View Page
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(ev._id)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: FAMILIES ================= */}
      {activeTab === 'families' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xl shadow-slate-200/40">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Family Name</th>
                <th className="px-5 py-3.5">Tower & Unit</th>
                <th className="px-5 py-3.5">Contact Person</th>
                <th className="px-5 py-3.5">Members</th>
                <th className="px-5 py-3.5">Championship Points</th>
                <th className="px-5 py-3.5">Medal Tally</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {families.map((f) => (
                <tr key={f._id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-bold text-slate-900">{f.familyName}</td>
                  <td className="px-5 py-4">
                    {f.blockTower} - {f.houseNumber}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-900">{f.primaryContactName}</div>
                    <div className="text-slate-500 text-[11px]">{f.primaryPhone}</div>
                  </td>
                  <td className="px-5 py-4 font-semibold">{f.membersCount || 1} members</td>
                  <td className="px-5 py-4 font-black text-blue-600 text-sm">
                    {f.points || 0} pts
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold">
                    🥇 {f.medals?.gold || 0} • 🥈 {f.medals?.silver || 0} • 🥉{' '}
                    {f.medals?.bronze || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TAB 6: RESULTS & MEDAL ENTRY ================= */}
      {activeTab === 'results' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Record Tournament Winners & Points
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Submitting winners automatically awards Gold (10pts), Silver (7pts), and Bronze (5pts)
                to family and block standings.
              </p>
            </div>

            <form onSubmit={handleSubmitResults} className="space-y-5">
              {/* Event Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Select Event *
                </label>
                <select
                  value={resultEventId}
                  onChange={(e) => setResultEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
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
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  🥇 1st Place (Gold Medal • 10 Points)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Winner Name *</label>
                    <input
                      type="text"
                      value={goldWinnerName}
                      onChange={(e) => setGoldWinnerName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Winning Family</label>
                    <select
                      value={goldFamilyId}
                      onChange={(e) => setGoldFamilyId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
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
                    <label className="block text-[11px] text-slate-600 mb-1">Score / Time</label>
                    <input
                      type="text"
                      value={goldScore}
                      onChange={(e) => setGoldScore(e.target.value)}
                      placeholder="e.g. 11.8s or 21-18"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Silver Winner (2nd Place) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  🥈 2nd Place (Silver Medal • 7 Points)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={silverWinnerName}
                      onChange={(e) => setSilverWinnerName(e.target.value)}
                      placeholder="Silver winner name"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={silverFamilyId}
                      onChange={(e) => setSilverFamilyId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
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
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bronze Winner (3rd Place) */}
              <div className="p-4 rounded-2xl bg-amber-50/30 border border-amber-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  🥉 3rd Place (Bronze Medal • 5 Points)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={bronzeWinnerName}
                      onChange={(e) => setBronzeWinnerName(e.target.value)}
                      placeholder="Bronze winner name"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={bronzeFamilyId}
                      onChange={(e) => setBronzeFamilyId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
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
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingResult}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition"
              >
                {submittingResult ? 'Publishing Results...' : 'Publish Podium & Update Points'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 7: ANNOUNCEMENTS ================= */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900">Post New Society Alert / Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Announcement headline (e.g. Practice Schedule Updated)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <textarea
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  rows={3}
                  placeholder="Details of the announcement for society members..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <select
                    value={annPriority}
                    onChange={(e) =>
                      setAnnPriority(e.target.value as 'normal' | 'high' | 'urgent')
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Banner</option>
                  </select>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={annPinned}
                      onChange={(e) => setAnnPinned(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Pin to Homepage Banner
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{ann.title}</span>
                    {ann.isPinned && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        PINNED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{ann.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(ann._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SPORT / EVENT ================= */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <h3 className="text-xl font-bold text-slate-900">Create New Society Sport Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Society Carrom Open, Badminton Veterans"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Sport Type</label>
                  <select
                    value={eventSport}
                    onChange={(e) => setEventSport(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) =>
                      setEventCategory(e.target.value as 'Individual' | 'Team' | 'Family')
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Team">Team</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Venue Location</label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Schedule Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="09:00 AM - 12:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Min Age</label>
                  <input
                    type="number"
                    value={eventMinAge}
                    onChange={(e) => setEventMinAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Age</label>
                  <input
                    type="number"
                    value={eventMaxAge}
                    onChange={(e) => setEventMaxAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={eventMaxCapacity}
                    onChange={(e) => setEventMaxCapacity(parseInt(e.target.value) || 32)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Save & Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
