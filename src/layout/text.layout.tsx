import React from 'react';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  className = '',
}) => {
  const variantStyles = {
    h1: 'text-4xl font-bold text-gray-900',
    h2: 'text-3xl font-bold text-gray-900',
    h3: 'text-2xl font-semibold text-gray-900',
    body: 'text-base text-gray-700',
    small: 'text-sm text-gray-600',
    caption: 'text-xs text-gray-500',
  };

  const Tag = variant.startsWith('h') ? (variant as 'h1' | 'h2' | 'h3') : 'p';

  return (
    <Tag className={`${variantStyles[variant]} ${className}`}>
      {children}
    </Tag>
  );
};

