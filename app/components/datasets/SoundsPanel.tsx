"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Play, Pause, Music, Download, Volume2 } from "lucide-react";
import { useSpaceSounds } from "../../hooks/useSounds";
import { DataCard } from "../ui/DataCard";
import { Loader, CardSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";

/** Fetches the asset manifest and returns the first playable audio URL. */
async function resolveAudioUrl(manifestUrl: string): Promise<string | null> {
  try {
    const res = await fetch(manifestUrl);
    const urls: string[] = await res.json();
    // Prefer mp3, then wav, then any audio file
    const mp3 = urls.find((u) => u.endsWith(".mp3"));
    if (mp3) return mp3;
    const wav = urls.find((u) => u.endsWith(".wav"));
    if (wav) return wav;
    const audio = urls.find((u) =>
      /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(u)
    );
    return audio ?? null;
  } catch {
    return null;
  }
}

function SoundCard({
  item,
  isPlaying,
  onPlay,
  onPause,
}: {
  item: {
    data: { nasa_id: string; title: string; description?: string; date_created: string; center?: string; keywords?: string[] }[];
    href: string;
  };
  isPlaying: boolean;
  onPlay: (nasaId: string, manifestUrl: string) => void;
  onPause: () => void;
}) {
  const meta = item.data?.[0];
  if (!meta) return null;

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const url = await resolveAudioUrl(item.href);
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${meta.title.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 50)}.mp3`;
      a.target = "_blank";
      a.click();
    }
    setDownloading(false);
  };

  return (
    <DataCard>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
            <Music size={18} className="text-text-secondary" />
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => (isPlaying ? onPause() : onPlay(meta.nasa_id, item.href))}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              isPlaying
                ? "border-accent bg-accent text-accent-text"
                : "border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
            }`}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary active:scale-95 disabled:opacity-40"
          >
            <Download size={12} />
            {downloading ? "..." : "Download"}
          </button>
        </div>
      </div>
    </DataCard>
  );
}

export function SoundsPanel() {
  const [query, setQuery] = useState("sounds");
  const [committedQuery, setCommittedQuery] = useState("sounds");
  const [page, setPage] = useState(1);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setPlayingId(null);
  }, []);

  const playAudio = useCallback(
    async (nasaId: string, manifestUrl: string) => {
      // Stop current audio
      stopAudio();
      setLoadingAudio(true);

      const url = await resolveAudioUrl(manifestUrl);
      if (!url) {
        setLoadingAudio(false);
        return;
      }

      const audio = new Audio(url);
      audio.volume = 0.7;
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingId(null);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setPlayingId(null);
        audioRef.current = null;
      };

      try {
        await audio.play();
        setPlayingId(nasaId);
      } catch {
        // autoplay blocked or network error
      }
      setLoadingAudio(false);
    },
    [stopAudio]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

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

      {/* Now Playing indicator */}
      {playingId && (
        <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-3 py-2">
          <Volume2 size={14} className="text-text-primary animate-pulse" />
          <span className="text-xs text-text-secondary">Now playing...</span>
          <button
            onClick={stopAudio}
            className="ml-auto text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Stop
          </button>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2 max-w-lg">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Voyager, Saturn, plasma, radio..."
            className="w-full rounded-xl border border-border bg-bg-card py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
          />
        </div>
        <button
          onClick={handleSearch}
          className="flex items-center gap-1.5 rounded-xl border border-accent bg-accent px-3 py-2 text-sm font-medium text-accent-text transition-all hover:opacity-80 active:scale-95"
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
                <SoundCard
                  key={meta.nasa_id}
                  item={item as never}
                  isPlaying={playingId === meta.nasa_id}
                  onPlay={playAudio}
                  onPause={stopAudio}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => { stopAudio(); setPage((p) => Math.max(1, p - 1)); }}
              disabled={page <= 1}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40"
            >
              &larr; Previous
            </button>
            <span className="text-xs text-text-muted">Page {page}</span>
            <button
              onClick={() => { stopAudio(); setPage((p) => p + 1); }}
              disabled={items.length < 24}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40"
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
