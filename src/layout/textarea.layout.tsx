import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#0d0d0d] mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-white border border-[#e5e5e5] rounded-lg text-[#0d0d0d] placeholder-[#8e8e8e] focus:outline-none focus:border-[#0d0d0d] transition-colors resize-none ${
          error ? 'border-red-500 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
