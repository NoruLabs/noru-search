"use client";

import Link from "next/link";
import { Telescope, ArrowRight, ExternalLink } from "lucide-react";
import { useApod } from "../hooks/useApod";
import { ErrorState } from "../components/ui/ErrorState";

export function ApodPreview() {
  const { data, isLoading, error } = useApod();

  if (isLoading) return null;
  if (error) return <ErrorState message={error.message} />;
  if (!data) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-primary">
          <div className="bg-bg-card p-1.5 rounded-md">
            <Telescope size={16} className="text-text-secondary" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide">Astronomy Picture of the Day</h2>
        </div>
        <Link
          href="/apod"
          className="group flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          View all
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="relative group block overflow-hidden rounded-2xl glass-card mt-3 aspect-video md:aspect-[21/9]">
        {/* Link that covers the card to navigate */}
        <Link href="/apod" className="absolute inset-0 z-10" aria-label="View APOD details" />
        
        <div className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none z-0">
          {data.media_type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.url}
              alt={data.title}
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
          ) : data.url.includes("youtube.com") || data.url.includes("youtu.be") ? (
            <iframe
              src={data.url.replace("?rel=0", "") + (data.url.includes("?") ? "&" : "?") + "autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&loop=1"}
              title={data.title}
              className="absolute text-transparent inset-0 h-full w-[150%] md:w-[120%] -ml-[25%] md:-ml-[10%] object-cover scale-150 opacity-75 pointer-events-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              src={data.url}
              className="absolute inset-0 h-full w-full object-cover opacity-75"
              autoPlay
              loop
              muted
              playsInline
              poster={data.thumbnail_url}
            />
          )}
        </div>

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 md:via-black/20 to-transparent pointer-events-none z-0" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full md:w-3/4 lg:w-2/3 z-20 flex flex-col items-start pointer-events-none">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {data.title}
          </h3>
          <p className="text-xs text-gray-300 mb-3 drop-shadow-md">
            {data.date} {data.copyright ? `ï¿½ ï¿½ ${data.copyright}` : ''}
          </p>
          <p className="text-sm text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed mb-4 drop-shadow-md">
            {data.explanation}
          </p>
          <a 
            href={data.hdurl || data.url} 
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-xs font-medium text-white transition-colors backdrop-blur-md"
          >
            View HD <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}

