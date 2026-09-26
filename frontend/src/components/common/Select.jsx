import React, { forwardRef } from 'react';

const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      options = [],
      placeholder = 'Select an option',
      className = '',
      required = false,
      ...props
    },
    ref
  ) => {
    const selectId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          name={name}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 transition-all duration-150 hover:border-slate-400 focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/20'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
        </select>
        {error ? (
          <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
