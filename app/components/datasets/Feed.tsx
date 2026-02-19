"use client";

import {
  Telescope,
  AlertTriangle,
  Shield,
  ExternalLink,
  Camera,
  Sun,
} from "lucide-react";
import { useFeed } from "../../hooks/useFeed";
import { DataCard } from "../ui/DataCard";
import { FeedSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { FeedStats } from "../ui/StatsBar";
import type { DatasetTab, NeoObject, MarsPhoto, SolarFlare } from "../../lib/types";

interface FeedProps {
  searchQuery: string;
  onNavigate: (tab: DatasetTab) => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(num);
}

function SectionHeader({
  icon,
  title,
  count,
  tab,
  onNavigate,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  tab: DatasetTab;
  onNavigate: (tab: DatasetTab) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {count !== undefined && (
          <span className="rounded-full bg-bg-card px-2 py-0.5 text-xs text-text-muted">
            {count}
          </span>
        )}
      </div>
      <button
        onClick={() => onNavigate(tab)}
        className="text-xs text-text-muted transition-colors hover:text-text-primary"
      >
        View all →
      </button>
    </div>
  );
}

export function Feed({ searchQuery, onNavigate }: FeedProps) {
  const { data, isLoading, error, refetch } = useFeed();

  if (isLoading) return <FeedSkeleton />;
  if (error)
    return <ErrorState message="Failed to load feed." onRetry={() => refetch()} />;
  if (!data) return null;

  const { results } = data;
  const q = searchQuery.toLowerCase();

  // Filter logic: if search query exists, filter items by text match
  const showApod =
    results.apod &&
    (!q ||
      results.apod.title.toLowerCase().includes(q) ||
      results.apod.explanation.toLowerCase().includes(q));

  const filteredNeo = results.neo
    ? results.neo.filter((n) => !q || n.name.toLowerCase().includes(q))
    : [];

  const filteredMars = results.mars
    ? results.mars.filter(
        (p) =>
          !q ||
          p.camera.full_name.toLowerCase().includes(q) ||
          p.rover.name.toLowerCase().includes(q)
      )
    : [];

  const filteredWeather = results.weather
    ? results.weather.filter(
        (f) =>
          !q ||
          f.classType.toLowerCase().includes(q) ||
          (f.sourceLocation && f.sourceLocation.toLowerCase().includes(q))
      )
    : [];

  const hasResults =
    showApod ||
    filteredNeo.length > 0 ||
    filteredMars.length > 0 ||
    filteredWeather.length > 0;

  if (!hasResults && q) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-text-muted">
          No results for &quot;{searchQuery}&quot;
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Try a different search or clear filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Overview */}
      <FeedStats
        neoCount={results.neo?.length ?? 0}
        hazardousCount={
          results.neo?.filter((n: NeoObject) => n.is_potentially_hazardous_asteroid).length ?? 0
        }
        flareCount={results.weather?.length ?? 0}
        marsCount={results.mars?.length ?? 0}
      />

      {/* APOD Section */}
      {showApod && results.apod && (
        <section className="space-y-3">
          <SectionHeader
            icon={<Telescope size={16} className="text-text-muted" />}
            title="Astronomy Picture of the Day"
            tab="apod"
            onNavigate={onNavigate}
          />
          <DataCard>
            <div className="flex flex-col gap-4 sm:flex-row">
              {results.apod.media_type === "image" && (
                <div className="shrink-0 overflow-hidden rounded-lg sm:w-64">
                  <img
                    src={results.apod.url}
                    alt={results.apod.title}
                    className="aspect-video w-full object-cover sm:aspect-square"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="space-y-2 min-w-0">
                <h3 className="text-base font-semibold text-text-primary">
                  {results.apod.title}
                </h3>
                <p className="text-xs text-text-muted">
                  {results.apod.date}
                  {results.apod.copyright && ` · © ${results.apod.copyright}`}
                </p>
                <p className="line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {results.apod.explanation}
                </p>
                {results.apod.hdurl && (
                  <a
                    href={results.apod.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary"
                  >
                    View HD <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </DataCard>
        </section>
      )}

      {/* NEO Section */}
      {filteredNeo.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            icon={<AlertTriangle size={16} className="text-text-muted" />}
            title="Near-Earth Asteroids Today"
            count={filteredNeo.length}
            tab="neo"
            onNavigate={onNavigate}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {filteredNeo.slice(0, 6).map((neo: NeoObject) => {
              const approach = neo.close_approach_data[0];
              const velocity = approach
                ? parseFloat(approach.relative_velocity.kilometers_per_hour)
                : 0;
              return (
                <DataCard key={neo.id}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-semibold text-text-primary truncate">
                        {neo.name.replace(/[()]/g, "")}
                      </h3>
                      {neo.is_potentially_hazardous_asteroid ? (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">
                          <AlertTriangle size={8} />
                          Hazardous
                        </span>
                      ) : (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
                          <Shield size={8} />
                          Safe
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <p className="text-text-muted">Velocity</p>
                        <p className="text-text-secondary">
                          {formatNumber(velocity)} km/h
                        </p>
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
        </section>
      )}

      {/* Mars Section */}
      {filteredMars.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            icon={<Camera size={16} className="text-text-muted" />}
            title="Mars Rover Photos"
            count={filteredMars.length}
            tab="mars"
            onNavigate={onNavigate}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 stagger-children">
            {filteredMars.slice(0, 6).map((photo: MarsPhoto) => (
              <DataCard key={photo.id} className="overflow-hidden p-0">
                <a
                  href={photo.img_src}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                  <p className="text-[10px] text-text-muted">
                    {photo.earth_date}
                  </p>
                </div>
              </DataCard>
            ))}
          </div>
        </section>
      )}

      {/* Space Weather Section */}
      {filteredWeather.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            icon={<Sun size={16} className="text-text-muted" />}
            title="Recent Solar Flares"
            count={filteredWeather.length}
            tab="weather"
            onNavigate={onNavigate}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {filteredWeather.slice(0, 6).map((flare: SolarFlare) => (
              <DataCard key={flare.flrID}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xs font-semibold text-text-primary">
                      Class {flare.classType}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        flare.classType.startsWith("X")
                          ? "bg-red-500/10 text-red-400"
                          : flare.classType.startsWith("M")
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-yellow-500/10 text-yellow-400"
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
                        <p className="text-text-secondary">
                          {flare.sourceLocation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </DataCard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
