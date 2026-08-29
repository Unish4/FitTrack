import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, EmptyState } from '../ui';
import { Target, ArrowRight, CheckCircle2, Clock, Trophy } from 'lucide-react';

export const ActiveGoalsWidget = ({ goalStats }) => {
  const totals = goalStats?.totals || { total: 0, active: 0, completed: 0, successRate: 0 };
  const upcomingDeadlines = goalStats?.upcomingDeadlines || [];
  const averageProgress = goalStats?.averageProgress || 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Fitness Goals</CardTitle>
          <CardDescription>Track target milestones & deadlines</CardDescription>
        </div>
        <Link
          to="/goals"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
        >
          Manage <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardBody className="flex-1 p-6 space-y-6">
        {/* Goal Summary Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xl font-black text-white">{totals.active}</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xl font-black text-emerald-400">{totals.completed}</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xl font-black text-amber-400">{totals.successRate}%</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Success Rate</p>
          </div>
        </div>

        {/* Average Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Overall Progress
            </span>
            <span className="text-emerald-400 font-bold">{averageProgress}%</span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, averageProgress))}%` }}
            />
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-3 pt-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Upcoming Deadlines
          </div>

          {upcomingDeadlines.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No upcoming goal deadlines"
              description="Create a new target goal to track your progression."
              actionLabel="Create Goal"
              onAction={() => {}}
            />
          ) : (
            <div className="space-y-2.5">
              {upcomingDeadlines.map((goal) => {
                const deadlineDate = new Date(goal.targetDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <div
                    key={goal._id}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <p className="font-bold text-slate-200 truncate">{goal.title}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> Due {deadlineDate}
                      </p>
                    </div>
                    <Badge variant="emerald" size="sm">
                      {goal.progressPercentage || 0}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
