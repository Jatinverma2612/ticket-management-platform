import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-slate-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
