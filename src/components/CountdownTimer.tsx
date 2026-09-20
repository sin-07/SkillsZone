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
      <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-[#facc15] text-black font-mono font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#000000]">
        <Flame className="w-4 h-4 text-[#ef4444] animate-pulse" />
        THE FESTIVAL HAS OFFICIALLY BEGUN!
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
    <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center border-2 border-black bg-white shadow-[5px_5px_0px_#000000] max-w-full">
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#facc15] text-black font-mono text-[11px] font-black uppercase tracking-wider shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
        <span className="w-2 h-2 bg-[#ef4444] animate-ping" />
        <span>KICKOFF IN:</span>
      </div>
      <div className="grid grid-cols-4 divide-x-2 divide-black">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center py-2 px-3.5 sm:px-5 min-w-[58px] sm:min-w-[70px] bg-white hover:bg-[#fef08a] transition-colors"
          >
            <span className="text-2xl sm:text-3xl font-mono font-black text-black tabular-nums tracking-tight leading-none">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono font-black uppercase text-black/60 tracking-wider mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
