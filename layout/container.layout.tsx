import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}
