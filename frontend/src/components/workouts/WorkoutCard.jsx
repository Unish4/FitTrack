import React from 'react';
import { Card, Badge } from '../ui';
import { Clock, Flame, Calendar, Dumbbell, Trash2, Edit, ChevronRight } from 'lucide-react';
import { WORKOUT_MOODS } from '../../utils/constants';

const typeVariants = {
  strength: 'indigo',
  cardio: 'sky',
  flexibility: 'purple',
  mixed: 'emerald',
};

export const WorkoutCard = ({
  workout,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getMoodEmoji = (moodValue) => {
    const found = WORKOUT_MOODS.find((m) => m.value === moodValue);
    return found ? found.emoji : '💪';
  };

  // Calculate total volume (virtual or computed)
  const totalVolume = workout.exercises?.reduce((acc, item) => {
    const itemVol = item.sets?.reduce((sAcc, s) => sAcc + (s.reps || 0) * (s.weight || 0), 0) || 0;
    return acc + itemVol;
  }, 0);

  return (
    <Card hoverable className="flex flex-col h-full group" onClick={() => onViewDetails(workout)}>
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Header: Title, Date, Type Badge */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getMoodEmoji(workout.mood)}</span>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors truncate">
                  {workout.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {formattedDate}
              </p>
            </div>

            <Badge variant={typeVariants[workout.type] || 'emerald'} size="sm">
              {workout.type}
            </Badge>
          </div>

          {/* Key Metrics Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {workout.duration} min
            </span>

            {workout.caloriesBurned > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5" />
                {workout.caloriesBurned} kcal
              </span>
            )}

            {totalVolume > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Dumbbell className="w-3.5 h-3.5" />
                {totalVolume.toLocaleString()} kg vol
              </span>
            )}
          </div>
        </div>

        {/* Exercises Preview List */}
        {workout.exercises && workout.exercises.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Exercises ({workout.exercises.length})
            </p>
            <div className="space-y-1">
              {workout.exercises.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs text-slate-300 p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/50"
                >
                  <span className="font-semibold truncate max-w-[180px]">
                    {item.name || item.exercise?.name || 'Exercise'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.sets?.length || 0} sets
                  </span>
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <p className="text-[10px] text-slate-500 italic pl-1">
                  +{workout.exercises.length - 3} more exercises...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit(workout)}
              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit Workout"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(workout)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete Workout"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-400 flex items-center gap-1">
            Details <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Card>
  );
};
