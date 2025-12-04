import React from 'react';

interface SpinnerProps {
  variant?: 'light' | 'dark';
}

export const Spinner: React.FC<SpinnerProps> = ({ variant = 'light' }) => {
  const colors = variant === 'dark' 
    ? 'border-neutral-700 border-t-white' 
    : 'border-neutral-300 border-t-neutral-900';
  
  return <div className={`w-5 h-5 border-2 ${colors} rounded-full animate-spin`} />;
};

