"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, ExternalLink, X } from "lucide-react";
import { useApodRange } from "../../hooks/useApod";
import { Loader } from "../ui/Loader";
import type { ApodData } from "../../lib/types";

function getWeekRange(offset: number): { start: string; end: string } {
  const end = new Date();
  end.setDate(end.getDate() - offset * 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ApodGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate?: (date: string) => void;
}

export function ApodGallery({ isOpen, onClose, onSelectDate }: ApodGalleryProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<ApodData | null>(null);

  const range = useMemo(() => getWeekRange(weekOffset), [weekOffset]);
  const { data: images, isLoading } = useApodRange(range.start, range.end);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-bg-primary shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              APOD Gallery
            </h2>
            <p className="text-xs text-text-muted">
              Browse Astronomy Picture of the Day archive
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:text-text-primary"
          >
            <X size={16} />
          </button>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            <ChevronLeft size={14} />
            Older
          </button>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Calendar size={14} />
            {range.start} — {range.end}
          </div>
          <button
            onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
            disabled={weekOffset === 0}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
          >
            Newer
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader text="Loading gallery..." />
            </div>
          ) : selected ? (
            /* Expanded view */
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-primary"
              >
                <ChevronLeft size={12} />
                Back to grid
              </button>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {selected.title}
                </h3>
                <p className="text-xs text-text-muted">
                  {selected.date}
                  {selected.copyright && ` · © ${selected.copyright}`}
                </p>
              </div>
              {selected.media_type === "image" ? (
                <img
                  src={selected.url}
                  alt={selected.title}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <div className="aspect-video overflow-hidden rounded-lg">
                  <iframe
                    src={selected.url}
                    title={selected.title}
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              )}
              <p className="text-sm leading-relaxed text-text-secondary">
                {selected.explanation}
              </p>
              <div className="flex gap-3">
                {selected.hdurl && (
                  <a
                    href={selected.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-primary"
                  >
                    View HD <ExternalLink size={10} />
                  </a>
                )}
                {onSelectDate && (
                  <button
                    onClick={() => {
                      onSelectDate(selected.date);
                      onClose();
                    }}
                    className="text-xs text-text-muted transition-colors hover:text-text-primary"
                  >
                    Open in main view →
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Thumbnail grid */
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images
                ?.slice()
                .reverse()
                .map((apod) => (
                  <button
                    key={apod.date}
                    onClick={() => setSelected(apod)}
                    className="group overflow-hidden rounded-lg border border-border bg-bg-card transition-all hover:border-border-hover"
                  >
                    {apod.media_type === "image" ? (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={apod.url}
                          alt={apod.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-square items-center justify-center bg-bg-card text-text-muted">
                        <span className="text-2xl">▶</span>
                      </div>
                    )}
                    <div className="p-2">
                      <p className="line-clamp-1 text-xs font-medium text-text-primary">
                        {apod.title}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {formatDateShort(apod.date)}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
