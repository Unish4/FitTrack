import React from 'react';

export const Skeleton = ({ className = '', variant = 'text', count = 1 }) => {
  const baseClasses = 'animate-pulse bg-slate-800/80 rounded-xl';

  const variantMap = {
    text: 'h-4 w-full rounded-md',
    avatar: 'w-10 h-10 rounded-full',
    card: 'h-32 w-full rounded-2xl',
    button: 'h-10 w-24 rounded-xl',
    circle: 'rounded-full',
  };

  const skeletonClass = `${baseClasses} ${variantMap[variant] || ''} ${className}`;

  if (count > 1) {
    return (
      <div className="space-y-2.5 w-full">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={skeletonClass} />
        ))}
      </div>
    );
  }

  return <div className={skeletonClass} />;
};

export const CardSkeleton = () => (
  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 animate-pulse">
    <div className="flex items-center space-x-3">
      <Skeleton variant="circle" className="w-10 h-10" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/4" />
      </div>
    </div>
    <Skeleton variant="text" className="w-full" />
    <Skeleton variant="text" className="w-5/6" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton variant="button" />
      <Skeleton variant="text" className="w-16" />
    </div>
  </div>
);
