"use client";

import { useState } from "react";
import { Search, Image as ImageIcon, Video, ExternalLink } from "lucide-react";
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

  const { data, isLoading, error, refetch } = useNasaMedia(committedQuery, {
    mediaType,
    page,
  });

  const items = data?.collection?.items ?? [];
  const totalHits = data?.collection?.metadata?.total_hits ?? 0;

  const handleSearch = () => {
    if (query.trim()) {
      setCommittedQuery(query.trim());
      setPage(1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Search input */}
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs text-text-muted">Search NASA Media</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Hubble, Artemis, Apollo, galaxies..."
              className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              <Search size={14} />
              Search
            </button>
          </div>
        </div>

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
