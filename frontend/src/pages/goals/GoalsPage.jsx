import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../../components/ui';
import { Target } from 'lucide-react';

export const GoalsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Fitness Goals</h1>
          <p className="text-xs text-slate-400">Set targets and track fitness milestones</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal Management</CardTitle>
          <CardDescription>Phase 7 feature coming soon</CardDescription>
        </CardHeader>
        <CardBody className="text-sm text-slate-300">
          Fitness goals module placeholder.
        </CardBody>
      </Card>
    </div>
  );
};
