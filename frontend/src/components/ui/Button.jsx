import React from 'react';
import { Spinner } from './Spinner';

const variantClasses = {
  primary:
    'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/20 active:scale-[0.98]',
  secondary:
    'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-[0.98]',
  outline:
    'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-600 active:scale-[0.98]',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-950/40 border border-rose-500/20 active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium',
  md: 'px-4 py-2 text-sm rounded-xl gap-2 font-semibold',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5 font-semibold',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const disabledState = isDisabled || isLoading;

  return (
    <button
      type={type}
      disabled={disabledState}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.md} ${
        fullWidth ? 'w-full' : ''
      } ${
        disabledState ? 'opacity-50 cursor-not-allowed active:scale-100 pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} color={variant === 'primary' || variant === 'danger' ? 'white' : 'emerald'} />
      ) : (
        <>
          {IconLeft && <IconLeft className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
          <span>{children}</span>
          {IconRight && <IconRight className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
        </>
      )}
    </button>
  );
};
