"use client";

import { useState } from "react";
import { RefreshCw, ExternalLink, Grid } from "lucide-react";
import { useApod } from "../../hooks/useApod";
import { DataCard } from "../ui/DataCard";
import { Loader } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";
import { ApodGallery } from "../details/ApodGallery";

export function ApodPanel() {
  const [date, setDate] = useState<string>("");
  const [showGallery, setShowGallery] = useState(false);
  const { data, isLoading, error, refetch, isFetching } = useApod(
    date || undefined
  );

  if (isLoading) return <Loader text="Loading today's astronomy picture..." />;
  if (error)
    return (
      <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
    );
  if (!data) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          min="1995-06-16"
          className="rounded-xl border border-border/60 bg-bg-card/80 px-3 py-2 text-sm text-text-primary outline-none transition-all focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
        />
        <button
          onClick={() => {
            setDate("");
            refetch();
          }}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm text-text-secondary transition-all hover:border-border-hover hover:text-text-primary active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Today
        </button>
        <button
          onClick={() => setShowGallery(true)}
          className="flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm text-text-secondary transition-all hover:border-border-hover hover:text-text-primary active:scale-95"
        >
          <Grid size={14} />
          Gallery
        </button>
      </div>

      {/* Content */}
      <DataCard>
        <div className="space-y-5">
          {/* Title & Date */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {data.title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {data.date}
              {data.copyright && ` · © ${data.copyright}`}
            </p>
          </div>

          {/* Media */}
          {data.media_type === "image" ? (
            <div className="overflow-hidden rounded-xl">
              <img
                src={data.url}
                alt={data.title}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-video overflow-hidden rounded-xl">
              <iframe
                src={data.url}
                title={data.title}
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          )}

          {/* Explanation */}
          <p className="text-sm leading-relaxed text-text-secondary">
            {data.explanation}
          </p>

          {/* HD Link */}
          {data.hdurl && (
            <a
              href={data.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-all hover:opacity-80"
            >
              View HD
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </DataCard>

      {/* Gallery */}
      <ApodGallery
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        onSelectDate={(d) => setDate(d)}
      />
    </div>
  );
}
