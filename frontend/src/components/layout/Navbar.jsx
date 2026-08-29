import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button, Badge } from '../ui';
import {
  Flame,
  User,
  LogOut,
  ChevronDown,
  Plus,
  Shield,
} from 'lucide-react';

export const Navbar = ({ onOpenWorkoutModal }) => {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'FT';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Mobile Logo Brand */}
      <div className="flex items-center space-x-3 md:hidden">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src="/logo.png" alt="FitTrack" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-white text-lg tracking-tight">FitTrack</span>
        </Link>
      </div>

      {/* Desktop Breadcrumb/Greeting */}
      <div className="hidden md:flex items-center space-x-2">
        <span className="text-xs text-slate-400 font-medium">Welcome back,</span>
        <span className="text-sm font-bold text-slate-100">{user?.name}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 ml-auto">
        {/* Streak Counter Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold shadow-sm">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce-short" />
          <span>{user?.streak || 0} Day Streak</span>
        </div>

        {/* Quick Add Workout Button */}
        {onOpenWorkoutModal && (
          <Button
            variant="primary"
            size="sm"
            iconLeft={Plus}
            onClick={onOpenWorkoutModal}
            className="hidden sm:inline-flex"
          >
            Log Workout
          </Button>
        )}

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all focus:outline-none"
          >
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {getInitials(user?.name)}
              </div>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu Overlay */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-800/80">
                <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Badge variant={user?.role === 'admin' ? 'purple' : 'emerald'} size="sm">
                    {user?.role === 'admin' ? (
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Admin</span>
                    ) : (
                      'Member'
                    )}
                  </Badge>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Profile & Fitness Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
