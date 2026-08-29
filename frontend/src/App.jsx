import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FitTrack</h1>
            <p className="text-sm text-slate-400">Foundation Ready</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <span className="flex items-center gap-2 text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" /> State & Routing
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Installed</span>
          </div>

          <div className="flex items-center justify-between text-sm p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <span className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Centralized API Layer
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Configured</span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800">
          FitTrack Frontend — Phase 0 Foundation
        </div>
      </div>
    </div>
  );
}

export default App;
