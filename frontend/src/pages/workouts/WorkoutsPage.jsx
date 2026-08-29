import React, { useEffect, useState, useCallback } from 'react';
import { useWorkoutStore } from '../../store/workoutStore';
import { WorkoutCard } from '../../components/workouts/WorkoutCard';
import { WorkoutDetailModal } from '../../components/workouts/WorkoutDetailModal';
import { WorkoutLoggerModal } from '../../components/workouts/WorkoutLoggerModal';
import { WorkoutCalendarView } from '../../components/workouts/WorkoutCalendarView';
import { Button, Select, ConfirmModal, EmptyState, CardSkeleton, Badge } from '../../components/ui';
import { Dumbbell, Plus, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { WORKOUT_TYPES, WORKOUT_MOODS } from '../../utils/constants';

export const WorkoutsPage = () => {
  const {
    workouts,
    pagination,
    isLoadingWorkouts,
    isLoggingWorkout,
    fetchWorkouts,
    createWorkout,
    deleteWorkout,
  } = useWorkoutStore();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [typeFilter, setTypeFilter] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingWorkout, setDeletingWorkout] = useState(null);

  const loadWorkouts = useCallback(() => {
    fetchWorkouts({
      page: currentPage,
      limit: 10,
      type: typeFilter || undefined,
      mood: moodFilter || undefined,
    });
  }, [fetchWorkouts, currentPage, typeFilter, moodFilter]);

  useEffect(() => {
    if (viewMode === 'list') {
      loadWorkouts();
    }
  }, [loadWorkouts, viewMode]);

  const handleLoggerSubmit = async (payload) => {
    const result = await createWorkout(payload);
    if (result) {
      setIsLoggerOpen(false);
      setEditingWorkout(null);
      loadWorkouts();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingWorkout) {
      const success = await deleteWorkout(deletingWorkout._id);
      if (success) {
        setIsDeleteOpen(false);
        setDeletingWorkout(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Workouts
              </h1>
              {pagination && (
                <Badge variant="emerald" size="sm">
                  {pagination.total} Logged
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Log training sessions, track volumes, and view calendar matrix
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center space-x-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Button variant="primary" iconLeft={Plus} onClick={() => setIsLoggerOpen(true)}>
            Log Workout
          </Button>
        </div>
      </div>

      {/* Main View Mode Content */}
      {viewMode === 'calendar' ? (
        <WorkoutCalendarView />
      ) : (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Select
                placeholder="All Workout Types"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={WORKOUT_TYPES}
                fullWidth={false}
                className="w-full sm:w-48"
              />
              <Select
                placeholder="All Moods"
                value={moodFilter}
                onChange={(e) => {
                  setMoodFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={WORKOUT_MOODS}
                fullWidth={false}
                className="w-full sm:w-44"
              />
            </div>

            {(typeFilter || moodFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTypeFilter('');
                  setMoodFilter('');
                  setCurrentPage(1);
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>

          {/* List Grid */}
          {isLoadingWorkouts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <EmptyState
              icon={Dumbbell}
              title="No workout entries found"
              description="Start tracking your workout routines by logging your first workout session."
              actionLabel="Log Workout"
              onAction={() => setIsLoggerOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout._id}
                  workout={workout}
                  onViewDetails={(item) => {
                    setSelectedWorkout(item);
                    setIsDetailOpen(true);
                  }}
                  onEdit={(item) => {
                    setEditingWorkout(item);
                    setIsLoggerOpen(true);
                  }}
                  onDelete={(item) => {
                    setDeletingWorkout(item);
                    setIsDeleteOpen(true);
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                Showing Page <span className="font-bold text-slate-200">{pagination.currentPage}</span> of{' '}
                <span className="font-bold text-slate-200">{pagination.totalPages}</span>
              </p>

              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft={ChevronLeft}
                  isDisabled={!pagination.hasPrevPage}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  iconRight={ChevronRight}
                  isDisabled={!pagination.hasNextPage}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <WorkoutLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => {
          setIsLoggerOpen(false);
          setEditingWorkout(null);
        }}
        onSubmit={handleLoggerSubmit}
        initialData={editingWorkout}
        isLoading={isLoggingWorkout}
      />

      <WorkoutDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedWorkout(null);
        }}
        workout={selectedWorkout}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingWorkout(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deletingWorkout?.name}"?`}
        message="Are you sure you want to permanently remove this workout session? Your stats and streak will be adjusted."
        confirmText="Delete Workout"
      />
    </div>
  );
};
