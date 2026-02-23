"use client";

import {
  Telescope,
  AlertTriangle,
  Shield,
  ExternalLink,
  Camera,
  Sun,
  ArrowRight,
  Newspaper,
  FileText,
} from "lucide-react";
import { useFeed } from "../../hooks/useFeed";
import { useSpaceNews } from "../../hooks/useSpaceNews";
import { DataCard } from "../ui/DataCard";
import { FeedSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { FeedStats } from "../ui/StatsBar";
import type {
  DatasetTab,
  NeoObject,
  MarsPhoto,
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

function NewsArticleCard({
  item,
  variant,
}: {
  item: SpaceNewsArticle;
  variant: "hero" | "card";
}) {
  const href = item.url;
  const img = item.image_url;
  const isHero = variant === "hero";

  if (isHero) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-2xl glass-card p-0"
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          {img ? (
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-bg-card" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#23262A]/80 via-[#23262A]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-xs font-medium text-[#F8F8FF]/60">{item.news_site}</p>
            <h2 className="mt-1 text-lg font-semibold text-[#F8F8FF] sm:text-xl line-clamp-2">
              {item.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-[#F8F8FF]/70">{item.summary}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#F8F8FF]/80">
              Read article <ExternalLink size={10} />
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <DataCard accentColor="var(--accent)" className="h-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col"
      >
        {img && (
          <div className="relative -mx-5 -mt-5 mb-3 aspect-video overflow-hidden rounded-t-xl">
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col">
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {item.news_site}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-text-primary group-hover:underline">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs text-text-secondary">{item.summary}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-[11px] text-text-muted">{formatNewsDate(item.published_at)}</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-text-primary">
              Read more <ExternalLink size={10} />
            </span>
          </div>
        </div>
      </a>
    </DataCard>
  );
}

function NewsSidebarItem({
  item,
  type,
}: {
  item: SpaceNewsBlog | SpaceNewsReport;
  type: "blog" | "report";
}) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:border-border-hover hover:bg-bg-card"
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt=""
          className="h-14 w-20 shrink-0 rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
          {type === "blog" ? (
            <Newspaper size={18} className="text-text-muted" />
          ) : (
            <FileText size={18} className="text-text-muted" />
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-text-muted">{item.news_site}</p>
        <h4 className="mt-0.5 line-clamp-2 text-xs font-semibold text-text-primary group-hover:underline">
          {item.title}
        </h4>
        <p className="text-[11px] text-text-muted">{formatNewsDate(item.published_at)}</p>
      </div>
      <ExternalLink size={12} className="shrink-0 text-text-muted group-hover:text-text-primary" />
    </a>
  );
}

function FeedNewsSection() {
  const { data, isLoading, error, refetch } = useSpaceNews();

  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-text-muted">
            <Newspaper size={14} />
          </div>
          <h2 className="text-sm font-semibold text-text-primary">Space News</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl skeleton" />
          ))}
        </div>
      </section>
    );
  }

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

  if (!data) return null;

  const { articles, blogs, reports } = data;
  const heroItems = articles.slice(0, 3);
  const gridItems = articles.slice(3, 10);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-text-muted">
          <Newspaper size={14} />
        </div>
        <h2 className="text-sm font-semibold text-text-primary">Space News</h2>
      </div>

      {heroItems.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {heroItems.map((article) => (
            <NewsArticleCard key={article.id} item={article} variant="hero" />
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4 sm:grid-cols-2 stagger-children">
          {gridItems.map((article) => (
            <NewsArticleCard key={article.id} item={article} variant="card" />
          ))}
        </div>
        <aside className="space-y-4">
          {blogs.length > 0 && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <Newspaper size={12} />
                Latest blogs
              </h3>
              {blogs.map((blog) => (
                <NewsSidebarItem key={blog.id} item={blog} type="blog" />
              ))}
            </div>
          )}
          {reports.length > 0 && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <FileText size={12} />
                Reports
              </h3>
              {reports.map((report) => (
                <NewsSidebarItem key={report.id} item={report} type="report" />
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
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
      {/* Stats */}
      <FeedStats
        neoCount={results.neo?.length ?? 0}
        hazardousCount={
          results.neo?.filter((n: NeoObject) => n.is_potentially_hazardous_asteroid).length ?? 0
        }
        flareCount={results.weather?.length ?? 0}
        marsCount={results.mars?.length ?? 0}
      />

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
            {results.apod.media_type !== "image" && (
              <div className="p-6">
                <h3 className="text-base font-semibold text-text-primary">
                  {results.apod.title}
                </h3>
                <p className="mt-1 text-xs text-text-muted">
                  {results.apod.date}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-text-secondary">
                  {results.apod.explanation}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

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
              return (
                <DataCard key={neo.id} accentColor="var(--accent)">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-semibold text-text-primary truncate">
                        {neo.name.replace(/[()]/g, "")}
                      </h3>
                      {neo.is_potentially_hazardous_asteroid ? (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-text-primary">
                          <AlertTriangle size={8} />
                          Hazardous
                        </span>
                      ) : (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-text-muted">
                          <Shield size={8} />
                          Safe
                        </span>
                      )}
                    </div>
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
                    </div>
                  </div>
                </DataCard>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Mars Section ── */}
      {filteredMars.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            icon={<Camera size={14} />}
            title="Mars Rover Photos"
            count={filteredMars.length}
            tab="mars"
            onNavigate={onNavigate}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 stagger-children">
            {filteredMars.slice(0, 6).map((photo: MarsPhoto) => (
              <DataCard key={photo.id} className="overflow-hidden p-0" accentColor="var(--accent)">
                <a
                  href={photo.img_src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={photo.img_src}
                      alt={`Mars - ${photo.camera.full_name}`}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </a>
                <div className="p-3">
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
            {filteredWeather.slice(0, 6).map((flare: SolarFlare) => (
              <DataCard key={flare.flrID} accentColor="var(--accent)">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xs font-semibold text-text-primary">
                      Class {flare.classType}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
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
              </DataCard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
