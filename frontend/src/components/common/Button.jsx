import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-brand-600 hover:bg-brand-700 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-800 focus:ring-brand-500',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-transparent hover:border-slate-300 focus:ring-slate-400 active:bg-slate-300',
    outline:
      'border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 shadow-xs hover:shadow-sm focus:ring-brand-500 active:bg-slate-100',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:bg-rose-800 focus:ring-rose-500',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300 active:bg-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
