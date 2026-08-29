import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useExerciseStore } from '../../store/exerciseStore';
import { ExerciseCard } from '../../components/exercises/ExerciseCard';
import { ExerciseFilterBar } from '../../components/exercises/ExerciseFilterBar';
import { ExerciseDetailModal } from '../../components/exercises/ExerciseDetailModal';
import { ExerciseFormModal } from '../../components/exercises/ExerciseFormModal';
import { ImageUploadModal } from '../../components/exercises/ImageUploadModal';
import { Button, ConfirmModal, EmptyState, CardSkeleton, Badge } from '../../components/ui';
import { BookOpen, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export const ExercisesPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const {
    exercises,
    pagination,
    isLoading,
    isSubmitting,
    fetchExercises,
    searchExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    uploadExerciseImage,
  } = useExerciseStore();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals State
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingExercise, setDeletingExercise] = useState(null);

  const loadData = useCallback(() => {
    if (searchQuery.trim()) {
      searchExercises({
        q: searchQuery.trim(),
        category: categoryFilter || undefined,
        muscleGroup: muscleGroupFilter || undefined,
        difficulty: difficultyFilter || undefined,
      });
    } else {
      fetchExercises({
        page: currentPage,
        limit: 12,
        category: categoryFilter || undefined,
        muscleGroup: muscleGroupFilter || undefined,
        difficulty: difficultyFilter || undefined,
      });
    }
  }, [
    searchQuery,
    categoryFilter,
    muscleGroupFilter,
    difficultyFilter,
    currentPage,
    fetchExercises,
    searchExercises,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setMuscleGroupFilter('');
    setDifficultyFilter('');
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingExercise(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (exercise) => {
    setEditingExercise(exercise);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    let result;
    if (editingExercise) {
      result = await updateExercise(editingExercise._id, payload);
    } else {
      result = await createExercise(payload);
    }
    if (result) {
      setIsFormOpen(false);
      setEditingExercise(null);
    }
  };

  const handleOpenUpload = (exercise) => {
    setUploadTarget(exercise);
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = async (id, formData) => {
    const result = await uploadExerciseImage(id, formData);
    if (result) {
      setIsUploadOpen(false);
      setUploadTarget(null);
    }
  };

  const handleOpenDelete = (exercise) => {
    setDeletingExercise(exercise);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingExercise) {
      const success = await deleteExercise(deletingExercise._id);
      if (success) {
        setIsDeleteOpen(false);
        setDeletingExercise(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Exercise Library
              </h1>
              {pagination && (
                <Badge variant="emerald" size="sm">
                  {pagination.total} Total
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Browse exercise techniques, target muscle groups, and instruction guides
            </p>
          </div>
        </div>

        {isAdmin && (
          <Button variant="primary" iconLeft={Plus} onClick={handleOpenCreate}>
            Create Exercise
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <ExerciseFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        muscleGroupFilter={muscleGroupFilter}
        onMuscleGroupChange={setMuscleGroupFilter}
        difficultyFilter={difficultyFilter}
        onDifficultyChange={setDifficultyFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Exercises Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No exercises found"
          description="Try clearing your filters or search terms to find relevant exercises."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise._id}
              exercise={exercise}
              isAdmin={isAdmin}
              onViewDetails={(item) => {
                setSelectedExercise(item);
                setIsDetailOpen(true);
              }}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onUploadImage={handleOpenUpload}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && !searchQuery && (
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

      {/* Modals */}
      <ExerciseDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedExercise(null);
        }}
        exercise={selectedExercise}
      />

      {isAdmin && (
        <>
          <ExerciseFormModal
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingExercise(null);
            }}
            onSubmit={handleFormSubmit}
            initialData={editingExercise}
            isLoading={isSubmitting}
          />

          <ImageUploadModal
            isOpen={isUploadOpen}
            onClose={() => {
              setIsUploadOpen(false);
              setUploadTarget(null);
            }}
            onUpload={handleUploadSubmit}
            exercise={uploadTarget}
            isLoading={isSubmitting}
          />

          <ConfirmModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setDeletingExercise(null);
            }}
            onConfirm={handleDeleteConfirm}
            title={`Delete "${deletingExercise?.name}"?`}
            message="Are you sure you want to permanently delete this exercise from the library?"
            confirmText="Delete Exercise"
          />
        </>
      )}
    </div>
  );
};
