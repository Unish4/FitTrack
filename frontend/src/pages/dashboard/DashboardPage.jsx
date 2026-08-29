import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWorkoutStore } from '../../store/workoutStore';
import { useGoalStore } from '../../store/goalStore';
import { StatCard } from '../../components/dashboard/StatCard';
import { StreakBanner } from '../../components/dashboard/StreakBanner';
import { RecentWorkoutsFeed } from '../../components/dashboard/RecentWorkoutsFeed';
import { ActiveGoalsWidget } from '../../components/dashboard/ActiveGoalsWidget';
import { AchievementsGrid } from '../../components/dashboard/AchievementsGrid';
import { Skeleton, CardSkeleton, Badge } from '../../components/ui';
import { Dumbbell, Clock, Flame, Activity, Zap } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { userStats, streakData, recentWorkouts, isLoadingDashboard, fetchDashboardData } = useWorkoutStore();
  const { goalStats, fetchGoalStats } = useGoalStore();

  useEffect(() => {
    fetchDashboardData();
    fetchGoalStats();
  }, [fetchDashboardData, fetchGoalStats]);

  const totals = userStats?.stats || {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    avgDuration: 0,
  };

  const currentStreak = userStats?.streak || streakData?.currentStreak || user?.streak || 0;
  const earnedAchievements = userStats?.achievements || user?.achievements || [];
  const last7DaysCount = userStats?.last7DaysWorkouts || 0;

  if (isLoadingDashboard) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton variant="text" className="w-48 h-8" />
            <Skeleton variant="text" className="w-64 h-4" />
          </div>
          <Skeleton variant="button" />
        </div>
        <Skeleton variant="card" className="h-32" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-7"><CardSkeleton /></div>
          <div className="md:col-span-5"><CardSkeleton /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <Badge variant="emerald" size="sm">
              {user?.fitnessProfile?.fitnessLevel || 'Beginner'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Here is your daily fitness summary and streak progression.
          </p>
        </div>
      </div>

      {/* Streak Banner */}
      <StreakBanner
        streak={currentStreak}
        totalWorkouts={userStats?.totalWorkouts || totals.totalWorkouts || 0}
        recentWorkoutDates={streakData?.recentWorkoutDates || []}
      />

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Workouts"
          value={totals.totalWorkouts || 0}
          unit="sessions"
          subtitle={`${last7DaysCount} completed in last 7 days`}
          icon={Dumbbell}
          variant="emerald"
        />
        <StatCard
          title="Total Time"
          value={totals.totalDuration ? Math.round(totals.totalDuration) : 0}
          unit="mins"
          subtitle={`Avg ${Math.round(totals.avgDuration || 0)} min per workout`}
          icon={Clock}
          variant="indigo"
        />
        <StatCard
          title="Calories Burned"
          value={totals.totalCalories ? Math.round(totals.totalCalories) : 0}
          unit="kcal"
          subtitle="Estimated total energy burned"
          icon={Flame}
          variant="amber"
        />
        <StatCard
          title="Avg Session"
          value={totals.avgDuration ? Math.round(totals.avgDuration) : 0}
          unit="mins"
          subtitle="Average workout duration"
          icon={Activity}
          variant="purple"
        />
      </div>

      {/* Main Grid: Workouts Feed & Active Goals */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <RecentWorkoutsFeed workouts={recentWorkouts} />
        </div>
        <div className="md:col-span-5">
          <ActiveGoalsWidget goalStats={goalStats} />
        </div>
      </div>

      {/* Achievements Grid */}
      <AchievementsGrid earnedAchievements={earnedAchievements} />
    </div>
  );
};
