import React from 'react';
import { Button } from './button.layout';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">{title}</h1>
        <p className="text-sm text-neutral-500">{subtitle}</p>
      </div>
      {action && (
        <Button onClick={action.onClick}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {action.label}
          </span>
        </Button>
      )}
    </div>
  );
};

