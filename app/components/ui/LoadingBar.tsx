"use client";

import { useEffect, useState } from "react";

/**
 * Shows a thin animated bar at the top of the viewport when `isLoading` is true.
 */
export function LoadingBar({ isLoading }: { isLoading: boolean }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setVisible(true);

      // Simulate progress that slows down as it approaches 90%
      let current = 0;
      const interval = setInterval(() => {
        current += (90 - current) * 0.08;
        setProgress(current);
      }, 150);

      return () => clearInterval(interval);
    } else if (visible) {
      // Complete the bar, then hide
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
    <div className="fixed top-0 right-0 left-0 z-[60] h-0.5">
      <div
        className="h-full bg-accent transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
