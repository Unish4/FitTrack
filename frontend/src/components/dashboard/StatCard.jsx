import React from 'react';
import { Card } from '../ui/Card';

const variantMap = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    iconText: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    iconText: 'text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    iconText: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    iconText: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    iconText: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
};

export const StatCard = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  variant = 'emerald',
}) => {
  const styles = variantMap[variant] || variantMap.emerald;

  return (
    <Card className="p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-white tracking-tight">
              {value !== undefined && value !== null ? value : '0'}
            </span>
            {unit && <span className="text-xs font-bold text-slate-400">{unit}</span>}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium pt-0.5">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-2xl ${styles.bg} border ${styles.border} flex items-center justify-center ${styles.iconText} shadow-md shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
};
