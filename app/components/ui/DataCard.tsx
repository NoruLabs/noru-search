import type { ReactNode } from "react";

interface DataCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DataCard({ children, className = "", onClick }: DataCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg border border-border bg-bg-card p-5 transition-colors hover:border-border-hover hover:bg-bg-card-hover ${className}`}
    >
      {children}
    </div>
  );
}
