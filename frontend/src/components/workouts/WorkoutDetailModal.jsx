import React from 'react';
import { Modal, Badge } from '../ui';
import { Clock, Flame, Calendar, Dumbbell, Activity, Check, FileText } from 'lucide-react';
import { WORKOUT_MOODS } from '../../utils/constants';

export const WorkoutDetailModal = ({ isOpen, onClose, workout }) => {
  if (!workout) return null;

  const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const getMoodEmoji = (moodValue) => {
    const found = WORKOUT_MOODS.find((m) => m.value === moodValue);
    return found ? found.emoji : '💪';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={workout.name}
      subtitle={formattedDate}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Metric Badges Summary Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-400" /> Duration
            </span>
            <p className="text-base font-extrabold text-white">{workout.duration} min</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Calories
            </span>
            <p className="text-base font-extrabold text-amber-400">{workout.caloriesBurned || 0} kcal</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" /> Intensity
            </span>
            <Badge variant="purple" size="sm" className="capitalize">
              {workout.intensity || 'Medium'}
            </Badge>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Mood
            </span>
            <p className="text-base font-extrabold text-white flex items-center gap-1">
              <span>{getMoodEmoji(workout.mood)}</span>
              <span className="capitalize text-xs font-semibold text-slate-300">{workout.mood}</span>
            </p>
          </div>
        </div>

        {/* Notes */}
        {workout.notes && (
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Workout Notes
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed italic">{workout.notes}</p>
          </div>
        )}

        {/* Exercises Breakdown List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-emerald-400" /> Exercise Breakdown ({workout.exercises?.length || 0})
          </h4>

          {workout.exercises?.map((item, exIdx) => {
            const exerciseName = item.name || item.exercise?.name || `Exercise #${exIdx + 1}`;
            return (
              <div key={exIdx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                      {exIdx + 1}
                    </span>
                    {exerciseName}
                  </h5>
                  {item.notes && <span className="text-xs text-slate-400 italic">"{item.notes}"</span>}
                </div>

                {/* Sets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-2 px-3">Set</th>
                        <th className="py-2 px-3">Reps</th>
                        <th className="py-2 px-3">Weight (kg)</th>
                        <th className="py-2 px-3">Rest (s)</th>
                        <th className="py-2 px-3 text-right">Volume</th>
                        <th className="py-2 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {item.sets?.map((set, setIdx) => {
                        const setVol = (set.reps || 0) * (set.weight || 0);
                        return (
                          <tr key={setIdx} className="text-slate-300 hover:bg-slate-900/50">
                            <td className="py-2 px-3 font-semibold text-slate-400">#{setIdx + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-100">{set.reps || 0}</td>
                            <td className="py-2 px-3 font-bold text-emerald-400">{set.weight || 0} kg</td>
                            <td className="py-2 px-3 text-slate-400">{set.restTime || 60}s</td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-slate-300">
                              {setVol > 0 ? `${setVol} kg` : '-'}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {set.completed !== false ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
                                  <Check className="w-3.5 h-3.5" />
                                </span>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
