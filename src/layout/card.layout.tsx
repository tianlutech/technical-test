import React from "react";

interface CardProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  animated?: boolean;
}

export function Card({
  children,
  padding = "md",
  shadow = "md",
  animated = true,
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-lg shadow-black/20",
    lg: "shadow-xl shadow-black/30",
  };

  const animationStyles = animated ? "animate-scale-in" : "";

  return (
    <div
      className={`bg-[#242938] rounded-2xl border border-[#333a4a] ${paddingStyles[padding]} ${shadowStyles[shadow]} ${animationStyles} transition-all duration-300 hover:border-[#f6941e]/30`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className="border-b border-[#333a4a] pb-4 mb-4">{children}</div>;
}

interface CardBodyProps {
  children: React.ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return <div>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="border-t border-[#333a4a] pt-4 mt-4">{children}</div>;
}

interface DraggableCardProps {
  children: React.ReactNode;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export function DraggableCard({
  children,
  isDragging = false,
  onDragStart,
  onDragOver,
  onDragEnd,
}: DraggableCardProps) {
  const opacityStyles = isDragging ? "opacity-50 scale-105" : "";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`bg-[#242938] rounded-2xl border border-[#333a4a] p-5 shadow-lg shadow-black/20 transition-all duration-300 cursor-grab active:cursor-grabbing hover:border-[#1eadee]/50 hover:shadow-[#1eadee]/10 hover:shadow-xl ${opacityStyles} animate-fade-in`}
    >
      {children}
    </div>
  );
}
