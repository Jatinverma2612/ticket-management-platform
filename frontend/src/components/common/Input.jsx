import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      type = 'text',
      className = '',
      icon: Icon,
      rightElement,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-xs">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 ${
              Icon ? 'pl-10' : ''
            } ${rightElement ? 'pr-10' : ''} ${
              error
                ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
