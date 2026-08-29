import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Button, Badge } from '../ui';
import { getWorkoutCalendarApi } from '../../api/workout.api';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Dumbbell, Flame, Clock } from 'lucide-react';

export const WorkoutCalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const month = currentDate.getMonth() + 1; // 1-12
  const year = currentDate.getFullYear();

  useEffect(() => {
    const fetchCalendar = async () => {
      setIsLoading(true);
      try {
        const res = await getWorkoutCalendarApi({ month, year });
        setCalendarData(res.data);
      } catch (err) {
        console.error('Failed to fetch calendar:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalendar();
  }, [month, year]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  // Compute days matrix for grid
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0-6 (Sun-Sat)

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Map workouts by day number
  const workoutsByDay = new Map();
  if (calendarData?.workouts) {
    calendarData.workouts.forEach((w) => {
      const dayNum = new Date(w.date).getDate();
      if (!workoutsByDay.has(dayNum)) workoutsByDay.set(dayNum, []);
      workoutsByDay.get(dayNum).push(w);
    });
  }

  const stats = calendarData?.stats || {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    activeDays: 0,
  };

  return (
    <div className="space-y-6">
      {/* Monthly Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Workouts Logged
          </span>
          <p className="text-xl font-extrabold text-white mt-1">{stats.totalWorkouts}</p>
        </Card>
        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" /> Active Days
          </span>
          <p className="text-xl font-extrabold text-indigo-400 mt-1">{stats.activeDays} days</p>
        </Card>
        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" /> Total Duration
          </span>
          <p className="text-xl font-extrabold text-purple-400 mt-1">{stats.totalDuration} mins</p>
        </Card>
        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Calories Burned
          </span>
          <p className="text-xl font-extrabold text-amber-400 mt-1">{stats.totalCalories} kcal</p>
        </Card>
      </div>

      {/* Calendar Grid Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>{monthName}</CardTitle>
              <CardDescription>Monthly activity tracking calendar</CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" iconLeft={ChevronLeft} onClick={handlePrevMonth}>
              Prev
            </Button>
            <Button variant="secondary" size="sm" iconRight={ChevronRight} onClick={handleNextMonth}>
              Next
            </Button>
          </div>
        </CardHeader>

        <CardBody className="p-4 sm:p-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400 animate-pulse">
              Loading calendar matrix...
            </div>
          ) : (
            <div className="space-y-2">
              {/* Day Name Headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {/* Blank lead cells */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`blank-${i}`} className="h-20 sm:h-24 bg-slate-950/30 rounded-xl border border-slate-900" />
                ))}

                {/* Days of Month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayWorkouts = workoutsByDay.get(dayNum) || [];
                  const hasWorkouts = dayWorkouts.length > 0;

                  return (
                    <div
                      key={`day-${dayNum}`}
                      className={`h-20 sm:h-24 p-1 sm:p-2 rounded-xl border flex flex-col justify-between transition-all ${
                        hasWorkouts
                          ? 'bg-gradient-to-b from-slate-900 to-emerald-950/30 border-emerald-500/30 shadow-md'
                          : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${hasWorkouts ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {dayNum}
                        </span>
                        {hasWorkouts && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>

                      {hasWorkouts && (
                        <div className="space-y-1">
                          {dayWorkouts.map((w, wIdx) => (
                            <div
                              key={wIdx}
                              className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-300 truncate"
                              title={`${w.name} (${w.duration} min)`}
                            >
                              {w.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
