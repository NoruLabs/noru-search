"use client";

import { useState } from "react";
import { Search, Image as ImageIcon, Video, Filter, X } from "lucide-react";
import { useNasaMedia } from "../../hooks/useNasaMedia";
import { DataCard } from "../ui/DataCard";
import { Loader, CardSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";

type MediaFilter = "image" | "video";

export function MediaPanel() {
  const [query, setQuery] = useState("Hubble");
  const [committedQuery, setCommittedQuery] = useState("Hubble");
  const [mediaType, setMediaType] = useState<MediaFilter>("image");
  const [page, setPage] = useState(1);
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [committedYearStart, setCommittedYearStart] = useState("");
  const [committedYearEnd, setCommittedYearEnd] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error, refetch } = useNasaMedia(committedQuery, {
    mediaType,
    page,
    yearStart: committedYearStart || undefined,
    yearEnd: committedYearEnd || undefined,
  });

  const items = data?.collection?.items ?? [];
  const totalHits = data?.collection?.metadata?.total_hits ?? 0;

  const handleSearch = () => {
    if (query.trim()) {
      setCommittedQuery(query.trim());
      setCommittedYearStart(yearStart);
      setCommittedYearEnd(yearEnd);
      setPage(1);
    }
  };

  const clearFilters = () => {
    setYearStart("");
    setYearEnd("");
    setCommittedYearStart("");
    setCommittedYearEnd("");
    setPage(1);
  };

  const hasActiveFilters = committedYearStart || committedYearEnd;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          NASA Media Library
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Search NASA&rsquo;s vast image and video library — from Hubble deep fields to Artemis launches
        </p>
      </div>

      {/* Search + Controls */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Hubble, Artemis, Apollo, galaxies, nebula..."
              className="w-full rounded-xl border border-border bg-bg-card py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
            />
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-all ${
              showFilters || hasActiveFilters
                ? "border-accent bg-accent-soft text-text-primary"
                : "border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
            }`}
          >
            <Filter size={14} />
            Filters
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-text">
                !
              </span>
            )}
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 rounded-xl border border-accent bg-accent px-4 py-2 text-sm font-medium text-accent-text transition-all hover:opacity-80 active:scale-95"
          >
            Search
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-bg-card p-3">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-text-muted">
                Year from
              </label>
              <input
                type="number"
                min="1920"
                max={new Date().getFullYear()}
                value={yearStart}
                onChange={(e) => setYearStart(e.target.value)}
                placeholder="1960"
                className="w-24 rounded-lg border border-border bg-bg-primary px-2 py-1.5 text-sm text-text-primary outline-none focus:border-accent/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-text-muted">
                Year to
              </label>
              <input
                type="number"
                min="1920"
                max={new Date().getFullYear()}
                value={yearEnd}
                onChange={(e) => setYearEnd(e.target.value)}
                placeholder={new Date().getFullYear().toString()}
                className="w-24 rounded-lg border border-border bg-bg-primary px-2 py-1.5 text-sm text-text-primary outline-none focus:border-accent/40"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        )}

        {/* Media type toggle */}
        <div className="flex gap-2">
          {(
            [
              { id: "image", label: "Images", icon: <ImageIcon size={14} /> },
              { id: "video", label: "Videos", icon: <Video size={14} /> },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setMediaType(opt.id);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                mediaType === opt.id
                  ? "border-accent bg-accent text-accent-text"
                  : "border-border text-text-muted hover:text-text-secondary"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results info */}
      {!isLoading && totalHits > 0 && (
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-text-primary">
            {totalHits.toLocaleString()}
          </span>{" "}
          results for &ldquo;{committedQuery}&rdquo;
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-text-muted">
            No {mediaType}s found for &ldquo;{committedQuery}&rdquo;
          </p>
        </div>
      ) : (
        <>
          <div
            className={
              mediaType === "image"
                ? "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 stagger-children"
                : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children"
            }
          >
            {items.map((item) => {
              const meta = item.data?.[0];
              const thumb = item.links?.[0]?.href;
              if (!meta) return null;

              return (
                <DataCard
                  key={meta.nasa_id}
                  className="overflow-hidden p-0"
                >
                  {mediaType === "image" && thumb && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={thumb}
                        alt={meta.title}
                        className="aspect-square w-full object-cover"
                        loading="lazy"
                      />
                    </a>
                  )}
                  {mediaType === "video" && thumb && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={thumb}
                        alt={meta.title}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    </a>
                  )}
                  <div className="p-3 space-y-1">
                    <h3 className="text-xs font-semibold text-text-primary line-clamp-2">
                      {meta.title}
                    </h3>
                    <p className="text-[10px] text-text-muted">
                      {new Date(meta.date_created).toLocaleDateString()}
                      {meta.center && ` · ${meta.center}`}
                    </p>
                    {meta.description && (
                      <p className="text-[11px] text-text-secondary line-clamp-2">
                        {meta.description}
                      </p>
                    )}
                  </div>
                </DataCard>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40"
            >
              ← Previous
            </button>
            <span className="text-xs text-text-muted">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={items.length < 24}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
