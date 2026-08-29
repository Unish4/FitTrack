import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mb-6 shadow-2xl">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mt-2 mb-8 leading-relaxed">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" iconLeft={ArrowLeft}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
