'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Building,
} from 'lucide-react';

export default function ResultsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [familyLeaderboard, setFamilyLeaderboard] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [towerLeaderboard, setTowerLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'events' | 'towers'>('leaderboard');
  const [selectedSport, setSelectedSport] = useState('All');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/results');
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setFamilyLeaderboard(data.familyLeaderboard || []);
          setTowerLeaderboard(data.towerLeaderboard || []);
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
      {/* Page Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 mb-3 shadow-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-600" /> Live Tournament Standings
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Society Leaderboard & Results
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Gold, Silver, and Bronze medal tallies, Family Championship standings, and Tower Cup rankings for ColonyGames 2026.
        </p>

        {/* View Switcher Tabs */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 mt-6 shadow-md">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'leaderboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-4 h-4" /> Family Championship
          </button>
          <button
            onClick={() => setActiveTab('towers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'towers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" /> Tower / Block Cup
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Medal className="w-4 h-4" /> Event Scorecards
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500">Loading live scores & medal tallies...</div>
      ) : (
        <>
          {/* ================= TAB 1: FAMILY CHAMPIONSHIP ================= */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-8">
              {/* Podium Top 3 Families */}
              {familyLeaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
                  {/* 2nd Place Silver */}
                  <div className="order-2 md:order-1 p-6 rounded-3xl bg-white border border-slate-200 shadow-xl text-center relative overflow-hidden">
                    <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-800 font-black text-lg flex items-center justify-center mx-auto mb-3 shadow-md shadow-slate-300/40">
                      2
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      SILVER PODIUM
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {familyLeaderboard[1].familyName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {familyLeaderboard[1].blockTower} • Unit {familyLeaderboard[1].houseNumber}
                    </p>
                    <div className="text-2xl font-black text-slate-800 mt-3">
                      {familyLeaderboard[1].points} <span className="text-xs font-normal text-slate-500">pts</span>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold">
                      <span className="text-amber-600">🥇 {familyLeaderboard[1].medals?.gold || 0}</span>
                      <span className="text-slate-600">🥈 {familyLeaderboard[1].medals?.silver || 0}</span>
                      <span className="text-amber-800">🥉 {familyLeaderboard[1].medals?.bronze || 0}</span>
                    </div>
                  </div>

                  {/* 1st Place Gold (Taller) */}
                  <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-50 via-white to-white border-2 border-amber-300 shadow-2xl text-center relative overflow-hidden md:-translate-y-4">
                    <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500" />
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-amber-400/30">
                      <Crown className="w-7 h-7 text-slate-950" />
                    </div>
                    <span className="text-xs uppercase font-extrabold text-amber-800 tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                      GOLD CHAMPIONS
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                      {familyLeaderboard[0].familyName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {familyLeaderboard[0].blockTower} • Unit {familyLeaderboard[0].houseNumber}
                    </p>
                    <div className="text-4xl font-black text-amber-600 mt-3">
                      {familyLeaderboard[0].points} <span className="text-xs font-bold text-slate-400">POINTS</span>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-3 text-sm font-bold bg-amber-50/60 py-2 px-4 rounded-xl border border-amber-200">
                      <span className="text-amber-600">🥇 {familyLeaderboard[0].medals?.gold || 0}</span>
                      <span className="text-slate-600">🥈 {familyLeaderboard[0].medals?.silver || 0}</span>
                      <span className="text-amber-800">🥉 {familyLeaderboard[0].medals?.bronze || 0}</span>
                    </div>
                  </div>

                  {/* 3rd Place Bronze */}
                  <div className="order-3 md:order-3 p-6 rounded-3xl bg-white border border-slate-200 shadow-xl text-center relative overflow-hidden">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 font-black text-lg flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-200/50">
                      3
                    </div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                      BRONZE PODIUM
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {familyLeaderboard[2].familyName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {familyLeaderboard[2].blockTower} • Unit {familyLeaderboard[2].houseNumber}
                    </p>
                    <div className="text-2xl font-black text-slate-800 mt-3">
                      {familyLeaderboard[2].points} <span className="text-xs font-normal text-slate-500">pts</span>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold">
                      <span className="text-amber-600">🥇 {familyLeaderboard[2].medals?.gold || 0}</span>
                      <span className="text-slate-600">🥈 {familyLeaderboard[2].medals?.silver || 0}</span>
                      <span className="text-amber-800">🥉 {familyLeaderboard[2].medals?.bronze || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Standings Table */}
              <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xl shadow-slate-200/40 max-w-4xl mx-auto">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-blue-600" />
                    Complete Family Standings
                  </h3>
                  <span className="text-xs text-slate-500">
                    Points: Gold = 10 • Silver = 7 • Bronze = 5
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {familyLeaderboard.map((fam, idx) => (
                    <div
                      key={fam._id}
                      className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                            idx === 0
                              ? 'bg-amber-400 text-slate-950'
                              : idx === 1
                              ? 'bg-slate-200 text-slate-800'
                              : idx === 2
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{fam.familyName}</div>
                          <div className="text-xs text-slate-500">
                            {fam.blockTower} • Unit {fam.houseNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                          <span className="text-amber-600">🥇 {fam.medals?.gold || 0}</span>
                          <span className="text-slate-600">🥈 {fam.medals?.silver || 0}</span>
                          <span className="text-amber-800">🥉 {fam.medals?.bronze || 0}</span>
                        </div>
                        <div className="text-right min-w-[70px]">
                          <span className="text-base font-black text-blue-600">{fam.points}</span>
                          <span className="text-[10px] text-slate-400 uppercase ml-1">pts</span>
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
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {towerLeaderboard.map((t, idx) => (
                  <div
                    key={t.tower}
                    className={`p-6 rounded-3xl border transition-all ${
                      idx === 0
                        ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-xl'
                        : 'bg-white border-slate-200 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                        <Building className="w-4 h-4" />
                        {t.tower}
                      </span>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {t.points} <span className="text-xs font-normal text-slate-500">points</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      From {t.families} registered society families
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <span className="text-amber-600">🥇 {t.gold}</span>
                      <span className="text-slate-600">🥈 {t.silver}</span>
                      <span className="text-amber-800">🥉 {t.bronze}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: EVENT SCORECARDS ================= */}
          {activeTab === 'events' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Sport Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {sportsList.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedSport === sport
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>

              {filteredResults.length === 0 ? (
                <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <Medal className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">No completed match results published yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Check back once knockout rounds and finals commence!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredResults.map((res) => (
                    <div
                      key={res._id}
                      className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xl shadow-slate-200/40"
                    >
                      <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                            {res.sportType} • {res.category}
                          </span>
                          <h3 className="text-lg font-black text-slate-900">{res.eventTitle}</h3>
                        </div>
                        <span className="text-xs text-slate-500">
                          Completed on {new Date(res.publishedAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {res.winners.map((w: any) => (
                          <div
                            key={w.rank}
                            className={`p-4 rounded-2xl border flex flex-col justify-between ${
                              w.rank === 1
                                ? 'bg-amber-50/60 border-amber-200'
                                : w.rank === 2
                                ? 'bg-slate-50 border-slate-200'
                                : 'bg-amber-50/30 border-amber-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                                  w.rank === 1
                                    ? 'bg-amber-400 text-slate-950'
                                    : w.rank === 2
                                    ? 'bg-slate-200 text-slate-800'
                                    : 'bg-amber-200 text-amber-900'
                                }`}
                              >
                                {w.medal.toUpperCase()}
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-700">
                                {w.scoreOrTime}
                              </span>
                            </div>

                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {w.participantName}
                              </div>
                              <div className="text-xs text-slate-500">
                                {w.familyName} ({w.blockTower} - {w.houseNumber})
                              </div>
                              {w.notes && (
                                <div className="text-[11px] text-blue-600 mt-1 italic">
                                  &quot;{w.notes}&quot;
                                </div>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-200 text-right text-xs font-bold text-blue-600">
                              +{w.pointsAwarded} pts to Family
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
