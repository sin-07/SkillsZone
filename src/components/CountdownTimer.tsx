'use client';

import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: string;
}

export default function CountdownTimer({ targetDate = '2026-10-15T08:00:00' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm shadow-xs">
        <Flame className="w-5 h-5 text-blue-600 animate-pulse" />
        THE FEST HAS OFFICIALLY BEGUN!
      </div>
    );
  }

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="inline-flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider shrink-0">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        <span>Kickoff In</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-xl bg-slate-50 border border-slate-200/80 min-w-[58px] sm:min-w-[68px]"
          >
            <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums tracking-tight leading-none">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
