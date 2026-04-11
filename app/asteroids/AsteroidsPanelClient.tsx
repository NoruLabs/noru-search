"use client";

import { useState } from "react";
import { useAsteroids } from "../hooks/useAsteroids";
import { DataCard } from "../components/ui/DataCard";
import { ErrorState } from "../components/ui/ErrorState";
import {
  Ruler,
  Gauge,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  Activity,
  Info,
} from "lucide-react";
import type { Asteroid } from "../lib/types";

export function AsteroidsPanel() {
  const { data: asteroids, isLoading, error } = useAsteroids();
  const [itemsToShow, setItemsToShow] = useState(9);

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 flex flex-col h-full gap-4">
            <div className="flex justify-between items-start mb-2">
              <div className="h-5 bg-bg-card rounded w-1/2"></div>
              <div className="h-4 bg-bg-card rounded w-4"></div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-1/2">
                <div className="h-3 bg-bg-card rounded w-20"></div>
                <div className="h-4 bg-bg-card rounded w-16"></div>
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <div className="h-3 bg-bg-card rounded w-20"></div>
                <div className="h-4 bg-bg-card rounded w-16"></div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
              <div className="h-4 bg-bg-card rounded w-24"></div>
              <div className="h-6 bg-bg-card rounded-full w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load tracking data from NASA." />;
  }

  if (!asteroids || asteroids.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted text-sm glass-card rounded-xl">
        No near Earth objects detected for this period. Space is quiet!
      </div>
    );
  }

  const parseDistance = (lunar: string) => {
    const val = parseFloat(lunar);
    return val.toFixed(1) + " Lunar Dist.";
  };

  const parseVelocity = (kmh: string) => {
    return parseInt(kmh, 10).toLocaleString() + " km/h";
  };

  const formatDate = (dateFull: string) => {
    // E.g., translates "2026-Apr-11 02:07" to something nicer if needed
    // or just leave it as is.
    return dateFull.trim();
  };

  const displayAsteroids = asteroids.slice(0, itemsToShow);
  const hasMore = itemsToShow < asteroids.length;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6">
      {/* Target a stable 3-column layout on large screens, expanding rows downwards smoothly */}
      <div className="flex-1 w-full relative">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {displayAsteroids.map((asteroid: Asteroid) => {
            const isHazardous = asteroid.is_potentially_hazardous_asteroid;
            const closeApproach = asteroid.close_approach_data[0];
            const diameterMin = Math.round(
              asteroid.estimated_diameter.meters.estimated_diameter_min,
            );
            const diameterMax = Math.round(
              asteroid.estimated_diameter.meters.estimated_diameter_max,
            );
            const isSentry = asteroid.is_sentry_object;

            return (
              <DataCard
                key={asteroid.id}
                className="flex flex-col h-full group hover:border-accent/40"
              >
                {/* Header / Name */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className="font-bold text-base text-text-primary truncate max-w-[150px] md:max-w-full"
                        title={asteroid.name}
                      >
                        {asteroid.name.replace(/[()]/g, "")}
                      </h3>
                      <a
                        href={asteroid.nasa_jpl_url}
                        target="_blank"
                        rel="noreferrer"
                        title="Track in 3D (JPL)"
                        className="text-text-muted hover:text-blue-500 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Passes:{" "}
                      <span className="font-medium text-text-primary">
                        {formatDate(closeApproach.close_approach_date_full)}
                      </span>
                    </p>
                  </div>

                  {/* Safety Badges Container */}
                  <div className="flex flex-col gap-1 items-end ml-2 shrink-0">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
                        isHazardous
                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      }`}
                    >
                      {isHazardous ? (
                        <AlertTriangle size={12} />
                      ) : (
                        <ShieldCheck size={12} />
                      )}
                      {isHazardous ? "Danger" : "Safe"}
                    </div>
                    {isSentry && (
                      <span className="text-[9px] text-orange-500 font-semibold tracking-wider flex items-center gap-1 mt-1">
                        <Activity size={10} /> Monitored
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mt-auto bg-bg-elevated rounded-lg p-3 border border-border">
                  {/* Distance */}
                  <div className="flex flex-col gap-1">
                    <span
                      className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium uppercase tracking-wider"
                      title="Distance relative to the Moon"
                    >
                      <Ruler size={12} />
                      Distance
                    </span>
                    <span className="text-sm font-semibold text-text-primary">
                      {parseDistance(closeApproach.miss_distance.lunar)}
                    </span>
                  </div>

                  {/* Size */}
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium uppercase tracking-wider">
                      <div className="w-3 h-3 rounded-full border-2 border-current opacity-70" />
                      Est. Size
                    </span>
                    <span className="text-sm font-semibold text-text-primary">
                      {diameterMin}m - {diameterMax}m
                    </span>
                  </div>

                  {/* Speed & Mag */}
                  <div className="flex flex-col gap-1 col-span-2 pt-2 border-t border-border mt-1">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium uppercase tracking-wider">
                        <Gauge size={12} />
                        Velocity
                      </span>
                      <span
                        className="text-[10px] text-text-muted font-medium"
                        title="Absolute Magnitude (Luminosity)"
                      >
                        Mag {asteroid.absolute_magnitude_h}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-text-primary">
                      {parseVelocity(
                        closeApproach.relative_velocity.kilometers_per_hour,
                      )}
                    </span>
                  </div>
                </div>
              </DataCard>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setItemsToShow((prev) => prev + 9)}
              className="px-6 py-2 bg-bg-card hover:bg-bg-card-hover text-text-primary border border-border rounded-lg text-sm font-medium transition-colors"
            >
              ↓
            </button>
          </div>
        )}
      </div>

      {/* Info Sidebar (Right Column) */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 sticky top-20 flex flex-col gap-4">
        <DataCard className="flex flex-col">
          <div className="flex items-center gap-2 text-text-primary font-bold border-b border-border pb-3 mb-3">
            <Info size={16} className="text-accent" />
            <h4 className="text-sm">How to read this</h4>
          </div>

          <ul className="space-y-4 text-sm">
            <li className="flex flex-col gap-1">
              <span className="font-semibold text-text-primary text-[13px]">
                Lunar Distance (LD)
              </span>
              <span className="text-text-muted text-[12px] leading-relaxed">
                The distance from Earth to the Moon. E.g. &quot;5.0 LD&quot; means the
                asteroid is passing 5 times further away than our Moon.
              </span>
            </li>

            <li className="flex flex-col gap-1">
              <span className="font-semibold text-text-primary text-[13px]">
                Absolute Magnitude (Mag)
              </span>
              <span className="text-text-muted text-[12px] leading-relaxed">
                Represents the brightness and reflective density. Highly
                reflective asteroids have lower numbers.
              </span>
            </li>

            <li className="flex flex-col gap-1">
              <span className="font-semibold text-orange-500 text-[13px] flex items-center gap-1.5">
                <Activity size={12} /> Sentry Monitored
              </span>
              <span className="text-text-muted text-[12px] leading-relaxed">
                Objects that NASA&apos;s Sentry impact-monitoring system actively
                keeps automated tracking on for future potential risks.
              </span>
            </li>

            <li className="flex flex-col gap-1">
              <span className="font-semibold text-red-500 text-[13px] flex items-center gap-1.5">
                <AlertTriangle size={12} /> Danger
              </span>
              <span className="text-text-muted text-[12px] leading-relaxed">
                Asteroids classified as Potentially Hazardous (PHA) based on
                proximity orbits and massive size.
              </span>
            </li>
          </ul>
        </DataCard>
      </aside>
    </div>
  );
}
