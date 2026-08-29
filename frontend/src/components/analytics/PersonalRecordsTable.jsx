import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, EmptyState } from '../ui';
import { Trophy, Dumbbell, Calendar, Flame } from 'lucide-react';

export const PersonalRecordsTable = ({ personalRecords = [] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Personal Records (PRs)</CardTitle>
            <CardDescription>Highest weight & max reps recorded per exercise</CardDescription>
          </div>
        </div>
        <Badge variant="amber" size="sm">
          {personalRecords.length} Records
        </Badge>
      </CardHeader>

      <CardBody className="p-0">
        {personalRecords.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Trophy}
              title="No personal records recorded yet"
              description="Log strength workouts with sets and weights to unlock exercise PRs."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-6">Exercise</th>
                  <th className="py-3 px-6">Max Weight</th>
                  <th className="py-3 px-6">Max Reps</th>
                  <th className="py-3 px-6 text-right">Date Achieved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {personalRecords.map((pr, idx) => {
                  const dateStr = pr.achievedAt
                    ? new Date(pr.achievedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                          <Dumbbell className="w-3.5 h-3.5" />
                        </div>
                        <span>{pr._id || 'Exercise'}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-emerald-400 font-mono">
                          {pr.maxWeight ? `${pr.maxWeight} kg` : 'Bodyweight'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-200 font-mono">
                          {pr.maxReps || 0} reps
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right text-slate-400 font-medium">
                        <span className="flex items-center justify-end gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {dateStr}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
