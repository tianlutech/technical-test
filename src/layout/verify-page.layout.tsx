import React from 'react';
import { Spinner } from './spinner.layout';

export const VerifyPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4">
          <Spinner variant="dark" />
        </div>
        <p className="text-sm text-neutral-400">Signing you in...</p>
      </div>
    </div>
  );
};

