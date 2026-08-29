import React from 'react';

const variantClasses = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  sky: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  neutral: 'bg-slate-800 text-slate-300 border-slate-700',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge = ({
  children,
  variant = 'emerald',
  size = 'md',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${
        variantClasses[variant] || variantClasses.emerald
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
};
