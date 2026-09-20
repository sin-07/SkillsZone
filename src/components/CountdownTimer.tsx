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
      <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#dc2626] bg-[#dc2626]/10 text-[#dc2626] font-mono font-bold text-xs uppercase tracking-widest">
        <Flame className="w-4 h-4 text-[#dc2626] animate-pulse" />
        THE FESTIVAL HAS OFFICIALLY BEGUN
      </div>
    );
  }

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HRS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEC', value: timeLeft.seconds },
  ];

  return (
    <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center border border-[#111111]/20 bg-white max-w-full">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#111111] text-white font-mono text-[10px] font-bold uppercase tracking-widest shrink-0 border-b sm:border-b-0 sm:border-r border-[#111111]">
        <span className="w-1.5 h-1.5 bg-[#dc2626] animate-pulse" />
        <span>T-MINUS // OPENING</span>
      </div>
      <div className="grid grid-cols-4 divide-x divide-[#111111]/15">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center py-2 px-3 sm:px-4 min-w-[54px] sm:min-w-[64px]"
          >
            <span className="text-xl sm:text-2xl font-mono font-black text-[#111111] tabular-nums tracking-tight leading-none">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-mono font-bold uppercase text-[#888888] tracking-widest mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
