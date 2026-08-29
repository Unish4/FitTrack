import React from 'react';
import { Card, Badge, Button } from '../ui';
import { Dumbbell, Edit, Trash2, ImagePlus, ChevronRight } from 'lucide-react';

const difficultyVariants = {
  beginner: 'emerald',
  intermediate: 'amber',
  advanced: 'rose',
};

const categoryVariants = {
  strength: 'indigo',
  cardio: 'sky',
  flexibility: 'purple',
  balance: 'emerald',
  other: 'neutral',
};

export const ExerciseCard = ({
  exercise,
  onViewDetails,
  onEdit,
  onDelete,
  onUploadImage,
  isAdmin = false,
}) => {
  return (
    <Card hoverable className="flex flex-col h-full group" onClick={() => onViewDetails(exercise)}>
      {/* Header Image Thumbnail */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden border-b border-slate-800/80 flex items-center justify-center">
        {exercise.image?.url ? (
          <img
            src={exercise.image.url}
            alt={exercise.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 flex flex-col items-center justify-center text-slate-600 space-y-2">
            <Dumbbell className="w-12 h-12 stroke-[1.5] group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {exercise.category}
            </span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge variant={categoryVariants[exercise.category] || 'neutral'} size="sm">
            {exercise.category}
          </Badge>
          <Badge variant={difficultyVariants[exercise.difficulty] || 'emerald'} size="sm">
            {exercise.difficulty}
          </Badge>
        </div>

        {/* Admin Quick Overlay Actions */}
        {isAdmin && (
          <div
            className="absolute bottom-2 right-2 flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition-opacity bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onUploadImage(exercise)}
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Upload Image"
            >
              <ImagePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(exercise)}
              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit Exercise"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(exercise)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete Exercise"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
              {exercise.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Muscle:
            </span>
            <span className="text-xs font-bold text-emerald-400 capitalize">
              {exercise.muscleGroup}
            </span>
          </div>

          {/* Equipment Pills */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {exercise.equipment.map((eq) => (
                <span
                  key={eq}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[10px] font-medium border border-slate-700/50 capitalize"
                >
                  {eq}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* View Details Button */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-200">
          <span>View Instructions</span>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Card>
  );
};
