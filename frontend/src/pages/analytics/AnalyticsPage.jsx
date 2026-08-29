import React, { useEffect, useState } from 'react';
import { useWorkoutStore } from '../../store/workoutStore';
import { StatCard } from '../../components/dashboard/StatCard';
import { WorkoutTrendsChart } from '../../components/analytics/WorkoutTrendsChart';
import { MuscleGroupDistributionChart } from '../../components/analytics/MuscleGroupDistributionChart';
import { WorkoutTypePieChart } from '../../components/analytics/WorkoutTypePieChart';
import { PersonalRecordsTable } from '../../components/analytics/PersonalRecordsTable';
import { CardSkeleton, Badge } from '../../components/ui';
import { TrendingUp, Dumbbell, Trophy, Clock, Flame } from 'lucide-react';

export const AnalyticsPage = () => {
  const {
    advancedStats,
    personalRecords,
    fetchAdvancedStats,
    fetchPersonalRecords,
  } = useWorkoutStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      await Promise.all([fetchAdvancedStats(), fetchPersonalRecords()]);
      setIsLoading(false);
    };
    loadAnalytics();
  }, [fetchAdvancedStats, fetchPersonalRecords]);

  const totals = advancedStats?.totals || {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
  };

  const volumeStats = advancedStats?.volume || { totalVolume: 0, maxWeight: 0 };
  const dailyTrend = advancedStats?.dailyTrend || [];
  const muscleGroups = advancedStats?.muscleGroups || [];
  const byType = advancedStats?.byType || [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-800 rounded-lg" />
            <div className="h-4 w-64 bg-slate-800 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Analytics & Personal Records
            </h1>
            <Badge variant="emerald" size="sm">
              Live Backend Analytics
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Performance charts, 30-day activity trends, muscle split, and exercise PRs
          </p>
        </div>
      </div>

      {/* Top Volume & Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Weight Lifted"
          value={volumeStats.totalVolume ? volumeStats.totalVolume.toLocaleString() : 0}
          unit="kg"
          subtitle="Cumulative strength training volume"
          icon={Dumbbell}
          variant="emerald"
        />
        <StatCard
          title="Heaviest Lift"
          value={volumeStats.maxWeight || 0}
          unit="kg"
          subtitle="Maximum weight recorded in sets"
          icon={Trophy}
          variant="amber"
        />
        <StatCard
          title="Total Training Time"
          value={totals.totalDuration || 0}
          unit="mins"
          subtitle="Logged across all sessions"
          icon={Clock}
          variant="indigo"
        />
        <StatCard
          title="Total Energy Burned"
          value={totals.totalCalories ? totals.totalCalories.toLocaleString() : 0}
          unit="kcal"
          subtitle="Calories burned"
          icon={Flame}
          variant="rose"
        />
      </div>

      {/* Charts Grid Row 1: 30-Day Activity & Muscle Group Split */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WorkoutTrendsChart dailyTrend={dailyTrend} />
        <MuscleGroupDistributionChart muscleGroups={muscleGroups} />
      </div>

      {/* Charts Grid Row 2: Workout Type Ratio & PR Leaderboard */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <WorkoutTypePieChart byType={byType} />
        </div>
        <div className="lg:col-span-7">
          <PersonalRecordsTable personalRecords={personalRecords} />
        </div>
      </div>
    </div>
  );
};
