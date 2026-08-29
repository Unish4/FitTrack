import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../ui';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

const achievementDefinitions = [
  { name: 'First Workout', description: 'Log your first workout session', icon: '🥇' },
  { name: '10 Workouts', description: 'Complete 10 workouts', icon: '🏆' },
  { name: '50 Workouts', description: 'Complete 50 workouts', icon: '🔥' },
  { name: '100 Workouts', description: 'Complete 100 workouts', icon: '👑' },
  { name: '7-Day Streak', description: 'Workout 7 days in a row', icon: '⚡' },
  { name: '30-Day Streak', description: 'Workout 30 days in a row', icon: '💎' },
];

export const AchievementsGrid = ({ earnedAchievements = [] }) => {
  const earnedMap = new Map(
    earnedAchievements.map((a) => [a.name, a.earnedAt || new Date()])
  );

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Achievements & Milestones</CardTitle>
          <CardDescription>Badges earned through consistent training</CardDescription>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>{earnedAchievements.length} / {achievementDefinitions.length} Unlocked</span>
        </div>
      </CardHeader>

      <CardBody className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {achievementDefinitions.map((def) => {
            const isUnlocked = earnedMap.has(def.name);
            const earnedDate = isUnlocked
              ? new Date(earnedMap.get(def.name)).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : null;

            return (
              <div
                key={def.name}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center space-y-2 relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-purple-500/10 via-slate-900 to-slate-900 border-purple-500/30 shadow-lg shadow-purple-950/20'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                }`}
              >
                {isUnlocked ? (
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl shadow-md">
                    {def.icon}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-0.5 min-w-0 w-full">
                  <p className={`text-xs font-bold truncate ${isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                    {def.name}
                  </p>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    {def.description}
                  </p>
                </div>

                {isUnlocked && (
                  <span className="text-[9px] font-semibold text-purple-300 flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Unlocked {earnedDate}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
