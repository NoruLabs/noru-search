"use client";

import { Orbit, Sun, Globe, Camera, Telescope } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex items-center gap-2"
        >
          <span className="text-text-muted">{stat.icon}</span>
          <span className="text-sm font-semibold text-text-primary tabular-nums">
            {stat.value}
          </span>
          <span className="text-xs text-text-muted">{stat.label}</span>
          {i < stats.length - 1 && (
            <span className="ml-2 text-border">·</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function FeedStats({
  neoCount,
  hazardousCount,
  flareCount,
  marsCount,
}: {
  neoCount: number;
  hazardousCount: number;
  flareCount: number;
  marsCount: number;
}) {
  const stats: StatItem[] = [
    {
      icon: <Orbit size={14} />,
      label: "Near-Earth Objects",
      value: neoCount,
    },
    {
      icon: <Orbit size={14} />,
      label: "Hazardous",
      value: hazardousCount,
    },
    {
      icon: <Sun size={14} />,
      label: "Solar Flares (30d)",
      value: flareCount,
    },
    {
      icon: <Camera size={14} />,
      label: "Mars Photos",
      value: marsCount,
    },
  ];

  return <StatsBar stats={stats} />;
}
