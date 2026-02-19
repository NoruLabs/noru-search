import type { ReactNode } from "react";

interface DataCardProps {
  children: ReactNode;
  className?: string;
}

export function DataCard({ children, className = "" }: DataCardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-bg-card p-5 transition-colors hover:border-border-hover hover:bg-bg-card-hover ${className}`}
    >
      {children}
    </div>
  );
}
