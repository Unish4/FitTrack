import React from 'react';
import { Card, Badge, Button } from '../ui';
import { Target, Calendar, Plus, Trophy, Edit, Trash2, Ban } from 'lucide-react';
import { GOAL_TYPES } from '../../utils/constants';

const typeVariants = {
  weight_loss: 'emerald',
  muscle_gain: 'indigo',
  endurance: 'sky',
  strength: 'purple',
  flexibility: 'amber',
  workout_count: 'rose',
  custom: 'neutral',
};

const statusVariants = {
  active: 'emerald',
  completed: 'purple',
  abandoned: 'rose',
};

export const GoalCard = ({
  goal,
  onUpdateProgress,
  onEdit,
  onAbandon,
  onDelete,
}) => {
  const percentage = goal.targetValue > 0
    ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
    : 0;

  const getTypeName = (typeVal) => {
    const found = GOAL_TYPES.find((t) => t.value === typeVal);
    return found ? found.label : typeVal;
  };

  const targetDateStr = goal.targetDate
    ? new Date(goal.targetDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Calculate days remaining
  let daysRemaining = null;
  if (goal.targetDate && goal.status === 'active') {
    const diff = new Date(goal.targetDate).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  }

  return (
    <Card hoverable className="flex flex-col h-full group">
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Badge variant={typeVariants[goal.type] || 'emerald'} size="sm">
                  {getTypeName(goal.type)}
                </Badge>
                <Badge variant={statusVariants[goal.status] || 'neutral'} size="sm" dot={goal.status === 'active'}>
                  {goal.status}
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors truncate pt-1">
                {goal.title}
              </h3>
            </div>

            {goal.status === 'completed' && (
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-md shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Progress Bar & Value */}
          <div className="space-y-2 pt-1">
            <div className="flex items-baseline justify-between text-xs font-semibold">
              <span className="text-slate-400">
                Progress: <strong className="text-slate-100 font-bold">{goal.currentValue}</strong> / {goal.targetValue} {goal.unit}
              </span>
              <span className={`font-bold ${percentage >= 100 ? 'text-purple-400' : 'text-emerald-400'}`}>
                {percentage}%
              </span>
            </div>

            <div className="h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  goal.status === 'completed'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    : goal.status === 'abandoned'
                    ? 'bg-rose-500/50'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Target Date & Status Info */}
        <div className="space-y-3">
          {targetDateStr && (
            <div className="flex items-center justify-between text-xs text-slate-400 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Target: {targetDateStr}
              </span>
              {daysRemaining !== null && (
                <span className={`font-bold ${daysRemaining <= 3 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {daysRemaining} days left
                </span>
              )}
            </div>
          )}

          {/* Card Footer Actions */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(goal)}
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Edit Goal"
              >
                <Edit className="w-4 h-4" />
              </button>

              {goal.status === 'active' && (
                <button
                  onClick={() => onAbandon(goal)}
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Abandon Goal"
                >
                  <Ban className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onDelete(goal)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Delete Goal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {goal.status === 'active' && (
              <Button
                variant="primary"
                size="sm"
                iconLeft={Plus}
                onClick={() => onUpdateProgress(goal)}
              >
                Update Progress
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
