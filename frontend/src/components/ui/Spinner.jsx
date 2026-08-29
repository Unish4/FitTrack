import React from 'react';

const sizeMap = {
  sm: 'w-4 h-4 text-xs',
  md: 'w-6 h-6 text-sm',
  lg: 'w-8 h-8 text-base',
  xl: 'w-12 h-12 text-lg',
};

const colorMap = {
  emerald: 'border-emerald-500 border-t-transparent',
  indigo: 'border-indigo-500 border-t-transparent',
  slate: 'border-slate-400 border-t-transparent',
  white: 'border-white border-t-transparent',
};

export const Spinner = ({ size = 'md', color = 'emerald', className = '' }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.emerald;

  return (
    <div
      role="status"
      className={`inline-block rounded-full border-2 animate-spin ${sizeClass} ${colorClass} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
