import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = 'Loading...', size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        className={`${sizes[size] || sizes.md} animate-spin text-brand-600`}
      />
      {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex justify-center items-center">{content}</div>;
};

export default Loader;
