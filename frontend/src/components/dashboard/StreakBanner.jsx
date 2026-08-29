import React from 'react';
import { Card } from '../ui/Card';
import { Flame, Check, Zap } from 'lucide-react';

export const StreakBanner = ({ streak = 0, totalWorkouts = 0, recentWorkoutDates = [] }) => {
  // Generate last 7 days starting from 6 days ago up to today
  const last7Days = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - index));
    d.setHours(0, 0, 0, 0);

    const isWorkedOut = recentWorkoutDates.some((wDate) => {
      const dateObj = new Date(wDate);
      dateObj.setHours(0, 0, 0, 0);
      return dateObj.getTime() === d.getTime();
    });

    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const isToday = index === 6;

    return { date: d, dayName, isWorkedOut, isToday };
  });

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/20 p-6 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl shadow-amber-950/50 shrink-0">
            <Flame className="w-8 h-8 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black text-white tracking-tight">
                {streak} Day Workout Streak
              </span>
              {streak > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-500/30">
                  On Fire! 🔥
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Total Workouts Logged: <strong className="text-slate-200">{totalWorkouts}</strong></span>
            </p>
          </div>
        </div>

        {/* 7-Day Activity Matrix */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right sm:text-left">
            Past 7 Days
          </div>
          <div className="flex items-center space-x-2">
            {last7Days.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    item.isWorkedOut
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40 ring-2 ring-amber-400/30'
                      : item.isToday
                      ? 'bg-slate-800 border-2 border-amber-500/50 text-slate-300'
                      : 'bg-slate-800/60 border border-slate-700/50 text-slate-500'
                  }`}
                  title={item.date.toLocaleDateString()}
                >
                  {item.isWorkedOut ? <Check className="w-4 h-4 stroke-[3]" /> : item.dayName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
