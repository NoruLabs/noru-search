import type { ReactNode } from "react";

interface DataCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  accentColor?: string;
}

export function DataCard({ children, className = "", onClick, accentColor }: DataCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-xl p-5 ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={
        accentColor
          ? { borderColor: `color-mix(in srgb, ${accentColor} 20%, transparent)` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
