import React from "react";

interface TextProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "label";
  color?:
    | "primary"
    | "secondary"
    | "muted"
    | "error"
    | "success"
    | "accent"
    | "accent-blue";
  align?: "left" | "center" | "right";
  gradient?: boolean;
}

export function Text({
  children,
  variant = "body",
  color = "primary",
  align = "left",
  gradient = false,
}: TextProps) {
  const variantStyles = {
    h1: "text-3xl font-bold tracking-tight",
    h2: "text-2xl font-semibold tracking-tight",
    h3: "text-lg font-semibold",
    body: "text-base",
    caption: "text-sm",
    label: "text-sm font-medium",
  };

  const colorStyles = {
    primary: "text-white",
    secondary: "text-gray-300",
    muted: "text-gray-400",
    error: "text-red-400",
    success: "text-green-400",
    accent: "text-[#f6941e]",
    "accent-blue": "text-[#1eadee]",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const gradientStyles = gradient
    ? "bg-gradient-to-r from-[#f6941e] to-[#1eadee] bg-clip-text text-transparent"
    : "";

  const Component =
    variant === "h1"
      ? "h1"
      : variant === "h2"
      ? "h2"
      : variant === "h3"
      ? "h3"
      : "p";

  return (
    <Component
      className={`${variantStyles[variant]} ${
        gradient ? gradientStyles : colorStyles[color]
      } ${alignStyles[align]}`}
    >
      {children}
    </Component>
  );
}
