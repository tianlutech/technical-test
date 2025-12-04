import React from "react";

interface TextProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "body" | "label" | "error";
  className?: string;
}

export default function Text({ children, variant = "body", className = "" }: TextProps) {
  const variantStyles = {
    h1: "text-3xl font-bold text-gray-900",
    h2: "text-xl font-semibold text-gray-900",
    body: "text-base text-gray-700",
    label: "text-sm font-medium text-gray-700",
    error: "text-sm text-red-600",
  };

  return <p className={`${variantStyles[variant]} ${className}`}>{children}</p>;
}
