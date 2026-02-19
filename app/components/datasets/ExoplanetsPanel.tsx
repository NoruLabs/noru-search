"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useExoplanets } from "../../hooks/useExoplanets";
import { DataCard } from "../ui/DataCard";
import { Loader } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";
import type { Exoplanet } from "../../lib/types";

function getHabitabilityScore(planet: Exoplanet): {
  score: number;
  label: string;
} {
  let score = 0;
  // Temperature in habitable range (200-330K)
  if (planet.pl_eqt && planet.pl_eqt > 200 && planet.pl_eqt < 330) score += 3;
  // Earth-like radius (0.5-2.0 Earth radii)
  if (planet.pl_rade && planet.pl_rade > 0.5 && planet.pl_rade < 2.0)
    score += 2;
  // Earth-like mass (0.1-10 Earth masses)
  if (planet.pl_bmasse && planet.pl_bmasse > 0.1 && planet.pl_bmasse < 10)
    score += 2;
  // In habitable zone orbital distance (0.5-2.0 AU)
  if (
    planet.pl_orbsmax &&
    planet.pl_orbsmax > 0.5 &&
    planet.pl_orbsmax < 2.0
  )
    score += 3;

  if (score >= 8) return { score, label: "High" };
  if (score >= 5) return { score, label: "Moderate" };
  if (score >= 2) return { score, label: "Low" };
  return { score, label: "Unlikely" };
}

function ExoplanetCard({ planet }: { planet: Exoplanet }) {
  const hab = getHabitabilityScore(planet);
  const habColor =
    hab.label === "High"
      ? "text-green-400"
      : hab.label === "Moderate"
        ? "text-yellow-400"
        : "text-text-muted";

  return (
    <DataCard>
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            {planet.pl_name}
          </h3>
          <p className="text-xs text-text-muted">
            Host: {planet.hostname} · Discovered {planet.disc_year}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-text-muted">Method</p>
            <p className="font-medium text-text-secondary">
              {planet.discoverymethod}
            </p>
          </div>
          <div>
            <p className="text-text-muted">Habitability</p>
            <p className={`font-medium ${habColor}`}>{hab.label}</p>
          </div>
          {planet.pl_rade && (
            <div>
              <p className="text-text-muted">Radius</p>
              <p className="font-medium text-text-secondary">
                {planet.pl_rade.toFixed(2)} R⊕
              </p>
            </div>
          )}
          {planet.pl_bmasse && (
            <div>
              <p className="text-text-muted">Mass</p>
              <p className="font-medium text-text-secondary">
                {planet.pl_bmasse.toFixed(2)} M⊕
              </p>
            </div>
          )}
          {planet.pl_eqt && (
            <div>
              <p className="text-text-muted">Temp</p>
              <p className="font-medium text-text-secondary">
                {planet.pl_eqt.toFixed(0)} K
              </p>
            </div>
          )}
          {planet.pl_orbper && (
            <div>
              <p className="text-text-muted">Orbital Period</p>
              <p className="font-medium text-text-secondary">
                {planet.pl_orbper.toFixed(1)} days
              </p>
            </div>
          )}
        </div>
      </div>
    </DataCard>
  );
}

export function ExoplanetsPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error, refetch } = useExoplanets(100);

  if (isLoading) return <Loader text="Discovering exoplanets..." />;
  if (error)
    return (
      <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
    );
  if (!data) return null;

  const filtered = search
    ? data.filter(
        (p) =>
          p.pl_name.toLowerCase().includes(search.toLowerCase()) ||
          p.hostname.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search planets or host stars..."
          className="w-full rounded-lg border border-border bg-bg-card py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-accent"
        />
      </div>

      <p className="text-sm text-text-muted">
        Showing {filtered.length} of {data.length} exoplanets
      </p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((planet) => (
          <ExoplanetCard key={planet.pl_name} planet={planet} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-text-muted">
          No exoplanets match your search.
        </p>
      )}
    </div>
  );
}
