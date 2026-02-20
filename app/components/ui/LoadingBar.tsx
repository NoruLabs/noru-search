"use client";

import { useEffect, useState } from "react";

export function LoadingBar({ isLoading }: { isLoading: boolean }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setVisible(true);
      let current = 0;
      const interval = setInterval(() => {
        current += (90 - current) * 0.08;
        setProgress(current);
      }, 150);
      return () => clearInterval(interval);
    } else if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-[60] h-[2px]">
      <div
        className="h-full transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          background: "var(--accent)",
          boxShadow: "0 0 8px var(--accent)",
        }}
      />
    </div>
  );
}
