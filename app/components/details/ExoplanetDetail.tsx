"use client";

import { Globe, Thermometer, Orbit, Scale, Star, Calendar } from "lucide-react";
import { Modal } from "../ui/Modal";
import type { Exoplanet } from "../../lib/types";

function getHabitabilityBreakdown(planet: Exoplanet) {
  const factors: { label: string; met: boolean; detail: string }[] = [];

  factors.push({
    label: "Temperature",
    met: !!(planet.pl_eqt && planet.pl_eqt > 200 && planet.pl_eqt < 330),
    detail: planet.pl_eqt
      ? `${planet.pl_eqt.toFixed(0)} K (habitable: 200–330 K)`
      : "Unknown",
  });

  factors.push({
    label: "Earth-like radius",
    met: !!(planet.pl_rade && planet.pl_rade > 0.5 && planet.pl_rade < 2.0),
    detail: planet.pl_rade
      ? `${planet.pl_rade.toFixed(2)} R⊕ (target: 0.5–2.0)`
      : "Unknown",
  });

  factors.push({
    label: "Earth-like mass",
    met: !!(planet.pl_bmasse && planet.pl_bmasse > 0.1 && planet.pl_bmasse < 10),
    detail: planet.pl_bmasse
      ? `${planet.pl_bmasse.toFixed(2)} M⊕ (target: 0.1–10)`
      : "Unknown",
  });

  factors.push({
    label: "Habitable zone orbit",
    met: !!(planet.pl_orbsmax && planet.pl_orbsmax > 0.5 && planet.pl_orbsmax < 2.0),
    detail: planet.pl_orbsmax
      ? `${planet.pl_orbsmax.toFixed(3)} AU (target: 0.5–2.0)`
      : "Unknown",
  });

  const score = factors.filter((f) => f.met).length;
  const label =
    score >= 4
      ? "High"
      : score >= 3
        ? "Moderate"
        : score >= 1
          ? "Low"
          : "Unlikely";

  return { factors, score, label };
}

function getPlanetType(planet: Exoplanet): string {
  if (!planet.pl_rade) return "Unknown";
  if (planet.pl_rade < 1.25) return "Terrestrial";
  if (planet.pl_rade < 2.0) return "Super-Earth";
  if (planet.pl_rade < 4.0) return "Sub-Neptune";
  if (planet.pl_rade < 10.0) return "Neptune-like";
  return "Gas Giant";
}

// Visual: orbital ring scaled relative to 1 AU
function OrbitalVisual({ semiMajorAxis }: { semiMajorAxis: number | null }) {
  if (!semiMajorAxis) return null;
  const scale = Math.min(semiMajorAxis / 2, 1); // 0 to 1, where 2 AU = max circle
  const radius = 20 + scale * 60; // 20px to 80px

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-[10px] uppercase tracking-wider text-text-muted">
        Orbital Distance (relative)
      </p>
      <div className="relative flex h-[180px] w-[180px] items-center justify-center">
        {/* Habitable zone ring */}
        <div
          className="absolute rounded-full border border-dashed border-green-500/30"
          style={{
            width: `${20 + (0.5 / 2) * 60 * 2}px`,
            height: `${20 + (0.5 / 2) * 60 * 2}px`,
          }}
        />
        <div
          className="absolute rounded-full border border-dashed border-green-500/30"
          style={{
            width: `${20 + (2.0 / 2) * 60 * 2}px`,
            height: `${20 + (2.0 / 2) * 60 * 2}px`,
          }}
        />
        {/* Planet orbit */}
        <div
          className="absolute rounded-full border-2 border-accent/50"
          style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
        />
        {/* Star */}
        <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30" />
        {/* Planet dot */}
        <div
          className="absolute h-2 w-2 rounded-full bg-accent"
          style={{ top: `${90 - radius}px`, left: "89px" }}
        />
      </div>
      <div className="mt-1 flex items-center gap-3 text-[9px] text-text-muted">
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-3 rounded border border-dashed border-green-500/50" />
          Habitable zone
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-3 rounded border-2 border-accent/50" />
          Planet orbit
        </span>
      </div>
    </div>
  );
}

interface ExoplanetDetailProps {
  planet: Exoplanet | null;
  onClose: () => void;
}

export function ExoplanetDetail({ planet, onClose }: ExoplanetDetailProps) {
  if (!planet) return null;

  const hab = getHabitabilityBreakdown(planet);
  const type = getPlanetType(planet);

  const habLabelColor =
    hab.label === "High"
      ? "text-green-400"
      : hab.label === "Moderate"
        ? "text-yellow-400"
        : "text-text-muted";

  return (
    <Modal
      isOpen={!!planet}
      onClose={onClose}
      title={planet.pl_name}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header info */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
            {type}
          </span>
          <span className={`rounded-full border border-border px-2.5 py-0.5 text-xs ${habLabelColor}`}>
            Habitability: {hab.label}
          </span>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MetricCard
            icon={<Star size={14} />}
            label="Host Star"
            value={planet.hostname}
            sub={planet.st_spectype || undefined}
          />
          <MetricCard
            icon={<Calendar size={14} />}
            label="Discovery"
            value={String(planet.disc_year)}
            sub={planet.discoverymethod}
          />
          <MetricCard
            icon={<Globe size={14} />}
            label="Radius"
            value={planet.pl_rade ? `${planet.pl_rade.toFixed(2)} R⊕` : "—"}
          />
          <MetricCard
            icon={<Scale size={14} />}
            label="Mass"
            value={planet.pl_bmasse ? `${planet.pl_bmasse.toFixed(2)} M⊕` : "—"}
          />
          <MetricCard
            icon={<Thermometer size={14} />}
            label="Temperature"
            value={planet.pl_eqt ? `${planet.pl_eqt.toFixed(0)} K` : "—"}
            sub={
              planet.pl_eqt
                ? `${(planet.pl_eqt - 273.15).toFixed(0)} °C`
                : undefined
            }
          />
          <MetricCard
            icon={<Orbit size={14} />}
            label="Orbital Period"
            value={
              planet.pl_orbper
                ? planet.pl_orbper > 365
                  ? `${(planet.pl_orbper / 365.25).toFixed(1)} yr`
                  : `${planet.pl_orbper.toFixed(1)} d`
                : "—"
            }
            sub={
              planet.pl_orbsmax
                ? `${planet.pl_orbsmax.toFixed(3)} AU`
                : undefined
            }
          />
        </div>

        {/* Orbital diagram + Habitability */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Orbital visual */}
          <OrbitalVisual semiMajorAxis={planet.pl_orbsmax} />

          {/* Habitability breakdown */}
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-wider text-text-muted">
              Habitability Assessment
            </p>
            <div className="space-y-2">
              {hab.factors.map((factor) => (
                <div
                  key={factor.label}
                  className="flex items-start gap-2 rounded-lg border border-border bg-bg-card p-2.5"
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      factor.met
                        ? "bg-green-500/10 text-green-400"
                        : "bg-border text-text-muted"
                    }`}
                  >
                    {factor.met ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-text-primary">
                      {factor.label}
                    </p>
                    <p className="text-[10px] text-text-muted">{factor.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distance info */}
        {planet.sy_dist && (
          <div className="rounded-lg border border-border bg-bg-card p-3">
            <p className="text-xs text-text-muted">
              Distance from Earth:{" "}
              <span className="font-medium text-text-primary">
                {planet.sy_dist.toFixed(1)} parsecs
              </span>
              {" "}({(planet.sy_dist * 3.262).toFixed(1)} light-years)
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-card p-3">
      <div className="mb-1 flex items-center gap-1.5 text-text-muted">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-text-primary">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-text-muted">{sub}</p>}
    </div>
  );
}
