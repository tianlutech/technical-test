import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  centered?: boolean;
  padding?: boolean;
}

export function Container({
  children,
  size = "lg",
  centered = true,
  padding = true,
}: ContainerProps) {
  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  const centeredStyles = centered ? "mx-auto" : "";
  const paddingStyles = padding ? "px-4 sm:px-6 lg:px-8" : "";

  return (
    <div className={`${sizeStyles[size]} ${centeredStyles} ${paddingStyles}`}>
      {children}
    </div>
  );
}

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return <div className="min-h-screen bg-[#1a1f2c]">{children}</div>;
}

interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-[#242938] border-b border-[#333a4a] sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <Container>
        <div className="flex items-center justify-between h-16">{children}</div>
      </Container>
    </header>
  );
}

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="py-8">
      <Container>{children}</Container>
    </main>
  );
}

interface FlexProps {
  children: React.ReactNode;
  direction?: "row" | "col";
  justify?: "start" | "center" | "end" | "between" | "around";
  align?: "start" | "center" | "end" | "stretch";
  gap?: "none" | "sm" | "md" | "lg";
  wrap?: boolean;
}

export function Flex({
  children,
  direction = "row",
  justify = "start",
  align = "center",
  gap = "md",
  wrap = false,
}: FlexProps) {
  const directionStyles = {
    row: "flex-row",
    col: "flex-col",
  };

  const justifyStyles = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const alignStyles = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const gapStyles = {
    none: "",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const wrapStyles = wrap ? "flex-wrap" : "";

  return (
    <div
      className={`flex ${directionStyles[direction]} ${justifyStyles[justify]} ${alignStyles[align]} ${gapStyles[gap]} ${wrapStyles}`}
    >
      {children}
    </div>
  );
}

interface SpacerProps {
  size?: "sm" | "md" | "lg" | "xl";
}

export function Spacer({ size = "md" }: SpacerProps) {
  const sizeStyles = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
    xl: "h-8",
  };

  return <div className={sizeStyles[size]} />;
}

interface StackProps {
  children: React.ReactNode;
  gap?: "none" | "sm" | "md" | "lg";
}

export function Stack({ children, gap = "md" }: StackProps) {
  const gapStyles = {
    none: "",
    sm: "space-y-2",
    md: "space-y-3",
    lg: "space-y-4",
  };

  return <div className={gapStyles[gap]}>{children}</div>;
}

interface SectionProps {
  children: React.ReactNode;
  marginTop?: "sm" | "md" | "lg" | "xl";
}

export function Section({ children, marginTop = "lg" }: SectionProps) {
  const marginStyles = {
    sm: "mt-2",
    md: "mt-4",
    lg: "mt-6",
    xl: "mt-8",
  };

  return <div className={marginStyles[marginTop]}>{children}</div>;
}

interface CenteredProps {
  children: React.ReactNode;
  fullHeight?: boolean;
  padding?: "sm" | "md" | "lg";
}

export function Centered({
  children,
  fullHeight = true,
  padding = "lg",
}: CenteredProps) {
  const heightStyles = fullHeight ? "min-h-screen" : "";
  const paddingStyles = {
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
  };

  return (
    <div
      className={`${heightStyles} flex items-center justify-center ${paddingStyles[padding]}`}
    >
      {children}
    </div>
  );
}
