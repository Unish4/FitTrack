import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardBody, Badge } from '../../components/ui';
import { Activity, LogOut, ShieldCheck, User } from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Navbar Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FitTrack</h1>
              <p className="text-xs text-slate-400">Dashboard Initial Placeholder</p>
            </div>
          </div>

          <Button variant="secondary" size="sm" iconLeft={LogOut} onClick={logout}>
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Welcome back, {user?.name}!</CardTitle>
              <CardDescription>Authentication & Session State Active</CardDescription>
            </div>
            <Badge variant={user?.role === 'admin' ? 'purple' : 'emerald'} dot>
              {user?.role === 'admin' ? 'Admin' : 'Member'}
            </Badge>
          </CardHeader>

          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                  <User className="w-3.5 h-3.5" /> Email
                </div>
                <div className="text-slate-100 font-medium">{user?.email}</div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fitness Level
                </div>
                <div className="text-slate-100 font-medium capitalize">
                  {user?.fitnessProfile?.fitnessLevel || 'Beginner'}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
