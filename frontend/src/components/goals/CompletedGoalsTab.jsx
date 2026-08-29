import React, { useEffect } from 'react';
import { useGoalStore } from '../../store/goalStore';
import { Card, Badge, EmptyState, CardSkeleton } from '../ui';
import { Trophy, CheckCircle2, Calendar } from 'lucide-react';

export const CompletedGoalsTab = () => {
  const { completedGoals, fetchCompletedGoals, isLoadingGoals } = useGoalStore();

  useEffect(() => {
    fetchCompletedGoals();
  }, [fetchCompletedGoals]);

  if (isLoadingGoals) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (completedGoals.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No completed goals yet"
        description="Keep working towards your active goals. Once you reach 100% progress, your achievements will show up here!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {completedGoals.map((goal) => {
        const completedDate = new Date(goal.updatedAt || goal.completedAt || new Date()).toLocaleDateString(
          'en-US',
          { month: 'short', day: 'numeric', year: 'numeric' }
        );

        return (
          <Card
            key={goal._id}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/20 border-purple-500/30 p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Badge variant="purple" size="sm">
                  {goal.type}
                </Badge>
                <h3 className="text-base font-extrabold text-white pt-1">{goal.title}</h3>
                <p className="text-xs text-emerald-400 font-bold">
                  Target Achieved: {goal.targetValue} {goal.unit}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
                <Trophy className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> {completedDate}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
