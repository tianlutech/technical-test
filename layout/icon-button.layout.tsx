import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "default" | "danger";
}

export default function IconButton({
  icon,
  variant = "default",
  className = "",
  ...props
}: IconButtonProps) {
  const variantStyles = {
    default: "text-gray-600 hover:text-gray-900",
    danger: "text-red-600 hover:text-red-700",
  };

  return (
    <button
      className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
