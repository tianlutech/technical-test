import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-[#e5e5e5] rounded-xl ${className}`}>
      {children}
    </div>
  );
};
