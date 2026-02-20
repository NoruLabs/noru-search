"use client";

import { useState } from "react";
import { Search, Play, Music, ExternalLink } from "lucide-react";
import { useSpaceSounds } from "../../hooks/useSounds";
import { DataCard } from "../ui/DataCard";
import { Loader, CardSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";

export function SoundsPanel() {
  const [query, setQuery] = useState("sounds");
  const [committedQuery, setCommittedQuery] = useState("sounds");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useSpaceSounds(
    committedQuery,
    page
  );

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
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Sounds of Space
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Audio recordings from space: Voyager plasma waves, Cassini Saturn sounds, and more
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-2 max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Voyager, Saturn, plasma, radio..."
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

      {!isLoading && totalHits > 0 && (
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-text-primary">
            {totalHits.toLocaleString()}
          </span>{" "}
          audio results for &ldquo;{committedQuery}&rdquo;
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <Music size={32} className="mx-auto mb-3 text-text-muted opacity-40" />
          <p className="text-sm text-text-muted">
            No audio found for &ldquo;{committedQuery}&rdquo;
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Try &quot;Voyager&quot;, &quot;Saturn&quot;, or &quot;radio&quot;
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {items.map((item) => {
              const meta = item.data?.[0];
              if (!meta) return null;

              return (
                <DataCard key={meta.nasa_id}>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        <Music size={18} className="text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-text-primary line-clamp-2">
                          {meta.title}
                        </h3>
                        <p className="text-[10px] text-text-muted">
                          {new Date(meta.date_created).toLocaleDateString()}
                          {meta.center && ` · ${meta.center}`}
                        </p>
                      </div>
                    </div>

                    {meta.description && (
                      <p className="text-xs text-text-secondary line-clamp-3">
                        {meta.description}
                      </p>
                    )}

                    {meta.keywords && meta.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meta.keywords.slice(0, 4).map((kw) => (
                          <span
                            key={kw}
                            className="rounded-full bg-bg-card px-2 py-0.5 text-[10px] text-text-muted"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-primary"
                    >
                      <Play size={12} />
                      Listen / Download
                      <ExternalLink size={10} />
                    </a>
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
