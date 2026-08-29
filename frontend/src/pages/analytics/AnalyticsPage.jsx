import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../../components/ui';
import { TrendingUp } from 'lucide-react';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Analytics & PRs</h1>
          <p className="text-xs text-slate-400">Personal records, trends, and progress charts</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Phase 8 feature coming soon</CardDescription>
        </CardHeader>
        <CardBody className="text-sm text-slate-300">
          Analytics dashboard module placeholder.
        </CardBody>
      </Card>
    </div>
  );
};
