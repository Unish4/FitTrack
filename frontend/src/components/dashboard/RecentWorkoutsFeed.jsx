import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, EmptyState } from '../ui';
import { Dumbbell, Clock, Flame, Calendar, ArrowRight } from 'lucide-react';
import { WORKOUT_MOODS } from '../../utils/constants';

export const RecentWorkoutsFeed = ({ workouts = [] }) => {
  const getMoodEmoji = (moodValue) => {
    const found = WORKOUT_MOODS.find((m) => m.value === moodValue);
    return found ? found.emoji : '💪';
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your latest logged workout sessions</CardDescription>
        </div>
        <Link
          to="/workouts"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardBody className="flex-1 p-4">
        {workouts.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="No workouts logged yet"
            description="Log your first workout session to track your volume, calories, and duration."
            actionLabel="Go to Workouts"
            onAction={() => {}}
          />
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => {
              const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={workout._id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
                      {getMoodEmoji(workout.mood)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-100 truncate">
                        {workout.name}
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {workout.duration} min
                        </span>
                        {workout.caloriesBurned > 0 && (
                          <span className="flex items-center gap-1 text-amber-400 font-semibold">
                            <Flame className="w-3 h-3" />
                            {workout.caloriesBurned} kcal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Badge variant={workout.type === 'cardio' ? 'sky' : workout.type === 'strength' ? 'emerald' : 'purple'} size="sm">
                    {workout.type}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
