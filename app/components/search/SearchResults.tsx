"use client";

import {
  Telescope,
  Orbit,
  Camera,
  Globe,
  Sun,
  AlertTriangle,
  Shield,
  ExternalLink,
  Clock,
  X,
  Trash2,
  Search,
  SlidersHorizontal,
  ImageIcon,
  Music,
  Rocket,
  Thermometer,
} from "lucide-react";
import { DataCard } from "../ui/DataCard";
import { CardSkeleton } from "../ui/Loader";
import type { SearchResponse } from "../../hooks/useSearch";
import type { SearchHistoryItem } from "../../hooks/useSearchHistory";
import type {
  ApodData,
  NeoObject,
  MarsPhoto,
  Exoplanet,
  SolarFlare,
  NasaMediaItem,
  TechportProject,
  DatasetTab,
} from "../../lib/types";

// ── Reusable section wrapper ──
function ResultSection({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="rounded-full bg-bg-card px-2 py-0.5 text-xs text-text-muted">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

// ── Search History Dropdown ──
export function SearchHistory({
  history,
  onSelect,
  onRemove,
  onClear,
}: {
  history: SearchHistoryItem[];
  onSelect: (q: string) => void;
  onRemove: (q: string) => void;
  onClear: () => void;
}) {
  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-bg-card p-2 shadow-lg animate-fade-in">
      <div className="mb-1 flex items-center justify-between px-2 py-1">
        <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <Clock size={12} />
          Recent searches
        </span>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[10px] text-text-muted transition-colors hover:text-text-primary"
        >
          <Trash2 size={10} />
          Clear
        </button>
      </div>
      {history.map((item) => (
        <div
          key={item.query}
          className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-bg-card-hover"
        >
          <button
            onClick={() => onSelect(item.query)}
            className="flex flex-1 items-center gap-2 text-left text-sm text-text-secondary"
          >
            <Search size={12} className="shrink-0 text-text-muted" />
            <span className="truncate">{item.query}</span>
            {item.resultCount !== undefined && (
              <span className="shrink-0 text-[10px] text-text-muted">
                {item.resultCount} results
              </span>
            )}
          </button>
          <button
            onClick={() => onRemove(item.query)}
            className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X size={12} className="text-text-muted hover:text-text-primary" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Search Filters Panel ──
export function SearchFiltersPanel({
  activeTypes,
  onToggleType,
  hazardousOnly,
  onToggleHazardous,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isOpen,
  onToggle,
}: {
  activeTypes: DatasetTab[];
  onToggleType: (t: DatasetTab) => void;
  hazardousOnly: boolean;
  onToggleHazardous: () => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (d: string) => void;
  onEndDateChange: (d: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const typeOptions: { id: DatasetTab; label: string; icon: React.ReactNode }[] = [
    { id: "apod", label: "APOD", icon: <Telescope size={12} /> },
    { id: "neo", label: "Asteroids", icon: <Orbit size={12} /> },
    { id: "mars", label: "Mars", icon: <Camera size={12} /> },
    { id: "exoplanets", label: "Exoplanets", icon: <Globe size={12} /> },
    { id: "weather", label: "Weather", icon: <Sun size={12} /> },
    { id: "media", label: "Media", icon: <ImageIcon size={12} /> },
    { id: "sounds", label: "Sounds", icon: <Music size={12} /> },
    { id: "techport", label: "TechPort", icon: <Rocket size={12} /> },
  ];

  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
          isOpen
            ? "border-accent bg-accent text-accent-text"
            : "border-border text-text-muted hover:border-border-hover hover:text-text-secondary"
        }`}
      >
        <SlidersHorizontal size={12} />
        Filters
        {(activeTypes.length > 0 && activeTypes.length < 9) || hazardousOnly || startDate ? (
          <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-text text-[9px] font-bold text-accent">
            {(activeTypes.length > 0 && activeTypes.length < 9 ? 1 : 0) +
              (hazardousOnly ? 1 : 0) +
              (startDate ? 1 : 0)}
          </span>
        ) : null}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-4 rounded-xl border border-border bg-bg-card p-4 shadow-lg animate-fade-in">
          {/* Dataset type toggles */}
          <div>
            <p className="mb-2 text-xs font-medium text-text-muted">Datasets</p>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((opt) => {
                const active = activeTypes.length === 0 || activeTypes.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => onToggleType(opt.id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-accent bg-accent text-accent-text"
                        : "border-border text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date range */}
          <div>
            <p className="mb-2 text-xs font-medium text-text-muted">Date Range</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="rounded-lg border border-border bg-bg-primary px-2.5 py-1.5 text-xs text-text-primary outline-none transition-colors focus:border-accent"
              />
              <span className="text-xs text-text-muted">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="rounded-lg border border-border bg-bg-primary px-2.5 py-1.5 text-xs text-text-primary outline-none transition-colors focus:border-accent"
              />
              {(startDate || endDate) && (
                <button
                  onClick={() => { onStartDateChange(""); onEndDateChange(""); }}
                  className="text-[10px] text-text-muted hover:text-text-primary"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Hazardous toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleHazardous}
              className={`flex h-5 w-9 items-center rounded-full transition-colors ${
                hazardousOnly ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`h-3.5 w-3.5 rounded-full bg-accent-text shadow-sm transition-transform ${
                  hazardousOnly ? "translate-x-[18px]" : "translate-x-[3px]"
                }`}
              />
            </button>
            <span className="text-xs text-text-secondary">
              Hazardous asteroids only
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Loading skeleton for search results ──
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-40 rounded bg-border" />
      {[1, 2].map((section) => (
        <div key={section} className="space-y-3">
          <div className="h-4 w-32 rounded bg-border" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── No Results State ──
export function NoResults({ query }: { query: string }) {
  return (
    <div className="py-16 text-center animate-fade-in">
      <Search size={32} className="mx-auto mb-3 text-text-muted opacity-40" />
      <p className="text-sm font-medium text-text-primary">
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="mt-1 text-xs text-text-muted">
        Try a different search term, broaden your filters, or check the spelling
      </p>
    </div>
  );
}

// ── Number formatter ──
function fmt(num: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(num);
}

// ── Main Search Results Component ──
export function SearchResults({
  data,
  onNavigate,
}: {
  data: SearchResponse;
  onNavigate: (tab: DatasetTab) => void;
}) {
  const { results, counts, totalResults, errors } = data;

  if (totalResults === 0) return <NoResults query={data.query} />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary */}
      <p className="text-sm text-text-muted">
        <span className="font-semibold text-text-primary">{totalResults}</span>{" "}
        results for &ldquo;{data.query}&rdquo;
      </p>

      {/* APOD Results */}
      <ResultSection
        icon={<Telescope size={16} className="text-text-muted" />}
        title="Astronomy Pictures"
        count={counts.apod || 0}
      >
        <div className="grid gap-3 sm:grid-cols-2 stagger-children">
          {(results.apod as ApodData[] | undefined)?.map((apod) => (
            <DataCard key={apod.date}>
              <div className="flex gap-3">
                {apod.media_type === "image" && (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={apod.url}
                      alt={apod.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="min-w-0 space-y-1">
                  <h4 className="text-sm font-semibold text-text-primary truncate">
                    {apod.title}
                  </h4>
                  <p className="text-[11px] text-text-muted">{apod.date}</p>
                  <p className="line-clamp-2 text-xs text-text-secondary">
                    {apod.explanation}
                  </p>
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      </ResultSection>

      {/* NEO Results */}
      <ResultSection
        icon={<Orbit size={16} className="text-text-muted" />}
        title="Near-Earth Asteroids"
        count={counts.neo || 0}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {(results.neo as NeoObject[] | undefined)?.map((neo) => {
            const approach = neo.close_approach_data?.[0];
            const velocity = approach
              ? parseFloat(approach.relative_velocity.kilometers_per_hour)
              : 0;
            return (
              <DataCard key={neo.id}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-text-primary truncate">
                      {neo.name.replace(/[()]/g, "")}
                    </h4>
                    {neo.is_potentially_hazardous_asteroid ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] text-text-primary font-semibold">
                        <AlertTriangle size={8} />
                        Hazardous
                      </span>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] text-text-muted">
                        <Shield size={8} />
                        Safe
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <p className="text-text-muted">Velocity</p>
                      <p className="text-text-secondary">{fmt(velocity)} km/h</p>
                    </div>
                    {approach && (
                      <div>
                        <p className="text-text-muted">Approach</p>
                        <p className="text-text-secondary">
                          {approach.close_approach_date}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </DataCard>
            );
          })}
        </div>
      </ResultSection>

      {/* Mars Results */}
      <ResultSection
        icon={<Camera size={16} className="text-text-muted" />}
        title="Mars Rover Photos"
        count={counts.mars || 0}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 stagger-children">
          {(results.mars as MarsPhoto[] | undefined)?.map((photo) => (
            <DataCard key={photo.id} className="overflow-hidden p-0">
              <a href={photo.img_src} target="_blank" rel="noopener noreferrer">
                <img
                  src={photo.img_src}
                  alt={`Mars - ${photo.camera.full_name}`}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </a>
              <div className="p-2">
                <p className="truncate text-[11px] font-medium text-text-primary">
                  {photo.camera.full_name}
                </p>
                <p className="text-[10px] text-text-muted">{photo.earth_date}</p>
              </div>
            </DataCard>
          ))}
        </div>
      </ResultSection>

      {/* Exoplanets Results */}
      <ResultSection
        icon={<Globe size={16} className="text-text-muted" />}
        title="Exoplanets"
        count={counts.exoplanets || 0}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {(results.exoplanets as Exoplanet[] | undefined)?.map((planet) => (
            <DataCard key={planet.pl_name}>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    {planet.pl_name}
                  </h4>
                  <p className="text-[11px] text-text-muted">
                    Host: {planet.hostname} · {planet.disc_year}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-text-muted">Method</p>
                    <p className="text-text-secondary">{planet.discoverymethod}</p>
                  </div>
                  {planet.pl_rade && (
                    <div>
                      <p className="text-text-muted">Radius</p>
                      <p className="text-text-secondary">
                        {planet.pl_rade.toFixed(2)} R⊕
                      </p>
                    </div>
                  )}
                  {planet.pl_eqt && (
                    <div>
                      <p className="text-text-muted">Temp</p>
                      <p className="text-text-secondary">{planet.pl_eqt.toFixed(0)} K</p>
                    </div>
                  )}
                  {planet.pl_orbper && (
                    <div>
                      <p className="text-text-muted">Orbital Period</p>
                      <p className="text-text-secondary">
                        {planet.pl_orbper.toFixed(1)} d
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      </ResultSection>

      {/* Weather Results */}
      <ResultSection
        icon={<Sun size={16} className="text-text-muted" />}
        title="Solar Flares"
        count={counts.weather || 0}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {(results.weather as SolarFlare[] | undefined)?.map((flare) => (
            <DataCard key={flare.flrID}>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-semibold text-text-primary">
                    Class {flare.classType}
                  </h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      flare.classType.startsWith("X")
                        ? "bg-accent text-accent-text font-semibold"
                        : flare.classType.startsWith("M")
                          ? "bg-accent-soft text-text-primary font-medium"
                          : "bg-accent-soft text-text-secondary"
                    }`}
                  >
                    {flare.classType.startsWith("X")
                      ? "Extreme"
                      : flare.classType.startsWith("M")
                        ? "Strong"
                        : "Moderate"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-text-muted">Peak</p>
                    <p className="text-text-secondary">
                      {new Date(flare.peakTime).toLocaleDateString()}
                    </p>
                  </div>
                  {flare.sourceLocation && (
                    <div>
                      <p className="text-text-muted">Source</p>
                      <p className="text-text-secondary">{flare.sourceLocation}</p>
                    </div>
                  )}
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      </ResultSection>

      {/* NASA Media Results */}
      <ResultSection
        icon={<ImageIcon size={16} className="text-text-muted" />}
        title="NASA Images & Videos"
        count={counts.media || 0}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 stagger-children">
          {(results.media as (NasaMediaItem & { thumbnail?: string })[] | undefined)?.map(
            (item) => (
              <DataCard key={item.nasa_id} className="overflow-hidden p-0">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-2">
                  <p className="truncate text-[11px] font-medium text-text-primary">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {new Date(item.date_created).toLocaleDateString()}
                  </p>
                </div>
              </DataCard>
            )
          )}
        </div>
      </ResultSection>

      {/* Space Sounds Results */}
      <ResultSection
        icon={<Music size={16} className="text-text-muted" />}
        title="Space Sounds"
        count={counts.sounds || 0}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {(results.sounds as (NasaMediaItem & { href?: string })[] | undefined)?.map(
            (item) => (
              <DataCard key={item.nasa_id}>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Music size={14} className="mt-0.5 shrink-0 text-text-muted" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-text-primary line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-text-muted">
                        {new Date(item.date_created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-text-secondary line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </DataCard>
            )
          )}
        </div>
      </ResultSection>

      {/* TechPort Results */}
      <ResultSection
        icon={<Rocket size={16} className="text-text-muted" />}
        title="Technology Projects"
        count={counts.techport || 0}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {(results.techport as TechportProject[] | undefined)?.map((project) => (
            <DataCard key={project.projectId}>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-text-primary line-clamp-2">
                  {project.title}
                </h4>
                {project.statusDescription && (
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] ${
                      project.statusDescription === "Active"
                        ? "bg-accent text-accent-text font-medium"
                        : "bg-accent-soft text-text-secondary"
                    }`}
                  >
                    {project.statusDescription}
                  </span>
                )}
                {project.description && (
                  <p className="text-[11px] text-text-secondary line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            </DataCard>
          ))}
        </div>
      </ResultSection>

      {/* Error notices */}
      {Object.entries(errors).length > 0 && (
        <div className="glass-card rounded-xl p-3">
          <p className="text-xs text-text-muted">
            Some datasets couldn&apos;t be searched:{" "}
            {Object.keys(errors).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
