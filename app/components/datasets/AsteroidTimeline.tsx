"use client";

import { useMemo, useState, useEffect } from "react";
import { Calendar, AlertTriangle, Shield, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useNeoFeed } from "../../hooks/useNeo";
import { DataCard } from "../ui/DataCard";
import type { NeoObject, CloseApproach } from "../../lib/types";

function formatSpeed(kmh: string): string {
  const v = parseFloat(kmh);
  if (v >= 100000) return `${(v / 1000).toFixed(0)}K km/h`;
  return `${v.toFixed(0)} km/h`;
}

function formatDistance(km: string): string {
  const d = parseFloat(km);
  if (d >= 1_000_000) return `${(d / 1_000_000).toFixed(2)}M km`;
  return `${(d / 1000).toFixed(0)}K km`;
}

interface DayData {
  date: string;
  dateLabel: string;
  dayOfWeek: string;
  neos: (NeoObject & { approach: CloseApproach })[];
  hazardousCount: number;
  maxSpeed: number;
}

export function AsteroidTimeline() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { today, startDate, endDate, startStr, endStr } = useMemo(() => {
    const d = new Date();
    const start = new Date(d);
    start.setDate(d.getDate() + weekOffset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      today: d,
      startDate: start,
      endDate: end,
      startStr: start.toISOString().split("T")[0],
      endStr: end.toISOString().split("T")[0],
    };
  }, [weekOffset]);

  const { data: neos, isLoading } = useNeoFeed(startStr, endStr);

  const days = useMemo<DayData[]>(() => {
    const result: DayData[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      const dayNeos = (neos ?? [])
        .map((neo) => {
          const approach = neo.close_approach_data.find(
            (a) => a.close_approach_date === dateStr,
          );
          return approach ? { ...neo, approach } : null;
        })
        .filter(Boolean) as (NeoObject & { approach: CloseApproach })[];

      dayNeos.sort((a, b) => {
        const distA = parseFloat(a.approach.miss_distance.kilometers);
        const distB = parseFloat(b.approach.miss_distance.kilometers);
        return distA - distB;
      });

      const hazardousCount = dayNeos.filter((n) => n.is_potentially_hazardous_asteroid).length;
      const maxSpeed = Math.max(
        0,
        ...dayNeos.map((n) => parseFloat(n.approach.relative_velocity.kilometers_per_hour)),
      );

      result.push({
        date: dateStr,
        dateLabel: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        dayOfWeek: d.toLocaleDateString(undefined, { weekday: "short" }),
        neos: dayNeos,
        hazardousCount,
        maxSpeed,
      });
    }
    return result;
  }, [neos, startStr]);

  const isCurrentWeek = weekOffset === 0;
  const todayStr = today.toISOString().split("T")[0];

  if (!mounted || isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">Asteroid Timeline</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-7">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-40 rounded-xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">Asteroid Timeline</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-bg-card hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekOffset(0)}
              className="rounded-lg px-2 py-1 text-[10px] font-medium text-text-muted hover:bg-bg-card hover:text-text-primary"
            >
              Today
            </button>
          )}
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-bg-card hover:text-text-primary transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const isToday = day.date === todayStr;
          return (
            <div
              key={day.date}
              className={`rounded-xl border p-3 transition-colors ${
                isToday
                  ? "border-accent/30 bg-accent-soft"
                  : "border-border bg-bg-card"
              }`}
            >
              {/* Day header */}
              <div className="mb-2 text-center">
                <p className="text-[10px] font-medium text-text-muted">{day.dayOfWeek}</p>
                <p className={`text-sm font-semibold ${isToday ? "text-accent" : "text-text-primary"}`}>
                  {day.dateLabel}
                </p>
              </div>

              {/* Stats */}
              <div className="mb-2 flex items-center justify-center gap-2 text-[10px]">
                <span className="text-text-secondary">{day.neos.length} NEOs</span>
                {day.hazardousCount > 0 && (
                  <span className="flex items-center gap-0.5 text-text-primary font-semibold">
                    <AlertTriangle size={8} />
                    {day.hazardousCount}
                  </span>
                )}
              </div>

              {/* NEO list */}
              <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-none">
                {day.neos.slice(0, 5).map((neo) => (
                  <div
                    key={neo.id}
                    className={`rounded-lg px-2 py-1 text-[10px] ${
                      neo.is_potentially_hazardous_asteroid
                        ? "bg-accent/10 border border-accent/20"
                        : "bg-bg-card-hover"
                    }`}
                  >
                    <p className="font-medium text-text-primary truncate">
                      {neo.name.replace(/[()]/g, "")}
                    </p>
                    <div className="flex justify-between text-text-muted">
                      <span>{formatDistance(neo.approach.miss_distance.kilometers)}</span>
                      <span>{formatSpeed(neo.approach.relative_velocity.kilometers_per_hour)}</span>
                    </div>
                  </div>
                ))}
                {day.neos.length > 5 && (
                  <p className="text-center text-[9px] text-text-muted">
                    +{day.neos.length - 5} more
                  </p>
                )}
                {day.neos.length === 0 && (
                  <p className="py-2 text-center text-[10px] text-text-muted">No data</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
