import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'Unable to load content. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-xl border border-rose-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900">{title}</h3>
      <p className="mt-1 text-sm text-rose-700 max-w-sm">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon={RefreshCw}
            className="border-rose-300 text-rose-700 hover:bg-rose-50"
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
