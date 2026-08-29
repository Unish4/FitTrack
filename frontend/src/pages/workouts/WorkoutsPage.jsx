import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../../components/ui';
import { Dumbbell } from 'lucide-react';

export const WorkoutsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Dumbbell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Workouts</h1>
          <p className="text-xs text-slate-400">Track and manage your workout logs</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout History & Management</CardTitle>
          <CardDescription>Phase 6 feature coming next</CardDescription>
        </CardHeader>
        <CardBody className="text-sm text-slate-300">
          Workouts management module placeholder.
        </CardBody>
      </Card>
    </div>
  );
};
