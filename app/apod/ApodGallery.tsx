"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, ExternalLink } from "lucide-react";
import { useApodRange } from "../hooks/useApod";
import { DataCard } from "../components/ui/DataCard";
import { Modal } from "../components/ui/Modal";
import type { ApodData } from "../lib/types";

function getRange(totalDays: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - totalDays + 1);
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
  onSelectDate?: (date: string) => void;
}

export function ApodGallery({ onSelectDate }: ApodGalleryProps) {
  const [daysLoaded, setDaysLoaded] = useState(7);
  const [selected, setSelected] = useState<ApodData | null>(null);

  const range = useMemo(() => getRange(daysLoaded), [daysLoaded]);
  const { data: images, isLoading, isFetching } = useApodRange(range.start, range.end);

  return (
    <DataCard className="flex flex-col p-0 overflow-hidden">
        {/* Title Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
            <div>
              <h3 className="font-bold text-base text-text-primary">Apod Gallery</h3>
              <p className="text-xs text-text-muted mt-0.5">{daysLoaded} days of cosmic history</p>
            </div>
            {(isLoading || isFetching) && (
              <div className="w-4 h-4 rounded-full border-2 border-accent border-r-transparent animate-spin" />
            )}
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? null : (
            /* Thumbnail list */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images
                ?.slice()
                .reverse()
                .map((apod) => (
                  <button
                    key={apod.date}
                    onClick={() => setSelected(apod)}
                    className="group overflow-hidden relative rounded-lg border border-border bg-bg-card transition-all hover:border-border-hover hover:ring-2 hover:ring-accent"
                  >
                    {apod.media_type === "image" ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={apod.url}
                          alt={apod.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : apod.url.includes("youtube.com") || apod.url.includes("youtu.be") ? (
                      (() => {
                        const ytMatch = apod.url.match(/embed\/([^?&"'>/]+)/);
                        const thumb = apod.thumbnail_url ||
                          (ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : undefined);
                        return thumb ? (
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={thumb}
                              alt={apod.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-video items-center justify-center bg-bg-card/50 text-text-muted group-hover:bg-bg-card transition-colors">
                            <span className="text-xs">Video content</span>
                          </div>
                        );
                      })()
                    ) : (
                      /* Direct video (mp4 etc) */
                      <div className="relative aspect-video overflow-hidden bg-black">
                        <video
                          src={apod.url}
                          className="h-full w-full object-cover"
                          preload="none"
                          poster={apod.thumbnail_url}
                          muted
                        />
                      </div>
                    )}
                    <div className="p-3 text-left">
                      <p className="line-clamp-1 text-sm font-medium text-text-primary">
                        {apod.title}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {formatDateShort(apod.date)}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          )}
          
          {/* Load More Button */}
          {!isLoading && images && (
            <div className="mt-6 flex justify-center pb-2">
              <button
                onClick={() => setDaysLoaded((prev) => prev + 7)}
                disabled={isFetching}
                className="rounded-xl border border-border bg-bg-card px-6 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent hover:text-accent active:scale-95 disabled:opacity-50"
              >
                {isFetching ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>

        {/* Modal for Expanded View */}
        <Modal 
          isOpen={!!selected} 
          onClose={() => setSelected(null)}
          title={selected?.title}
          size="xl"
        >
          {selected && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-text-muted px-4">
                {selected.date}
                {selected.copyright && <> &middot; &copy; {selected.copyright}</>}
              </p>
              
              {selected.media_type === "image" ? (
                <div className="flex w-full justify-center bg-black/5 rounded-lg">
                  <img
                    src={selected.url}
                    alt={selected.title}
                    className="max-w-full rounded-lg object-contain"
                    style={{ maxHeight: '55vh' }}
                  />
                </div>
              ) : selected.url.includes("youtube.com") || selected.url.includes("youtu.be") ? (
                <div className="flex w-full justify-center">
                  <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-lg bg-black">
                    <iframe
                      src={selected.url}
                      title={selected.title}
                      className="h-full w-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex w-full justify-center flex-col items-center">
                  <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-black">
                    <video
                      src={selected.url}
                      controls
                      className="w-full max-h-[55vh]"
                      preload="metadata"
                      poster={selected.thumbnail_url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
              <p className="text-sm leading-relaxed text-text-secondary mt-4 px-4 text-justify sm:text-left">
                {selected.explanation}
              </p>
              <div className="flex gap-3 pt-2 px-4 pb-4">
                {selected.hdurl && (
                  <a
                    href={selected.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-4 py-2 text-sm font-medium text-accent transition-all hover:opacity-80"
                  >
                    View Full HD <ExternalLink size={14} />
                  </a>
                )}
                {onSelectDate && (
                  <button
                    onClick={() => {
                      onSelectDate(selected.date);
                      setSelected(null);
                    }}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
                  >
                    Open in Main Panel
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>
    </DataCard>
  );
}

