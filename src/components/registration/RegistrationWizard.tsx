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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Top Banner Heading */}
      <div className="text-center mb-8 sm:mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-3 shadow-xs">
          <Trophy className="w-3.5 h-3.5 text-blue-600" /> Official Society Registration
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          ColonyGames <span className="text-blue-600">2026</span> Entry Pass
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Register your family, enroll members across 9 sports, and receive your digital QR pass instantly.
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center justify-between min-w-[580px] px-2">
          {stepsList.map((s, idx) => {
            const Icon = s.icon;
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/25'
                        : isCurrent
                        ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white ring-4 ring-blue-100 font-black scale-110 shadow-md'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[11px] font-semibold tracking-wide ${
                      isCurrent ? 'text-blue-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                      step > s.num ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Container */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
        {/* ================= STEP 1: PERSONAL DETAILS ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
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
                      <span className="text-xs text-blue-700 font-semibold bg-blue-100/70 px-2.5 py-1 rounded-full border border-blue-200">
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
                                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium"
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

        {/* ================= STEP 7: PASS CONFIRMATION & SUCCESS ================= */}
        {step === 7 && registrationResult && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/20">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Registration Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                You&apos;re All Set for ColonyGames 2026!
              </h2>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                Your entry pass has been generated. An email confirmation has been sent to{' '}
                <strong className="text-slate-800">{contactEmail}</strong> with the official PDF pass attached.
              </p>
            </div>

            {/* Official Pass Badge Card */}
            <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-200 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    Official Entry Pass
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">COLONYGAMES 2026</div>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                  VERIFIED
                </span>
              </div>

              {/* Scannable QR Code */}
              {registrationResult.qrCodeDataUrl && (
                <div className="p-3 bg-white rounded-2xl max-w-[190px] mx-auto mb-4 shadow-md border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={registrationResult.qrCodeDataUrl}
                    alt="Registration QR Pass"
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="text-center">
                <div className="text-xs text-slate-500">REGISTRATION PASS ID</div>
                <div className="text-2xl font-black tracking-widest text-blue-700 font-mono mt-0.5">
                  {registrationResult.registrationId}
                </div>
                <div className="text-xs text-slate-700 font-semibold mt-1">
                  {familyName} • {blockTower} - {houseNumber}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                Present this QR code at the Gate Registration Desk for kit pickup & attendance check-in.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`/api/registrations/${registrationResult.registrationId}/pdf`}
                download
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" /> Download Official Pass (PDF)
              </a>

              <Link
                href={`/confirmation/${registrationResult.registrationId}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200 transition"
              >
                <Printer className="w-4 h-4" /> View Full Digital Pass
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-medium text-sm border border-slate-200 transition"
              >
                Go to Member Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        {step < 7 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition hover:scale-105 active:scale-95"
              >
                Continue to Step {step + 1} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting || !agreeRules}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition shadow-lg ${
                  submitting || !agreeRules
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white hover:brightness-110 shadow-blue-500/25 hover:scale-105 active:scale-95'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Official Pass...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Complete Registration & Generate Pass
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
