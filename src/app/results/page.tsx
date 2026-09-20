'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Building, Crown } from 'lucide-react';

interface Winner {
  rank: number;
  medal: 'gold' | 'silver' | 'bronze';
  participantName: string;
  familyName: string;
  blockTower: string;
  houseNumber: string;
  scoreOrTime: string;
  notes?: string;
  pointsAwarded: number;
}

interface EventResultItem {
  _id: string;
  eventId: string;
  eventTitle: string;
  sportType: string;
  category: string;
  winners: Winner[];
  publishedAt: string;
}

interface FamilyStanding {
  _id: string;
  familyName: string;
  blockTower: string;
  houseNumber: string;
  points: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

interface TowerStanding {
  tower: string;
  points: number;
  gold: number;
  silver: number;
  bronze: number;
  families: number;
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'towers' | 'events'>('leaderboard');
  const [familyLeaderboard, setFamilyLeaderboard] = useState<FamilyStanding[]>([]);
  const [towerLeaderboard, setTowerLeaderboard] = useState<TowerStanding[]>([]);
  const [results, setResults] = useState<EventResultItem[]>([]);
  const [selectedSport, setSelectedSport] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/results');
        if (res.ok) {
          const data = await res.json();
          setFamilyLeaderboard(data.familyLeaderboard || []);
          setTowerLeaderboard(data.towerLeaderboard || []);
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Failed to load results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const sportsList = ['All', ...Array.from(new Set(results.map((r) => r.sportType)))];

  const filteredResults = selectedSport === 'All'
    ? results
    : results.filter((r) => r.sportType === selectedSport);

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header - Swiss Results Bulletin */}
      <div className="text-center mb-10 sm:mb-14 pb-8 border-b border-[#111111]/20">
        <div className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">
          [ BULLETIN // LIVE TOURNAMENT STANDINGS • COLONYGAMES 2026 ]
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-tight">
          SOCIETY LEADERBOARD & RESULTS
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] mt-2 max-w-xl mx-auto font-normal font-sans">
          Gold, Silver, and Bronze medal honors, Inter-Tower Cup tallies, and official event scorecards.
        </p>

        {/* View Switcher Tabs - Swiss Modular Strip */}
        <div className="inline-flex max-w-full overflow-x-auto p-1 bg-white border border-[#111111] mt-6 font-mono">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors border ${
              activeTab === 'leaderboard'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'text-[#555555] hover:text-[#111111] border-transparent'
            }`}
          >
            <Crown className="w-3.5 h-3.5" /> [01] FAMILY CHAMPIONSHIP
          </button>
          <button
            onClick={() => setActiveTab('towers')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors border ${
              activeTab === 'towers'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'text-[#555555] hover:text-[#111111] border-transparent'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> [02] TOWER CUP
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors border ${
              activeTab === 'events'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'text-[#555555] hover:text-[#111111] border-transparent'
            }`}
          >
            <Medal className="w-3.5 h-3.5" /> [03] SCORECARDS
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center font-mono text-xs text-[#666666]">
          LOADING OFFICIAL RESULTS BULLETIN...
        </div>
      ) : (
        <>
          {/* ================= TAB 1: FAMILY CHAMPIONSHIP ================= */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-10">
              {/* Podium Top 3 Families (Swiss Monolithic Blocks) */}
              {familyLeaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-4 font-mono">
                  {/* 2nd Place Silver */}
                  <div className="order-2 md:order-1 p-6 bg-white border border-[#111111] text-center">
                    <div className="text-3xl font-black text-[#555555] mb-1">02</div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#777777] block">
                      SILVER PODIUM
                    </span>
                    <h3 className="text-base font-black uppercase text-[#111111] mt-2">
                      {familyLeaderboard[1].familyName}
                    </h3>
                    <p className="text-[10px] text-[#666666] uppercase mt-0.5">
                      {familyLeaderboard[1].blockTower} • UNIT {familyLeaderboard[1].houseNumber}
                    </p>
                    <div className="text-3xl font-black text-[#111111] mt-3">
                      {familyLeaderboard[1].points} <span className="text-[10px] text-[#888888]">PTS</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#111111]/15 flex items-center justify-center gap-3 text-[11px] font-bold">
                      <span>🥇 {familyLeaderboard[1].medals?.gold || 0}</span>
                      <span>🥈 {familyLeaderboard[1].medals?.silver || 0}</span>
                      <span>🥉 {familyLeaderboard[1].medals?.bronze || 0}</span>
                    </div>
                  </div>

                  {/* 1st Place Gold (Monumental Center) */}
                  <div className="order-1 md:order-2 p-8 bg-white border-2 border-[#111111] text-center md:-translate-y-4 shadow-sm">
                    <div className="text-4xl font-black text-[#dc2626] mb-1">01</div>
                    <span className="inline-block text-[10px] uppercase font-black tracking-widest bg-[#111111] text-white px-2 py-0.5">
                      GOLD CHAMPIONS
                    </span>
                    <h3 className="text-xl font-black uppercase text-[#111111] mt-2">
                      {familyLeaderboard[0].familyName}
                    </h3>
                    <p className="text-[10px] text-[#666666] uppercase mt-0.5">
                      {familyLeaderboard[0].blockTower} • UNIT {familyLeaderboard[0].houseNumber}
                    </p>
                    <div className="text-5xl font-black text-[#111111] mt-4 tracking-tight">
                      {familyLeaderboard[0].points} <span className="text-xs text-[#888888]">PTS</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#111111]/20 flex items-center justify-center gap-4 text-xs font-bold bg-[#f4f4f0] py-2 border border-[#111111]/15">
                      <span className="text-[#111111]">🥇 {familyLeaderboard[0].medals?.gold || 0}</span>
                      <span className="text-[#555555]">🥈 {familyLeaderboard[0].medals?.silver || 0}</span>
                      <span className="text-[#777777]">🥉 {familyLeaderboard[0].medals?.bronze || 0}</span>
                    </div>
                  </div>

                  {/* 3rd Place Bronze */}
                  <div className="order-3 md:order-3 p-6 bg-white border border-[#111111] text-center">
                    <div className="text-3xl font-black text-[#888888] mb-1">03</div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#777777] block">
                      BRONZE PODIUM
                    </span>
                    <h3 className="text-base font-black uppercase text-[#111111] mt-2">
                      {familyLeaderboard[2].familyName}
                    </h3>
                    <p className="text-[10px] text-[#666666] uppercase mt-0.5">
                      {familyLeaderboard[2].blockTower} • UNIT {familyLeaderboard[2].houseNumber}
                    </p>
                    <div className="text-3xl font-black text-[#111111] mt-3">
                      {familyLeaderboard[2].points} <span className="text-[10px] text-[#888888]">PTS</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#111111]/15 flex items-center justify-center gap-3 text-[11px] font-bold">
                      <span>🥇 {familyLeaderboard[2].medals?.gold || 0}</span>
                      <span>🥈 {familyLeaderboard[2].medals?.silver || 0}</span>
                      <span>🥉 {familyLeaderboard[2].medals?.bronze || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Standings Table - Swiss Architectural Grid */}
              <div className="border border-[#111111] bg-white max-w-4xl mx-auto overflow-hidden font-mono">
                <div className="px-6 py-4 bg-[#f4f4f0] border-b border-[#111111] flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-[#dc2626]" />
                    COMPLETE RESIDENTIAL STANDINGS
                  </h3>
                  <span className="text-[10px] text-[#666666] uppercase">
                    GOLD=10 • SILVER=7 • BRONZE=5
                  </span>
                </div>

                <div className="divide-y divide-[#111111]/15">
                  {familyLeaderboard.map((fam, idx) => (
                    <div
                      key={fam._id}
                      className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#f4f4f0] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-7 h-7 flex items-center justify-center text-xs font-black border ${
                            idx === 0
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : idx === 1
                              ? 'bg-[#444444] text-white border-[#444444]'
                              : idx === 2
                              ? 'bg-[#777777] text-white border-[#777777]'
                              : 'bg-white text-[#555555] border-[#111111]/20'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-black uppercase text-[#111111] text-xs sm:text-sm">
                            {fam.familyName}
                          </div>
                          <div className="text-[10px] text-[#666666] uppercase">
                            {fam.blockTower} • UNIT {fam.houseNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-xs font-bold text-[#444444]">
                          <span>🥇 {fam.medals?.gold || 0}</span>
                          <span>🥈 {fam.medals?.silver || 0}</span>
                          <span>🥉 {fam.medals?.bronze || 0}</span>
                        </div>
                        <div className="text-right min-w-[70px]">
                          <span className="text-base font-black text-[#111111]">{fam.points}</span>
                          <span className="text-[10px] text-[#888888] uppercase ml-1">PTS</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: TOWER / BLOCK CUP ================= */}
          {activeTab === 'towers' && (
            <div className="max-w-4xl mx-auto space-y-6 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {towerLeaderboard.map((t, idx) => (
                  <div
                    key={t.tower}
                    className={`p-6 border bg-white transition-all ${
                      idx === 0
                        ? 'border-2 border-[#111111]'
                        : 'border border-[#111111]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#111111]/15">
                      <span className="text-xs font-bold uppercase text-[#111111] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#dc2626]" />
                        {t.tower}
                      </span>
                      <span
                        className={`text-xs font-black px-2 py-0.5 border ${
                          idx === 0
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-[#f4f4f0] text-[#555555] border-[#111111]/20'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="text-4xl font-black text-[#111111] mt-2">
                      {t.points} <span className="text-xs text-[#888888] font-normal">PTS</span>
                    </div>
                    <p className="text-[10px] text-[#666666] uppercase mt-1">
                      {t.families} REGISTERED FAMILIES
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#111111]/15 flex items-center justify-between text-xs font-bold">
                      <span>🥇 {t.gold}</span>
                      <span>🥈 {t.silver}</span>
                      <span>🥉 {t.bronze}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: EVENT SCORECARDS ================= */}
          {activeTab === 'events' && (
            <div className="max-w-5xl mx-auto space-y-6 font-mono">
              {/* Sport Filter */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none w-full max-w-full min-w-0">
                {sportsList.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors border ${
                      selectedSport === sport
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#555555] hover:text-[#111111] border-[#111111]/20'
                    }`}
                  >
                    [{sport}]
                  </button>
                ))}
              </div>

              {filteredResults.length === 0 ? (
                <div className="p-12 text-center text-[#666666] bg-white border border-[#111111]">
                  <Medal className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    NO COMPLETED RESULTS PUBLISHED YET
                  </p>
                  <p className="text-[10px] text-[#777777] uppercase mt-1">
                    SCORES WILL APPEAR HERE UPON COMPLETION OF MATCHES.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredResults.map((res) => (
                    <div
                      key={res._id}
                      className="border border-[#111111] bg-white overflow-hidden"
                    >
                      <div className="p-4 bg-[#f4f4f0] border-b border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#dc2626]">
                            {res.sportType} // {res.category}
                          </span>
                          <h3 className="text-base font-black uppercase text-[#111111]">{res.eventTitle}</h3>
                        </div>
                        <span className="text-[10px] text-[#666666] uppercase">
                          PUBLISHED: {new Date(res.publishedAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {res.winners.map((w: any) => (
                          <div
                            key={w.rank}
                            className="p-4 border border-[#111111]/20 flex flex-col justify-between bg-white"
                          >
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#111111]/10">
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${
                                  w.rank === 1
                                    ? 'bg-[#111111] text-white border-[#111111]'
                                    : w.rank === 2
                                    ? 'bg-[#555555] text-white border-[#555555]'
                                    : 'bg-[#888888] text-white border-[#888888]'
                                }`}
                              >
                                {w.medal.toUpperCase()}
                              </span>
                              <span className="text-xs font-bold text-[#111111]">
                                {w.scoreOrTime}
                              </span>
                            </div>

                            <div>
                              <div className="font-black text-[#111111] text-xs uppercase">
                                {w.participantName}
                              </div>
                              <div className="text-[10px] text-[#666666] uppercase">
                                {w.familyName} ({w.blockTower} - {w.houseNumber})
                              </div>
                              {w.notes && (
                                <div className="text-[10px] text-[#dc2626] mt-1">
                                  &quot;{w.notes}&quot;
                                </div>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-[#111111]/15 text-right text-[10px] font-bold text-[#111111]">
                              +{w.pointsAwarded} PTS TO FAMILY
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
