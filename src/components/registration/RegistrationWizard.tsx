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
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  Printer,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface FamilyMember {
  tempId: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  relation: 'Self' | 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother' | 'Sibling' | 'Other';
  tShirtSize: 'Kids-S' | 'Kids-M' | 'Kids-L' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  medicalNotes?: string;
}

export interface SportAllocation {
  tempMemberId: string;
  eventId: string;
  role?: string;
  partnerName?: string;
  bicycleOption?: string;
  notes?: string;
}

export interface EventOption {
  _id: string;
  title: string;
  sportType: string;
  category: 'Individual' | 'Team' | 'Family';
  minAge: number;
  maxAge: number;
  registeredCount: number;
  maxParticipants: number;
  venue: string;
  scheduleDate: string;
  scheduleTime: string;
  status: 'open' | 'closing-soon' | 'closed';
}

const BLOCKS = [
  'Tower A',
  'Tower B',
  'Tower C',
  'Tower D',
  'Tower E',
  'Tower F',
  'Villa Block',
  'Row Houses',
  'Clubhouse Enclave',
];

export default function RegistrationWizard() {
  const { user } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const [step, setStep] = useState(1);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [events, setEvents] = useState<EventOption[]>([]);

  // Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const [familyName, setFamilyName] = useState('');
  const [blockTower, setBlockTower] = useState('Tower A');
  const [houseNumber, setHouseNumber] = useState('');

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [allocations, setAllocations] = useState<SportAllocation[]>([]);
  const [agreeRules, setAgreeRules] = useState(false);

  // Result state
  const [registrationResult, setRegistrationResult] = useState<{
    registrationId: string;
    verifyPassUrl: string;
    qrCodeDataUrl?: string;
  } | null>(null);

  // Fetch available sports
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchEvents();
  }, []);

  // Pre-fill with authenticated user data if present
  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name);
      if (!contactEmail) setContactEmail(user.email);
      if (!contactPhone && user.phone) setContactPhone(user.phone);
      if (user.family) {
        if (!familyName) setFamilyName(user.family.familyName);
        if (!houseNumber) setHouseNumber(user.family.houseNumber);
        if (!blockTower && user.family.blockTower) setBlockTower(user.family.blockTower);
      }
    }
  }, [user]);

  // Initial Member Setup: add 1 default self-member
  useEffect(() => {
    if (members.length === 0 && contactName) {
      setMembers([
        {
          tempId: 'mem-1',
          fullName: contactName,
          age: 32,
          gender: 'Male',
          relation: 'Self',
          tShirtSize: 'L',
        },
      ]);
    }
  }, [contactName, members.length]);

  // Step Validation Helpers
  const validateStep1 = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      toastError('Please fill in your name, email, and phone number.');
      return false;
    }
    if (!contactEmail.includes('@') || !contactEmail.includes('.')) {
      toastError('Please enter a valid email address.');
      return false;
    }
    if (contactPhone.replace(/\D/g, '').length < 10) {
      toastError('Please enter a valid 10-digit phone number.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!familyName.trim() || !houseNumber.trim() || !blockTower) {
      toastError('Please provide your family name, flat/villa number, and select a block.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (members.length === 0) {
      toastError('Please add at least one family member or athlete.');
      return false;
    }
    for (const m of members) {
      if (!m.fullName.trim()) {
        toastError('Each member must have a full name.');
        return false;
      }
      if (!m.age || m.age < 3 || m.age > 95) {
        toastError(`Please enter a valid age (3-95) for ${m.fullName || 'each member'}.`);
        return false;
      }
    }
    return true;
  };

  const validateStep4 = () => {
    if (allocations.length === 0) {
      toastError('Please enroll at least one member into a sport.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;
    setStep((prev) => Math.min(prev + 1, 7));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Family Member Management
  const addMember = () => {
    const newId = `mem-${Date.now()}`;
    setMembers((prev) => [
      ...prev,
      {
        tempId: newId,
        fullName: '',
        age: 12,
        gender: 'Male',
        relation: 'Son',
        tShirtSize: 'M',
      },
    ]);
  };

  const updateMember = (tempId: string, updates: Partial<FamilyMember>) => {
    setMembers((prev) =>
      prev.map((m) => (m.tempId === tempId ? { ...m, ...updates } : m))
    );
  };

  const removeMember = (tempId: string) => {
    if (members.length <= 1) {
      toastError('At least one family member must remain.');
      return;
    }
    setMembers((prev) => prev.filter((m) => m.tempId !== tempId));
    setAllocations((prev) => prev.filter((a) => a.tempMemberId !== tempId));
  };

  // Sports Allocation Management
  const toggleSport = (tempMemberId: string, eventId: string) => {
    const exists = allocations.some(
      (a) => a.tempMemberId === tempMemberId && a.eventId === eventId
    );

    if (exists) {
      setAllocations((prev) =>
        prev.filter((a) => !(a.tempMemberId === tempMemberId && a.eventId === eventId))
      );
    } else {
      const event = events.find((e) => e._id === eventId);
      const member = members.find((m) => m.tempId === tempMemberId);

      if (event && member) {
        if (member.age < event.minAge || member.age > event.maxAge) {
          toastError(
            `${member.fullName || 'This member'} (Age ${member.age}) is outside the ${event.minAge}-${event.maxAge}y age bracket for ${event.title}.`
          );
          return;
        }
      }

      setAllocations((prev) => [...prev, { tempMemberId, eventId }]);
    }
  };

  const updateAllocationDetails = (
    tempMemberId: string,
    eventId: string,
    field: string,
    value: string
  ) => {
    setAllocations((prev) =>
      prev.map((a) => {
        if (a.tempMemberId === tempMemberId && a.eventId === eventId) {
          return { ...a, [field]: value };
        }
        return a;
      })
    );
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!agreeRules) {
      toastError('Please acknowledge and accept the tournament code of conduct.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        contactName,
        contactEmail,
        contactPhone,
        emergencyContact,
        familyName,
        houseNumber,
        blockTower,
        members,
        allocations,
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toastError(data.error || 'Registration submission failed.');
        setSubmitting(false);
        return;
      }

      setRegistrationResult({
        registrationId: data.registrationId,
        verifyPassUrl: data.verifyPassUrl,
        qrCodeDataUrl: data.registration?.qrCodeDataUrl,
      });

      setStep(7);
      toastSuccess('Registration confirmed! Official pass generated & emailed.');

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#06b6d4', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // confetti fallback
      }
    } catch (err) {
      console.error('Submit error:', err);
      toastError('Network error while processing registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Contact', icon: User },
    { num: 2, label: 'House', icon: Home },
    { num: 3, label: 'Family', icon: Users },
    { num: 4, label: 'Sports', icon: Trophy },
    { num: 5, label: 'Roles', icon: Sliders },
    { num: 6, label: 'Review', icon: FileCheck },
    { num: 7, label: 'Pass', icon: Sparkles },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-16">
      {/* Top Banner Heading - Swiss Editorial Broadside */}
      <div className="text-center mb-8 sm:mb-12 pb-6 border-b border-[#111111]/20">
        <div className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">
          [ PROTOCOL // 07 PHASES • REGISTRATION 2026 ]
        </div>
        <h1 className="text-2xl sm:text-5xl font-black text-[#111111] uppercase tracking-tight">
          COLONYGAMES 2026 ENTRY PASS
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] mt-1.5 max-w-xl mx-auto font-sans">
          Register family members, assign tournament disciplines, and generate your official digital QR credentials.
        </p>
      </div>

      {/* Mobile-Only Step Header (under 640px) */}
      <div className="sm:hidden mb-6 p-4 bg-white border border-[#111111] space-y-2.5 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 bg-[#111111] text-white font-black text-xs flex items-center justify-center">
              {step}
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#888888] block">
                PHASE 0{step} OF 07
              </span>
              <span className="text-xs font-black uppercase text-[#111111]">
                {stepsList[step - 1]?.label}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#dc2626]">
            {Math.round((step / 7) * 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#ebebe6] border border-[#111111]/15 overflow-hidden">
          <div
            className="h-full bg-[#111111] transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Step Indicator Bar (640px and up) - Swiss Modular Index Bar */}
      <div className="hidden sm:block mb-8 font-mono">
        <div className="grid grid-cols-7 border border-[#111111] bg-white divide-x divide-[#111111]">
          {stepsList.map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                className={`p-3 text-center transition-colors ${
                  isCurrent
                    ? 'bg-[#111111] text-white'
                    : isDone
                    ? 'bg-[#f4f4f0] text-[#111111]'
                    : 'bg-white text-[#888888]'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest">
                  0{s.num}
                </div>
                <div className="text-[11px] font-black uppercase tracking-tight mt-0.5 truncate">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Container */}
      <div className="bg-white border border-[#111111] p-5 sm:p-10">
        {/* ================= STEP 1: PERSONAL DETAILS ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Step 1: Primary Contact Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the primary contact who will receive official tournament updates and pass confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. rajesh@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                  required
                />
                <span className="text-[11px] text-blue-600 mt-1 block">
                  Confirmation PDF and QR badge will be emailed here.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Mobile Number (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 9823411223"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Emergency Contact (Optional)
                </label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. 9811122334"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: HOUSE DETAILS ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Step 2: Society House & Tower Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Used to tally points for the Society Block/Tower Championship trophy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Family / Household Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. Sharma Family, Verma Villa, The Warriors"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Tower / Block <span className="text-rose-500">*</span>
                </label>
                <select
                  value={blockTower}
                  onChange={(e) => setBlockTower(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                >
                  {BLOCKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Flat / Villa / House Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="e.g. 402, Villa-12, B-301"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                  required
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                All medals won by your family members will count towards both your Family Tally and the <strong>{blockTower}</strong> Tower Cup!
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 3: FAMILY MEMBERS ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Step 3: Family Athletes & Participants
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Add all family members who wish to participate in games or collect society kits.
                </p>
              </div>
              <button
                type="button"
                onClick={addMember}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member, index) => (
                <div
                  key={member.tempId}
                  className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 relative group hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px]">
                        {index + 1}
                      </span>
                      Participant #{index + 1}
                    </span>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(member.tempId)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => updateMember(member.tempId, { fullName: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Age (Years) *
                      </label>
                      <input
                        type="number"
                        min={3}
                        max={95}
                        value={member.age}
                        onChange={(e) =>
                          updateMember(member.tempId, { age: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Gender *
                      </label>
                      <select
                        value={member.gender}
                        onChange={(e) =>
                          updateMember(member.tempId, {
                            gender: e.target.value as 'Male' | 'Female' | 'Other',
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        T-Shirt Size
                      </label>
                      <select
                        value={member.tShirtSize}
                        onChange={(e) =>
                          updateMember(member.tempId, {
                            tShirtSize: e.target.value as FamilyMember['tShirtSize'],
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                      >
                        <option value="Kids-S">Kids-S (4-6y)</option>
                        <option value="Kids-M">Kids-M (7-9y)</option>
                        <option value="Kids-L">Kids-L (10-12y)</option>
                        <option value="S">Adult S (36")</option>
                        <option value="M">Adult M (38")</option>
                        <option value="L">Adult L (40")</option>
                        <option value="XL">Adult XL (42")</option>
                        <option value="XXL">Adult XXL (44")</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 4: SPORTS SELECTION ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                Step 4: Select Sports for Each Member
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose eligible sports for each registered family athlete. Age criteria are checked in real-time.
              </p>
            </div>

            {loadingEvents ? (
              <div className="p-8 text-center text-slate-400">Loading sports fest events...</div>
            ) : (
              <div className="space-y-8">
                {members.map((member) => (
                  <div
                    key={member.tempId}
                    className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          {member.fullName || 'Participant'}
                          <span className="text-xs font-normal text-slate-500">
                            ({member.age} years old • {member.gender})
                          </span>
                        </h3>
                      </div>
                      <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        {
                          allocations.filter((a) => a.tempMemberId === member.tempId).length
                        }{' '}
                        Sports Selected
                      </span>
                    </div>

                    {/* Sports Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {events.map((event) => {
                        const isSelected = allocations.some(
                          (a) => a.tempMemberId === member.tempId && a.eventId === event._id
                        );
                        const isAgeEligible =
                          member.age >= event.minAge && member.age <= event.maxAge;
                        const isClosed =
                          event.status === 'closed' ||
                          event.registeredCount >= event.maxParticipants;

                        return (
                          <div
                            key={event._id}
                            onClick={() => {
                              if (!isClosed) toggleSport(member.tempId, event._id);
                            }}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-500 shadow-md shadow-blue-500/10'
                                : isClosed
                                ? 'bg-slate-100/60 border-slate-200 opacity-50 cursor-not-allowed'
                                : !isAgeEligible
                                ? 'bg-slate-100/70 border-slate-200 opacity-60'
                                : 'bg-white border-slate-200 hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`text-xs font-bold leading-tight ${
                                  isSelected ? 'text-blue-900' : 'text-slate-900'
                                }`}
                              >
                                {event.title}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-[10px]">
                              <span className="text-slate-500 font-medium">
                                {event.sportType} • {event.category}
                              </span>
                              {isAgeEligible ? (
                                <span className="text-blue-600 font-semibold">
                                  {event.minAge}-{event.maxAge}y
                                </span>
                              ) : (
                                <span className="text-rose-600 font-semibold">
                                  Req: {event.minAge}-{event.maxAge}y
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 5: SPORT DETAILS ================= */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                Step 5: Sport-Specific Preferences & Roles
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Help referees and team coordinators assign roles, pairs, or gear.
              </p>
            </div>

            {allocations.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No sports selected yet. Please go back to Step 4 to select sports.
              </div>
            ) : (
              <div className="space-y-4">
                {allocations.map((alloc, idx) => {
                  const member = members.find((m) => m.tempId === alloc.tempMemberId);
                  const event = events.find((e) => e._id === alloc.eventId);
                  if (!member || !event) return null;

                  return (
                    <div
                      key={`${alloc.tempMemberId}-${alloc.eventId}`}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {member.fullName} —{' '}
                            <span className="text-blue-600">{event.title}</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                          {event.sportType}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {/* Cricket Role */}
                        {event.sportType === 'Cricket' && (
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                              Preferred Role
                            </label>
                            <select
                              value={alloc.role || 'All-Rounder'}
                              onChange={(e) =>
                                updateAllocationDetails(
                                  alloc.tempMemberId,
                                  alloc.eventId,
                                  'role',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600"
                            >
                              <option value="Batsman">Top-order Batsman</option>
                              <option value="Bowler">Fast / Spin Bowler</option>
                              <option value="All-Rounder">All-Rounder</option>
                              <option value="Wicket-Keeper">Wicket-Keeper</option>
                            </select>
                          </div>
                        )}

                        {/* Football Role */}
                        {event.sportType === 'Football' && (
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                              Position
                            </label>
                            <select
                              value={alloc.role || 'Midfielder'}
                              onChange={(e) =>
                                updateAllocationDetails(
                                  alloc.tempMemberId,
                                  alloc.eventId,
                                  'role',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600"
                            >
                              <option value="Striker">Striker / Forward</option>
                              <option value="Midfielder">Midfielder</option>
                              <option value="Defender">Defender</option>
                              <option value="Goalkeeper">Goalkeeper</option>
                            </select>
                          </div>
                        )}

                        {/* Badminton / Table Tennis Partner */}
                        {(event.sportType === 'Badminton' || event.sportType === 'Table Tennis') && (
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                              Doubles Partner Name (If applicable)
                            </label>
                            <input
                              type="text"
                              value={alloc.partnerName || ''}
                              onChange={(e) =>
                                updateAllocationDetails(
                                  alloc.tempMemberId,
                                  alloc.eventId,
                                  'partnerName',
                                  e.target.value
                                )
                              }
                              placeholder="Leave blank for random draw"
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600"
                            />
                          </div>
                        )}

                        {/* Slow Cycling Gear */}
                        {event.sportType === 'Slow Cycling' && (
                          <div>
                            <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                              Bicycle Preference
                            </label>
                            <select
                              value={alloc.bicycleOption || 'Own Bicycle'}
                              onChange={(e) =>
                                updateAllocationDetails(
                                  alloc.tempMemberId,
                                  alloc.eventId,
                                  'bicycleOption',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600"
                            >
                              <option value="Own Bicycle">Bringing Own Bicycle</option>
                              <option value="Need Society Bicycle">Request Society Bicycle</option>
                            </select>
                          </div>
                        )}

                        {/* General Notes */}
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                            Additional notes for referee / coach
                          </label>
                          <input
                            type="text"
                            value={alloc.notes || ''}
                            onChange={(e) =>
                              updateAllocationDetails(
                                alloc.tempMemberId,
                                alloc.eventId,
                                'notes',
                                e.target.value
                              )
                            }
                            placeholder="e.g. Left-handed, available morning slot only"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:border-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 6: REVIEW & CONFIRMATION ================= */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Step 6: Review Registration & Confirm
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Please verify all personal, house, and sports enrollment information before final submission.
              </p>
            </div>

            {/* Overview Summary Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                  Household & Contact
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p>
                    <span className="text-slate-500">Family:</span> <strong>{familyName}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Address:</span> {blockTower} - {houseNumber}
                  </p>
                  <p>
                    <span className="text-slate-500">Contact:</span> {contactName} ({contactPhone})
                  </p>
                  <p>
                    <span className="text-slate-500">Email:</span> {contactEmail}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                  Athletes & Entries
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p>
                    <span className="text-slate-500">Athletes Registered:</span>{' '}
                    <strong>{members.length} members</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Total Sport Enrollments:</span>{' '}
                    <strong className="text-blue-600">{allocations.length} entries</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Registration Fee:</span>{' '}
                    <span className="text-emerald-600 font-bold uppercase">Free (RWA Sponsored)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Athletes Roster Breakdown */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800">
                Registered Athletes Roster
              </div>
              <div className="divide-y divide-slate-100">
                {members.map((member) => {
                  const memberSports = allocations
                    .filter((a) => a.tempMemberId === member.tempId)
                    .map((a) => {
                      const ev = events.find((e) => e._id === a.eventId);
                      return {
                        title: ev?.title || 'Sport',
                        venue: ev?.venue || 'Ground',
                        time: ev?.scheduleTime || '',
                        specific: a.role || a.partnerName || a.bicycleOption,
                      };
                    });

                  return (
                    <div key={member.tempId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {member.fullName}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            ({member.age}y • {member.gender} • T-Shirt: {member.tShirtSize})
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {memberSports.length > 0 ? (
                            memberSports.map((s, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                              >
                                {s.title}
                                {s.specific ? ` (${s.specific})` : ''}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-rose-500">No sports assigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terms & Code of Conduct Checkbox */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeRules}
                  onChange={(e) => setAgreeRules(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I confirm that all provided details are correct. All registered family members agree
                  to abide by tournament rules, practice fair sportsmanship, wear the official society
                  athletic kit, and arrive at venues 15 minutes prior to game times.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ================= STEP 7: PASS CONFIRMATION & SUCCESS (SWISS ENTRY TICKET) ================= */}
        {step === 7 && registrationResult && (
          <div className="space-y-8 text-center py-4 font-mono">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#111111] text-white">
                REGISTRATION CONFIRMED • PASS ACTIVE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111111] mt-3">
                COLONYGAMES 2026 PASS ISSUED
              </h2>
              <p className="text-xs text-[#555555] mt-1.5 max-w-md mx-auto font-sans">
                Official accreditation generated for {familyName}. An electronic copy has been dispatched to{' '}
                <strong className="text-[#111111]">{contactEmail}</strong>.
              </p>
            </div>

            {/* Official Pass Badge Card - Swiss Cultural Event Ticket */}
            <div className="max-w-md mx-auto bg-white border-2 border-[#111111] text-left p-0 overflow-hidden shadow-sm">
              <div className="p-4 bg-[#111111] text-white flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#aaaaaa]">
                    OFFICIAL ATHLETIC CREDENTIAL
                  </div>
                  <div className="text-sm font-black uppercase tracking-tight">COLONYGAMES 2026</div>
                </div>
                <span className="text-[10px] font-black tracking-widest bg-[#dc2626] text-white px-2 py-0.5">
                  VALIDATED
                </span>
              </div>

              {/* Scannable QR Code */}
              {registrationResult.qrCodeDataUrl && (
                <div className="p-6 bg-white flex flex-col items-center justify-center border-b border-[#111111]/20">
                  <div className="p-2 border border-[#111111] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={registrationResult.qrCodeDataUrl}
                      alt="Registration QR Pass"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3 bg-[#f4f4f0]/50">
                <div className="flex items-center justify-between border-b border-[#111111]/15 pb-2">
                  <span className="text-[10px] text-[#666666] uppercase">CREDENTIAL ID:</span>
                  <span className="text-sm font-black text-[#111111] tracking-wider">
                    {registrationResult.registrationId}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#111111]/15 pb-2">
                  <span className="text-[10px] text-[#666666] uppercase">HOUSEHOLD:</span>
                  <span className="text-xs font-bold text-[#111111] uppercase">
                    {familyName} ({blockTower} - {houseNumber})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#666666] uppercase">PRIMARY ATHLETE:</span>
                  <span className="text-xs font-bold text-[#111111] uppercase">
                    {contactName}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#111111] text-white text-[9px] uppercase tracking-wider text-center">
                PRESENT AT REGISTRATION DESK FOR JERSEY PICKUP & GATE ENTRY
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`/api/registrations/${registrationResult.registrationId}/pdf`}
                download
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#111111] hover:bg-[#dc2626] text-white font-bold text-xs uppercase tracking-widest border border-[#111111] transition-colors"
              >
                <Download className="w-4 h-4" /> DOWNLOAD OFFICIAL PDF PASS
              </a>

              <Link
                href={`/confirmation/${registrationResult.registrationId}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#f4f4f0] text-[#111111] font-bold text-xs uppercase tracking-widest border border-[#111111] transition-colors"
              >
                <Printer className="w-4 h-4" /> PRINT PASS
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        {step < 7 && (
          <div className="mt-8 pt-6 border-t border-[#111111]/15 flex items-center justify-between font-mono">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-[#f4f4f0] text-[#111111] text-xs font-bold uppercase tracking-wider border border-[#111111]/30 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> PREVIOUS
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#dc2626] text-white text-xs font-bold uppercase tracking-widest border border-[#111111] transition-colors"
              >
                CONTINUE TO PHASE 0{step + 1} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting || !agreeRules}
                className={`inline-flex items-center gap-2 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest border transition-colors ${
                  submitting || !agreeRules
                    ? 'bg-[#ebebe6] text-[#888888] border-[#111111]/20 cursor-not-allowed'
                    : 'bg-[#111111] hover:bg-[#dc2626] text-white border-[#111111]'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                    ACCREDITING PASS...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#dc2626]" /> CONFIRM ROSTER & ISSUE PASS
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
