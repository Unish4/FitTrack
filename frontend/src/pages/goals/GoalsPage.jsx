import React, { useEffect, useState, useCallback } from 'react';
import { useGoalStore } from '../../store/goalStore';
import { GoalCard } from '../../components/goals/GoalCard';
import { GoalFormModal } from '../../components/goals/GoalFormModal';
import { GoalProgressModal } from '../../components/goals/GoalProgressModal';
import { CompletedGoalsTab } from '../../components/goals/CompletedGoalsTab';
import { Button, Select, ConfirmModal, EmptyState, CardSkeleton, Badge } from '../../components/ui';
import { Target, Plus, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { GOAL_TYPES } from '../../utils/constants';

export const GoalsPage = () => {
  const {
    goals,
    pagination,
    goalStats,
    isLoadingGoals,
    isCreatingGoal,
    fetchGoals,
    fetchGoalStats,
    createGoal,
    updateGoalProgress,
    abandonGoal,
    deleteGoal,
  } = useGoalStore();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed' | 'abandoned'
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progressGoal, setProgressGoal] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [isAbandonOpen, setIsAbandonOpen] = useState(false);
  const [abandoningGoal, setAbandoningGoal] = useState(null);

  const loadData = useCallback(() => {
    fetchGoalStats();
    if (activeTab !== 'completed') {
      fetchGoals({
        page: currentPage,
        limit: 9,
        status: activeTab,
        type: typeFilter || undefined,
      });
    }
  }, [fetchGoals, fetchGoalStats, currentPage, activeTab, typeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFormSubmit = async (payload) => {
    const result = await createGoal(payload);
    if (result) {
      setIsFormOpen(false);
      setEditingGoal(null);
      loadData();
    }
  };

  const handleProgressSubmit = async (id, payload) => {
    const result = await updateGoalProgress(id, payload);
    if (result) {
      setIsProgressOpen(false);
      setProgressGoal(null);
      loadData();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingGoal) {
      const success = await deleteGoal(deletingGoal._id);
      if (success) {
        setIsDeleteOpen(false);
        setDeletingGoal(null);
        loadData();
      }
    }
  };

  const handleAbandonConfirm = async () => {
    if (abandoningGoal) {
      const success = await abandonGoal(abandoningGoal._id);
      if (success) {
        setIsAbandonOpen(false);
        setAbandoningGoal(null);
        loadData();
      }
    }
  };

  const totals = goalStats?.totals || { total: 0, active: 0, completed: 0, successRate: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Fitness Goals
              </h1>
              <Badge variant="emerald" size="sm">
                {totals.active} Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Set target milestones, log progression, and achieve fitness goals
            </p>
          </div>
        </div>

        <Button variant="primary" iconLeft={Plus} onClick={() => setIsFormOpen(true)}>
          Create Goal
        </Button>
      </div>

      {/* Tabs & Type Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('active');
              setCurrentPage(1);
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'active'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({totals.active || 0})
          </button>
          <button
            onClick={() => {
              setActiveTab('completed');
              setCurrentPage(1);
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'completed'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed ({totals.completed || 0})
          </button>
          <button
            onClick={() => {
              setActiveTab('abandoned');
              setCurrentPage(1);
            }}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'abandoned'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Abandoned ({totals.abandoned || 0})
          </button>
        </div>

        {/* Type Filter */}
        {activeTab !== 'completed' && (
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Select
              placeholder="All Goal Types"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={GOAL_TYPES}
              fullWidth={false}
              className="w-full sm:w-48"
            />
            {typeFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTypeFilter('');
                  setCurrentPage(1);
                }}
              >
                Reset
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Tab View */}
      {activeTab === 'completed' ? (
        <CompletedGoalsTab />
      ) : (
        <div className="space-y-6">
          {isLoadingGoals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : goals.length === 0 ? (
            <EmptyState
              icon={Target}
              title={`No ${activeTab} goals found`}
              description="Create a new goal to track your fitness milestones."
              actionLabel="Create Goal"
              onAction={() => setIsFormOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onUpdateProgress={(item) => {
                    setProgressGoal(item);
                    setIsProgressOpen(true);
                  }}
                  onEdit={(item) => {
                    setEditingGoal(item);
                    setIsFormOpen(true);
                  }}
                  onAbandon={(item) => {
                    setAbandoningGoal(item);
                    setIsAbandonOpen(true);
                  }}
                  onDelete={(item) => {
                    setDeletingGoal(item);
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
                  isDisabled={!pagination.hasNextPage}
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
      <GoalFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingGoal}
        isLoading={isCreatingGoal}
      />

      <GoalProgressModal
        isOpen={isProgressOpen}
        onClose={() => {
          setIsProgressOpen(false);
          setProgressGoal(null);
        }}
        onSubmit={handleProgressSubmit}
        goal={progressGoal}
        isLoading={isLoadingGoals}
      />

      <ConfirmModal
        isOpen={isAbandonOpen}
        onClose={() => {
          setIsAbandonOpen(false);
          setAbandoningGoal(null);
        }}
        onConfirm={handleAbandonConfirm}
        title={`Abandon "${abandoningGoal?.title}"?`}
        message="Marking this goal as abandoned will freeze its status. You can view it in the Abandoned tab."
        confirmText="Abandon Goal"
        variant="danger"
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingGoal(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deletingGoal?.title}"?`}
        message="Are you sure you want to permanently delete this fitness goal?"
        confirmText="Delete Goal"
      />
    </div>
  );
};
