'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useToast } from '@/components/ToastContext';
import {
  User,
  Home,
  Users,
  Trophy,
  Download,
  Plus,
  QrCode,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() { /* Resident self-service pass portal */
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add Member Modal State
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberAge, setMemberAge] = useState(15);
  const [memberGender, setMemberGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [memberRelation, setMemberRelation] = useState('Child');
  const [memberSize, setMemberSize] = useState('M');
  const [savingMember, setSavingMember] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/user/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCancelRegistration = async (id: string) => {
    if (!confirm('Are you sure you wish to cancel this registration?')) return;

    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        success('Registration cancelled successfully.');
        fetchDashboard();
      } else {
        toastError('Failed to cancel registration.');
      }
    } catch {
      toastError('Network error while cancelling registration.');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) {
      toastError('Please enter member name.');
      return;
    }

    setSavingMember(true);
    try {
      const res = await fetch('/api/user/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: memberName,
          age: memberAge,
          gender: memberGender,
          relation: memberRelation,
          tShirtSize: memberSize,
        }),
      });

      if (res.ok) {
        success('Family member added to roster!');
        setShowAddMember(false);
        setMemberName('');
        fetchDashboard();
      } else {
        const data = await res.json();
        toastError(data.error || 'Failed to add member.');
      }
    } catch {
      toastError('Network error while adding member.');
    } finally {
      setSavingMember(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Loading your member dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Member Login Required</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          Please log in or register your family to view your active passes and member roster.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition"
          >
            Register Family
          </Link>
        </div>
      </div>
    );
  }

  const family = dashboardData?.family;
  const registrations = dashboardData?.registrations || [];
  const members = dashboardData?.members || [];

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Resident Athlete Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-slate-500">
            {family ? (
              <>
                {family.familyName} • {family.blockTower} - {family.houseNumber}
              </>
            ) : (
              'ColonyGames 2026 Participant'
            )}
          </p>
        </div>

        {/* Quick Points Widget */}
        <div className="flex items-center gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 self-start md:self-auto">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-300/40">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Family Points
            </div>
            <div className="text-2xl font-black text-slate-900">
              {family?.points || 0} <span className="text-xs font-normal text-slate-500">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Registrations & Family Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Passes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                Tournament Entry Passes
              </h2>
              <p className="text-xs text-slate-500">
                Display digital QR codes at gates or download PDF passes.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition"
            >
              <Plus className="w-3.5 h-3.5" /> Register More Sports
            </Link>
          </div>

          {registrations.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
              <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No active registrations yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto">
                Select from Cricket, Football, Badminton, Table Tennis, 100m sprint and more!
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs shadow-md"
              >
                Register Your Family Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {registrations.map((reg: any) => (
                <div
                  key={reg._id}
                  className="rounded-3xl bg-white border border-slate-200/90 p-6 space-y-5 hover:border-blue-300 transition shadow-lg shadow-slate-200/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-blue-700 font-mono tracking-wider">
                          {reg.registrationId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            reg.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : reg.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {reg.status}
                        </span>
                        {reg.checkIn?.isCheckedIn && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                            Checked In at Gate
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">
                        Registered on {new Date(reg.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/registrations/${reg.registrationId}/pdf`}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Pass PDF
                      </a>
                      <Link
                        href={`/confirmation/${reg.registrationId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Pass
                      </Link>
                    </div>
                  </div>

                  {/* Entries List */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                      Enrolled Athletes & Sports ({reg.entries.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {reg.entries.map((entry: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {entry.participantName}
                            </span>
                            <span className="text-blue-700 text-[11px] font-medium">
                              {entry.eventTitle} ({entry.sportType})
                            </span>
                          </div>
                          {entry.sportSpecificInfo?.role && (
                            <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {entry.sportSpecificInfo.role}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  {reg.status !== 'cancelled' && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Need modifications? You can cancel and re-register anytime before draw fixtures.
                      </span>
                      <button
                        onClick={() => handleCancelRegistration(reg._id)}
                        className="text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Cancel Registration
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Family Roster Management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Family Roster
            </h3>
            <button
              onClick={() => setShowAddMember(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/90 p-5 space-y-3 shadow-xl shadow-slate-200/40">
            {members.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No family members added yet.</p>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              members.map((m: any) => (
                <div
                  key={m._id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{m.fullName}</span>
                    <span className="text-xs text-slate-500">
                      {m.age}y • {m.gender} • {m.relation}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Size: {m.tShirtSize}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Guidelines Box */}
          <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs text-slate-700">
            <div className="font-bold text-blue-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Fest Participation Kit
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Every registered athlete is entitled to an official dry-fit society jersey and wristband.
              Collect yours from the Clubhouse Lounge prior to tournament opening.
            </p>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Family Member</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min={3}
                    max={95}
                    value={memberAge}
                    onChange={(e) => setMemberAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                  <select
                    value={memberGender}
                    onChange={(e) =>
                      setMemberGender(e.target.value as 'Male' | 'Female' | 'Other')
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Relation</label>
                  <select
                    value={memberRelation}
                    onChange={(e) => setMemberRelation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">T-Shirt Size</label>
                  <select
                    value={memberSize}
                    onChange={(e) => setMemberSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Kids-S">Kids-S</option>
                    <option value="Kids-M">Kids-M</option>
                    <option value="Kids-L">Kids-L</option>
                    <option value="S">Adult S</option>
                    <option value="M">Adult M</option>
                    <option value="L">Adult L</option>
                    <option value="XL">Adult XL</option>
                    <option value="XXL">Adult XXL</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMember}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  {savingMember ? 'Saving...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
