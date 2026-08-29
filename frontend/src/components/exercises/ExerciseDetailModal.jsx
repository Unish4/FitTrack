import React from 'react';
import { Modal, Badge } from '../ui';
import { Dumbbell, Lightbulb, ListOrdered, Wrench } from 'lucide-react';

export const ExerciseDetailModal = ({ isOpen, onClose, exercise }) => {
  if (!exercise) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exercise.name}
      subtitle={`${exercise.category.toUpperCase()} • ${exercise.muscleGroup.toUpperCase()}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Banner Image or Placeholder */}
        <div className="w-full h-56 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
          {exercise.image?.url ? (
            <img src={exercise.image.url} alt={exercise.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-600 space-y-2">
              <Dumbbell className="w-16 h-16 stroke-[1.5]" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {exercise.muscleGroup}
              </span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <Badge variant="emerald">{exercise.category}</Badge>
            <Badge variant="indigo">{exercise.difficulty}</Badge>
          </div>
        </div>

        {/* Equipment Badges */}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-400" /> Equipment Needed
            </h4>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map((eq) => (
                <span
                  key={eq}
                  className="px-3 py-1 bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 capitalize"
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {exercise.instructions && exercise.instructions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-emerald-400" /> Step-by-Step Instructions
            </h4>
            <ol className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Tips */}
        {exercise.tips && exercise.tips.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> Pro Tips
            </h4>
            <ul className="space-y-2">
              {exercise.tips.map((tip, idx) => (
                <li key={idx} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-slate-300 leading-relaxed">
                  💡 {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};
