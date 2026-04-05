"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Telescope,
  AlertTriangle,
  Shield,
  ExternalLink,
  Sun,
  ArrowRight,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFeed } from "../../hooks/useFeed";
import { useSpaceNews } from "../../hooks/useSpaceNews";
import {
  useSolarFlares,
  useGeomagneticStorms,
} from "../../hooks/useSpaceWeather";
import { FeedSkeleton } from "../../components/ui/Loader";
import { ErrorState } from "../../components/ui/ErrorState";
import { FeedStats } from "../../components/ui/StatsBar";
import { DailyBriefing } from "./DailyBriefing";
import { SpaceWeatherRiskMeter } from "./RiskMeter";
import { AlertConditionsPanel } from "./AlertConditions";
import type {
  DatasetTab,
  NeoObject,
  SolarFlare,
  SpaceNewsArticle,
  SpaceNewsBlog,
  SpaceNewsReport,
} from "../../lib/types";

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
  color,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  tab: DatasetTab;
  onNavigate: (tab: DatasetTab) => void;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-text-muted"
        >
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {count !== undefined && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-accent-soft text-text-secondary"
          >
            {count}
          </span>
        )}
      </div>
      <button
        onClick={() => onNavigate(tab)}
        className="group flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-primary"
      >
        View all
        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

function formatNewsDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/* ── Infinite News Carousel ── */

type NewsItem = (SpaceNewsArticle | SpaceNewsBlog | SpaceNewsReport) & {
  _type: "article" | "blog" | "report";
};

function FeedNewsSection() {
  const { data, isLoading, error, refetch } = useSpaceNews();
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const scrollPos = useRef(0);
  const rafRef = useRef<number>(0);
  const SPEED = 0.5; // px per frame

  const items: NewsItem[] = useMemo(() => {
    if (!data) return [];
    return [
      ...data.articles.map((a) => ({ ...a, _type: "article" as const })),
      ...data.blogs.map((b) => ({ ...b, _type: "blog" as const })),
      ...data.reports.map((r) => ({ ...r, _type: "report" as const })),
    ];
  }, [data]);

  const animate = useCallback(() => {
    const track = trackRef.current;
    if (!track || paused) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }
    scrollPos.current += SPEED;
    const halfWidth = track.scrollWidth / 2;
    if (scrollPos.current >= halfWidth) {
      scrollPos.current -= halfWidth;
    }
    track.style.transform = `translateX(-${scrollPos.current}px)`;
    rafRef.current = requestAnimationFrame(animate);
  }, [paused]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const nudge = (dir: "left" | "right") => {
    scrollPos.current += dir === "right" ? 320 : -320;
    if (scrollPos.current < 0) scrollPos.current = 0;
  };

  const loadingState = (
    <section className="space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-text-muted">
          <Newspaper size={14} />
        </div>
        <h2 className="text-sm font-semibold text-text-primary">Space News</h2>
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 w-72 shrink-0 rounded-2xl skeleton" />
        ))}
      </div>
    </section>
  );

  if (isLoading) return loadingState;

  if (error) {
    return (
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-text-muted">
            <Newspaper size={14} />
          </div>
          <h2 className="text-sm font-semibold text-text-primary">Space News</h2>
        </div>
        <div className="rounded-2xl glass-card p-6 text-center">
          <p className="text-sm text-text-muted">Couldn&apos;t load space news.</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-xs font-medium text-text-primary underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  // Duplicate for seamless loop
  const duped = [...items, ...items];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-text-muted">
            <Newspaper size={14} />
          </div>
          <h2 className="text-sm font-semibold text-text-primary">Space News</h2>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-accent-soft text-text-secondary">
            {items.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => nudge("left")}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
            aria-label="Scroll left"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => nudge("right")}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
            aria-label="Scroll right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-4 will-change-transform"
          style={{ width: "max-content" }}
        >
          {duped.map((item, i) => (
            <a
              key={`${item.id}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-72 shrink-0 overflow-hidden rounded-2xl border border-border/40 bg-bg-card transition-all duration-300 hover:border-border-hover hover:shadow-lg"
            >
              <div className="relative h-40 w-full overflow-hidden bg-bg-surface">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-accent-soft">
                    <Newspaper size={32} className="text-text-muted/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#23262A]/60 to-transparent" />
                {/* Badge */}
                <span className="absolute left-3 top-3 rounded-full bg-[#23262A]/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#F8F8FF]/80 backdrop-blur-sm">
                  {item._type}
                </span>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  {item.news_site}
                </p>
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-text-primary group-hover:underline">
                  {item.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">
                  {item.summary}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">
                    {formatNewsDate(item.published_at)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Read <ExternalLink size={10} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Feed({ searchQuery, onNavigate }: FeedProps) {
  const { data, isLoading, error, refetch } = useFeed();
  const { data: flares } = useSolarFlares(7);
  const { data: storms } = useGeomagneticStorms(7);

  if (isLoading) return <FeedSkeleton />;
  if (error)
    return <ErrorState message="Failed to load feed." onRetry={() => refetch()} />;
  if (!data) return null;

  const { results } = data;
  const q = searchQuery.toLowerCase();

  const showApod =
    results.apod &&
    (!q ||
      results.apod.title.toLowerCase().includes(q) ||
      results.apod.explanation.toLowerCase().includes(q));

  const filteredNeo = results.neo
    ? results.neo.filter((n) => !q || n.name.toLowerCase().includes(q))
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
    filteredWeather.length > 0;

  if (!hasResults && q) {
    return (
      <div className="py-24 text-center animate-fade-in">
        <p className="text-sm text-text-muted">
          No results for &quot;{searchQuery}&quot;
        </p>
        <p className="mt-1 text-xs text-text-muted/60">
          Try a different search or clear filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── APOD Hero ── */}
      {showApod && results.apod && (
        <section className="space-y-3">
          <SectionHeader
            icon={<Telescope size={14} />}
            title="Astronomy Picture of the Day"
            tab="apod"
            onNavigate={onNavigate}
          />
          <div
            className="group relative overflow-hidden rounded-2xl glass-card p-0 cursor-pointer"
            onClick={() => onNavigate("apod")}
          >
            {results.apod.media_type === "image" && (
              <div className="relative">
                <img
                  src={results.apod.url}
                  alt={results.apod.title}
                  className="aspect-[21/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#23262A]/80 via-[#23262A]/20 to-transparent" />

                {/* Text content over image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-[#F8F8FF] sm:text-xl">
                    {results.apod.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#F8F8FF]/60">
                    {results.apod.date}
                    {results.apod.copyright && ` · © ${results.apod.copyright}`}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#F8F8FF]/70 max-w-2xl">
                    {results.apod.explanation}
                  </p>
                  {results.apod.hdurl && (
                    <a
                      href={results.apod.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#F8F8FF]/10 px-3 py-1.5 text-xs font-medium text-[#F8F8FF]/80 backdrop-blur-sm transition-colors hover:bg-[#F8F8FF]/20 hover:text-[#F8F8FF]"
                    >
                      View HD <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            )}
            {results.apod.media_type === "video" && (
              <div className="relative">
                {results.apod.url.includes("youtube.com") || results.apod.url.includes("youtu.be") ? (
                  <div className="aspect-[21/9] w-full overflow-hidden">
                    <iframe
                      src={results.apod.url}
                      title={results.apod.title}
                      className="h-full w-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                ) : (
                  <div className="aspect-[21/9] w-full overflow-hidden bg-black">
                    <video
                      src={results.apod.url}
                      controls
                      className="h-full w-full object-contain"
                      preload="metadata"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {/* Text content below video */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-text-primary sm:text-xl">
                    {results.apod.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">
                    {results.apod.date}
                    {results.apod.copyright && ` · © ${results.apod.copyright}`}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-secondary max-w-2xl">
                    {results.apod.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Daily Briefing + Risk Meter row ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <DailyBriefing onNavigate={onNavigate} />
        <SpaceWeatherRiskMeter />
      </div>

      {/* ── Alert Conditions ── */}
      <AlertConditionsPanel
        hazardousNeoCount={
          results.neo?.filter((n: NeoObject) => n.is_potentially_hazardous_asteroid).length ?? 0
        }
        totalNeoCount={results.neo?.length ?? 0}
        flares={flares ?? []}
        storms={storms ?? []}
      />

      {/* Stats */}
      <FeedStats
        neoCount={results.neo?.length ?? 0}
        hazardousCount={
          results.neo?.filter((n: NeoObject) => n.is_potentially_hazardous_asteroid).length ?? 0
        }
        flareCount={results.weather?.length ?? 0}
      />

      {/* ── Space News (articles, blogs, reports) ── */}
      <FeedNewsSection />

      {/* ── NEO Section ── */}
      {filteredNeo.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            icon={<AlertTriangle size={14} />}
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
              const diamMin = neo.estimated_diameter.kilometers.estimated_diameter_min;
              const diamMax = neo.estimated_diameter.kilometers.estimated_diameter_max;
              const missKm = approach
                ? parseFloat(approach.miss_distance.kilometers)
                : 0;
              const isHazardous = neo.is_potentially_hazardous_asteroid;

              return (
                <div
                  key={neo.id}
                  className="group relative overflow-hidden rounded-2xl border border-border/40 bg-bg-card transition-all duration-300 hover:border-border-hover hover:shadow-lg"
                >
                  {/* Visual header with asteroid illustration */}
                  <div
                    className={`relative h-24 overflow-hidden ${
                      isHazardous
                        ? "bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent"
                        : "bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent"
                    }`}
                  >
                    {/* Decorative dots representing the asteroid field */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute left-[15%] top-[20%] h-1.5 w-1.5 rounded-full bg-text-muted/20" />
                      <div className="absolute left-[45%] top-[40%] h-1 w-1 rounded-full bg-text-muted/15" />
                      <div className="absolute left-[70%] top-[25%] h-2 w-2 rounded-full bg-text-muted/20" />
                      <div className="absolute left-[85%] top-[60%] h-1 w-1 rounded-full bg-text-muted/10" />
                      {/* Main asteroid */}
                      <div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-float ${
                          isHazardous ? "bg-red-400/30" : "bg-blue-400/25"
                        }`}
                        style={{
                          width: `${Math.max(24, Math.min(56, diamMax * 100))}px`,
                          height: `${Math.max(24, Math.min(56, diamMax * 100))}px`,
                        }}
                      />
                    </div>
                    {/* Badge */}
                    <div className="absolute right-3 top-3">
                      {isHazardous ? (
                        <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400 backdrop-blur-sm">
                          <AlertTriangle size={8} />
                          Hazardous
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-400 backdrop-blur-sm">
                          <Shield size={8} />
                          Safe
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-text-primary truncate">
                      {neo.name.replace(/[()]/g, "")}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <p className="text-text-muted">Velocity</p>
                        <p className="font-medium text-text-secondary tabular-nums">
                          {formatNumber(velocity)} km/h
                        </p>
                      </div>
                      {approach && (
                        <div>
                          <p className="text-text-muted">Approach</p>
                          <p className="font-medium text-text-secondary">
                            {approach.close_approach_date}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-text-muted">Diameter</p>
                        <p className="font-medium text-text-secondary tabular-nums">
                          {formatNumber(diamMin * 1000)}–{formatNumber(diamMax * 1000)} m
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted">Miss distance</p>
                        <p className="font-medium text-text-secondary tabular-nums">
                          {formatNumber(missKm / 1e6)} M km
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Weather Section ── */}
      {filteredWeather.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            icon={<Sun size={14} />}
            title="Recent Solar Flares"
            count={filteredWeather.length}
            tab="weather"
            onNavigate={onNavigate}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {filteredWeather.slice(0, 6).map((flare: SolarFlare) => {
              const isExtreme = flare.classType.startsWith("X");
              const isStrong = flare.classType.startsWith("M");
              const intensity = isExtreme ? 100 : isStrong ? 65 : 30;

              return (
                <div
                  key={flare.flrID}
                  className="group relative overflow-hidden rounded-2xl border border-border/40 bg-bg-card transition-all duration-300 hover:border-border-hover hover:shadow-lg"
                >
                  {/* Visual header with sun illustration */}
                  <div
                    className={`relative h-24 overflow-hidden ${
                      isExtreme
                        ? "bg-gradient-to-br from-red-500/25 via-orange-400/15 to-yellow-500/10"
                        : isStrong
                          ? "bg-gradient-to-br from-orange-400/20 via-amber-400/15 to-transparent"
                          : "bg-gradient-to-br from-yellow-400/15 via-amber-300/10 to-transparent"
                    }`}
                  >
                    {/* Stylized sun rays */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                          isExtreme ? "bg-red-400/30" : isStrong ? "bg-orange-400/25" : "bg-yellow-400/20"
                        }`}
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse ${
                          isExtreme ? "bg-red-400/15" : isStrong ? "bg-orange-400/12" : "bg-yellow-400/10"
                        }`}
                        style={{ width: "64px", height: "64px" }}
                      />
                      <div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                          isExtreme ? "bg-red-400/8" : isStrong ? "bg-orange-400/6" : "bg-yellow-400/5"
                        }`}
                        style={{ width: "88px", height: "88px" }}
                      />
                    </div>
                    {/* Severity badge */}
                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
                          isExtreme
                            ? "bg-red-500/25 text-red-400"
                            : isStrong
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-yellow-500/15 text-yellow-500"
                        }`}
                      >
                        {isExtreme ? "Extreme" : isStrong ? "Strong" : "Moderate"}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-text-primary">
                        Class {flare.classType}
                      </h3>
                    </div>
                    {/* Intensity bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-text-muted">Intensity</span>
                        <span className="text-text-secondary font-medium">{intensity}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-bg-surface overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isExtreme
                              ? "bg-gradient-to-r from-red-500 to-orange-400"
                              : isStrong
                                ? "bg-gradient-to-r from-orange-400 to-amber-400"
                                : "bg-gradient-to-r from-yellow-400 to-amber-300"
                          }`}
                          style={{ width: `${intensity}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <p className="text-text-muted">Peak</p>
                        <p className="font-medium text-text-secondary">
                          {new Date(flare.peakTime).toLocaleDateString()}
                        </p>
                      </div>
                      {flare.sourceLocation && (
                        <div>
                          <p className="text-text-muted">Source</p>
                          <p className="font-medium text-text-secondary">
                            {flare.sourceLocation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
