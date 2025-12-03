import React from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "number" | "password";
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  error,
  disabled = false,
  fullWidth = true,
  autoFocus = false,
  onKeyDown,
}: InputProps) {
  const inputId = React.useId();

  const baseStyles =
    "block rounded-xl border bg-[#2a3142] px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-[#1a1f2c]";
  const normalStyles =
    "border-[#333a4a] focus:border-[#1eadee] focus:ring-[#1eadee]/30 hover:border-[#444c5c]";
  const errorStyles =
    "border-red-500 focus:border-red-500 focus:ring-red-500/30";
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <div className={widthStyles}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        className={`${baseStyles} ${
          error ? errorStyles : normalStyles
        } ${widthStyles}`}
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  fullWidth?: boolean;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  rows = 3,
  fullWidth = true,
}: TextAreaProps) {
  const inputId = React.useId();

  const baseStyles =
    "block rounded-xl border bg-[#2a3142] px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-[#1a1f2c] resize-none";
  const normalStyles =
    "border-[#333a4a] focus:border-[#1eadee] focus:ring-[#1eadee]/30 hover:border-[#444c5c]";
  const errorStyles =
    "border-red-500 focus:border-red-500 focus:ring-red-500/30";
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <div className={widthStyles}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`${baseStyles} ${
          error ? errorStyles : normalStyles
        } ${widthStyles}`}
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
