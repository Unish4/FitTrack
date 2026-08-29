import React, { forwardRef } from 'react';

export const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      fullWidth = true,
      className = '',
      id,
      placeholder = 'Select an option',
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full bg-slate-900/90 text-slate-100 text-sm rounded-xl border px-3.5 py-2.5 transition-all focus:outline-none focus:ring-2 appearance-none bg-[url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")] bg-[length:10px_10px] bg-[right_14px_center] bg-no-repeat ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled className="text-slate-500 bg-slate-900">{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value} className="bg-slate-900 text-slate-100">
                {label}
              </option>
            );
          })}
        </select>
        {error && <p className="text-xs text-rose-400 font-medium pl-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-400 pl-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
