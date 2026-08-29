import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      iconLeft: IconLeft,
      iconRight: IconRight,
      fullWidth = true,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {IconLeft && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <IconLeft className="w-4 h-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`w-full bg-slate-900/90 text-slate-100 text-sm rounded-xl border transition-all placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
              IconLeft ? 'pl-10' : 'pl-3.5'
            } ${IconRight ? 'pr-10' : 'pr-3.5'} py-2.5 ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
                : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
            } ${className}`}
            {...props}
          />
          {IconRight && (
            <div className="absolute right-3.5 text-slate-400">
              <IconRight className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-400 font-medium pl-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-400 pl-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
