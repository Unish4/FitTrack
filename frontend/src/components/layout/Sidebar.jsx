import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Activity,
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  Target,
  TrendingUp,
  User,
  ShieldAlert,
} from 'lucide-react';

export const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/workouts', label: 'Workouts', icon: Dumbbell },
  { path: '/exercises', label: 'Exercise Library', icon: BookOpen },
  { path: '/goals', label: 'Fitness Goals', icon: Target },
  { path: '/analytics', label: 'Analytics & PRs', icon: TrendingUp },
  { path: '/profile', label: 'Profile Settings', icon: User },
];

export const Sidebar = () => {
  const { user } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800/80 shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800/80">
        <img src="/logo.png" alt="FitTrack" className="w-9 h-9 rounded-xl shadow-md border border-slate-800" />
        <div>
          <span className="font-extrabold text-white text-xl tracking-tight">FitTrack</span>
          <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
            Fitness Platform
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/5 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 capitalize truncate flex items-center gap-1">
              {user?.role === 'admin' ? (
                <span className="text-purple-400 font-semibold flex items-center gap-0.5">
                  <ShieldAlert className="w-3 h-3" /> Admin
                </span>
              ) : (
                `${user?.fitnessProfile?.fitnessLevel || 'Beginner'} Level`
              )}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
