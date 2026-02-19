"use client";

import { Orbit, Sun, Globe, Camera, Telescope } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-border bg-bg-card p-3 transition-colors hover:border-border-hover"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-primary text-text-muted">
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold leading-tight text-text-primary">
              {stat.value}
            </p>
            <p className="truncate text-[11px] text-text-muted">{stat.label}</p>
          </div>
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
      icon: <Orbit size={18} />,
      label: "Near-Earth Objects",
      value: neoCount,
    },
    {
      icon: <Orbit size={18} />,
      label: "Hazardous",
      value: hazardousCount,
    },
    {
      icon: <Sun size={18} />,
      label: "Solar Flares (30d)",
      value: flareCount,
    },
    {
      icon: <Camera size={18} />,
      label: "Mars Photos",
      value: marsCount,
    },
  ];

  return <StatsBar stats={stats} />;
}
