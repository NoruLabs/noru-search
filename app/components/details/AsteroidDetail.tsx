"use client";

import { AlertTriangle, Shield, ExternalLink } from "lucide-react";
import { Modal } from "../ui/Modal";
import type { NeoObject } from "../../lib/types";

function fmt(num: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(num);
}

// Compare asteroid size to familiar objects
function getSizeComparison(diameterMeters: number): string {
  if (diameterMeters < 1) return "smaller than a marble";
  if (diameterMeters < 5) return "about the size of a car";
  if (diameterMeters < 20) return "about the size of a house";
  if (diameterMeters < 50) return "about the size of an airplane";
  if (diameterMeters < 100) return "about the size of a football field";
  if (diameterMeters < 300) return "about the size of a skyscraper";
  if (diameterMeters < 1000) return "about the size of a small mountain";
  if (diameterMeters < 5000) return "larger than a mountain";
  return "absolutely massive — a potential extinction-level object";
}

function SizeVisual({ diameterMin, diameterMax }: { diameterMin: number; diameterMax: number }) {
  const avg = (diameterMin + diameterMax) / 2;
  // Scale: 1m = 1px, max 200px
  const barWidth = Math.min(Math.max(avg / 5, 4), 200);
  const earthPx = 200; // reference bar

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-muted">Size Comparison</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div
            className="h-3 rounded-full bg-accent opacity-70"
            style={{ width: `${barWidth}px` }}
          />
          <span className="text-[10px] text-text-muted">
            Asteroid ~{fmt(avg)} m
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-3 rounded-full bg-border"
            style={{ width: `${earthPx}px` }}
          />
          <span className="text-[10px] text-text-muted">
            Earth 12,742 km
          </span>
        </div>
      </div>
      <p className="text-[11px] text-text-secondary italic">
        {getSizeComparison(avg)}
      </p>
    </div>
  );
}

interface AsteroidDetailProps {
  asteroid: NeoObject | null;
  onClose: () => void;
}

export function AsteroidDetail({ asteroid, onClose }: AsteroidDetailProps) {
  if (!asteroid) return null;

  const diamMinM = asteroid.estimated_diameter.meters.estimated_diameter_min;
  const diamMaxM = asteroid.estimated_diameter.meters.estimated_diameter_max;
  const diamMinKm = asteroid.estimated_diameter.kilometers.estimated_diameter_min;
  const diamMaxKm = asteroid.estimated_diameter.kilometers.estimated_diameter_max;

  return (
    <Modal
      isOpen={!!asteroid}
      onClose={onClose}
      title={asteroid.name.replace(/[()]/g, "")}
      size="lg"
    >
      <div className="space-y-6">
        {/* Status badge */}
        <div className="flex items-center gap-3">
          {asteroid.is_potentially_hazardous_asteroid ? (
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
              <AlertTriangle size={12} />
              Potentially Hazardous Asteroid
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
              <Shield size={12} />
              Not Hazardous
            </span>
          )}
          <a
            href={asteroid.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-primary"
          >
            NASA JPL <ExternalLink size={10} />
          </a>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-bg-card p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Magnitude
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {asteroid.absolute_magnitude_h.toFixed(1)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg-card p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Diameter (m)
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {fmt(diamMinM)}–{fmt(diamMaxM)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg-card p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Diameter (km)
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {diamMinKm.toFixed(3)}–{diamMaxKm.toFixed(3)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg-card p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Approaches
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {asteroid.close_approach_data.length}
            </p>
          </div>
        </div>

        {/* Size Visual */}
        <SizeVisual diameterMin={diamMinM} diameterMax={diamMaxM} />

        {/* Close Approach History */}
        {asteroid.close_approach_data.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              Close Approach Data
            </h3>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-bg-card">
                    <th className="px-3 py-2 font-medium text-text-muted">Date</th>
                    <th className="px-3 py-2 font-medium text-text-muted">Velocity (km/h)</th>
                    <th className="px-3 py-2 font-medium text-text-muted">Miss Distance (km)</th>
                    <th className="px-3 py-2 font-medium text-text-muted">Miss (lunar)</th>
                    <th className="px-3 py-2 font-medium text-text-muted">Orbiting</th>
                  </tr>
                </thead>
                <tbody>
                  {asteroid.close_approach_data.map((approach, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="whitespace-nowrap px-3 py-2 text-text-primary">
                        {approach.close_approach_date}
                      </td>
                      <td className="px-3 py-2 text-text-secondary">
                        {fmt(parseFloat(approach.relative_velocity.kilometers_per_hour))}
                      </td>
                      <td className="px-3 py-2 text-text-secondary">
                        {fmt(parseFloat(approach.miss_distance.kilometers))}
                      </td>
                      <td className="px-3 py-2 text-text-secondary">
                        {parseFloat(approach.miss_distance.lunar).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-text-secondary">
                        {approach.orbiting_body}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
