import React from 'react';
import { Spinner } from './spinner.layout';

interface PageLoaderProps {
  variant?: 'light' | 'dark';
}

export const PageLoader: React.FC<PageLoaderProps> = ({ variant = 'light' }) => {
  const bg = variant === 'dark' ? 'bg-neutral-950' : 'bg-white';
  
  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center`}>
      <Spinner variant={variant} />
    </div>
  );
};

