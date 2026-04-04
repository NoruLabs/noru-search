"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useExoplanets } from "../../hooks/useExoplanets";
import { DataCard } from "../ui/DataCard";
import { Loader } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";
import dynamic from "next/dynamic";
import { ExoplanetDetail } from "../details/ExoplanetDetail";
import { CompareMode } from "./CompareMode";
import type { Exoplanet } from "../../lib/types";

const ExoplanetTrends = dynamic(() => import("../charts/ExoplanetTrends").then(mod => mod.ExoplanetTrends), {
  ssr: false,
  loading: () => <Loader />
});

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

function ExoplanetCard({ planet, onClick }: { planet: Exoplanet; onClick: () => void }) {
  const hab = getHabitabilityScore(planet);
  const habColor =
    hab.label === "High"
      ? "text-text-primary font-semibold"
      : hab.label === "Moderate"
        ? "text-text-secondary font-medium"
        : "text-text-muted";

  return (
    <DataCard className="cursor-pointer transition-transform hover:scale-[1.01]" onClick={onClick}>
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
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [showTrends, setShowTrends] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 60;
  const { data, isLoading, error, refetch } = useExoplanets();

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
          p.hostname.toLowerCase().includes(search.toLowerCase()) ||
          p.discoverymethod?.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search + Toggle buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search planets, host stars, or methods..."
            className="w-full rounded-xl border border-border/60 bg-bg-card/80 py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition-all focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
          />
        </div>
        <button
          onClick={() => setShowTrends(!showTrends)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            showTrends
              ? "border-accent bg-accent text-accent-text"
              : "border-border text-text-muted hover:text-text-secondary"
          }`}
        >
          {showTrends ? "Hide trends" : "Trend charts"}
        </button>
        <button
          onClick={() => setShowCompare(!showCompare)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            showCompare
              ? "border-accent bg-accent text-accent-text"
              : "border-border text-text-muted hover:text-text-secondary"
          }`}
        >
          {showCompare ? "Hide compare" : "Compare mode"}
        </button>
      </div>

      {/* Exoplanet Trends */}
      {showTrends && <ExoplanetTrends />}

      {/* Compare Mode */}
      {showCompare && <CompareMode initialType="exoplanets" />}

      <p className="text-sm text-text-muted">
        Showing {paged.length} of {filtered.length} exoplanets{search && ` matching "${search}"`}
        {data.length !== filtered.length && ` (${data.length} total)`}
      </p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((planet) => (
          <ExoplanetCard
            key={planet.pl_name}
            planet={planet}
            onClick={() => setSelectedPlanet(planet)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-text-muted">
          No exoplanets match your search.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-xs text-text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Detail modal */}
      <ExoplanetDetail
        planet={selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
      />
    </div>
  );
}
