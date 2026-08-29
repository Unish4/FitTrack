import React from 'react';
import { Input, Select, Button } from '../ui';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS } from '../../utils/constants';

export const ExerciseFilterBar = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  muscleGroupFilter,
  onMuscleGroupChange,
  difficultyFilter,
  onDifficultyChange,
  onClearFilters,
}) => {
  const hasActiveFilters =
    searchQuery || categoryFilter || muscleGroupFilter || difficultyFilter;

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Search Bar */}
        <Input
          placeholder="Search exercise name or muscle..."
          iconLeft={Search}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {/* Category Select */}
        <Select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="All Categories"
          options={EXERCISE_CATEGORIES}
        />

        {/* Muscle Group Select */}
        <Select
          value={muscleGroupFilter}
          onChange={(e) => onMuscleGroupChange(e.target.value)}
          placeholder="All Muscle Groups"
          options={MUSCLE_GROUPS}
        />

        {/* Difficulty Select */}
        <Select
          value={difficultyFilter}
          onChange={(e) => onDifficultyChange(e.target.value)}
          placeholder="All Difficulties"
          options={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
          ]}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400 font-medium">Filters Applied</span>
          <Button variant="ghost" size="sm" iconLeft={RotateCcw} onClick={onClearFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};
