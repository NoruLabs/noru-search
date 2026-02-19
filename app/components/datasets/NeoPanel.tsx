"use client";

import { useState } from "react";
import { AlertTriangle, Shield, Search } from "lucide-react";
import { useNeoFeed } from "../../hooks/useNeo";
import { DataCard } from "../ui/DataCard";
import { Loader, CardSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";
import { NeoDistanceChart, NeoVelocityChart } from "../charts/NeoCharts";
import type { NeoObject } from "../../lib/types";

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(num);
}

function AsteroidCard({ asteroid }: { asteroid: NeoObject }) {
  const approach = asteroid.close_approach_data[0];
  const diameterMin = asteroid.estimated_diameter.meters.estimated_diameter_min;
  const diameterMax = asteroid.estimated_diameter.meters.estimated_diameter_max;
  const velocity = approach
    ? parseFloat(approach.relative_velocity.kilometers_per_hour)
    : 0;
  const distance = approach
    ? parseFloat(approach.miss_distance.kilometers)
    : 0;

  return (
    <DataCard>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary">
            {asteroid.name.replace(/[()]/g, "")}
          </h3>
          {asteroid.is_potentially_hazardous_asteroid ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
              <AlertTriangle size={10} />
              Hazardous
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
              <Shield size={10} />
              Safe
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-text-muted">Diameter</p>
            <p className="font-medium text-text-secondary">
              {formatNumber(diameterMin)}–{formatNumber(diameterMax)} m
            </p>
          </div>
          <div>
            <p className="text-text-muted">Velocity</p>
            <p className="font-medium text-text-secondary">
              {formatNumber(velocity)} km/h
            </p>
          </div>
          <div>
            <p className="text-text-muted">Miss Distance</p>
            <p className="font-medium text-text-secondary">
              {formatNumber(distance)} km
            </p>
          </div>
          {approach && (
            <div>
              <p className="text-text-muted">Approach Date</p>
              <p className="font-medium text-text-secondary">
                {approach.close_approach_date}
              </p>
            </div>
          )}
        </div>
      </div>
    </DataCard>
  );
}

export function NeoPanel() {
  const [filter, setFilter] = useState<"all" | "hazardous" | "safe">("all");
  const [search, setSearch] = useState("");
  const [showCharts, setShowCharts] = useState(true);
  const { data, isLoading, error, refetch } = useNeoFeed();

  if (isLoading)
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
    );
  if (!data) return null;

  const filtered = data
    .filter((neo) => {
      if (filter === "hazardous") return neo.is_potentially_hazardous_asteroid;
      if (filter === "safe") return !neo.is_potentially_hazardous_asteroid;
      return true;
    })
    .filter(
      (neo) =>
        !search || neo.name.toLowerCase().includes(search.toLowerCase())
    );

  const hazardousCount = data.filter(
    (n) => n.is_potentially_hazardous_asteroid
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-text-secondary">
          <span className="font-semibold text-text-primary">{data.length}</span>{" "}
          objects detected
        </span>
        <span className="text-text-secondary">
          <span className="font-semibold text-red-400">{hazardousCount}</span>{" "}
          potentially hazardous
        </span>
      </div>

      {/* Charts */}
      {showCharts && (
        <div className="grid gap-4 lg:grid-cols-2">
          <NeoDistanceChart data={data} />
          <NeoVelocityChart data={data} />
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asteroids..."
            className="w-full rounded-lg border border-border bg-bg-card py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-accent"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "hazardous", "safe"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "border-accent bg-accent text-accent-text"
                  : "border-border text-text-muted hover:text-text-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCharts(!showCharts)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          {showCharts ? "Hide charts" : "Show charts"}
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        {filtered.map((neo) => (
          <AsteroidCard key={neo.id} asteroid={neo} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-text-muted">
          No asteroids match this filter.
        </p>
      )}
    </div>
  );
}
