"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, ArrowRight } from "lucide-react";
import { useSpaceNews } from "../hooks/useSpaceNews";
import { ErrorState } from "../components/ui/ErrorState";
import { DataCard } from "../components/ui/DataCard";
import type { SpaceNewsBase } from "../lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselItem,
} from "../components/ui/carousel";

interface SpaceNewsPanelProps {
  limit?: number;
  showViewAll?: boolean;
  layout?: "grid" | "compact" | "carousel";
}

export function SpaceNewsPanel({ limit = 6, showViewAll = false, layout = "grid" }: SpaceNewsPanelProps) {
  const { data, isLoading, error } = useSpaceNews();
  const [itemsToShow, setItemsToShow] = useState(limit);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-primary">
            <div className="bg-bg-card p-1.5 rounded-md">
              <Newspaper size={16} className="text-text-secondary" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide">Latest Spaceflight News</h2>
          </div>
        </div>
        <div className={layout === "compact" ? "flex flex-col gap-4 mt-3 h-full" : layout === "carousel" ? "flex gap-4 overflow-hidden mt-3 h-[280px]" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3"}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex flex-col h-full bg-bg-card/40 rounded-xl p-4 animate-pulse ${layout === 'carousel' ? `w-full md:w-1/2 lg:w-1/3 shrink-0 ${i > 1 ? 'hidden md:flex' : 'flex'} ${i > 2 ? 'lg:flex hidden' : ''}` : ''}`}>
              <div className={`w-full bg-border/20 rounded-xl mb-3 shrink-0 ${layout === "compact" ? "h-32 lg:h-36" : "h-40"}`} />
              <div className="h-4 w-16 bg-border/20 rounded-full mb-3" />
              <div className="h-4 w-3/4 bg-border/20 rounded mb-2" />
              <div className="h-4 w-full bg-border/20 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) return <ErrorState message={error.message} />;

  if (!data || (data.articles.length === 0 && data.blogs.length === 0 && data.reports.length === 0)) {
    return <ErrorState message="No recent space news found." />;
  }

  // Combine and sort all items (articles, blogs, reports) from newest to oldest
  const allItems: (SpaceNewsBase & { _type: string })[] = [
    ...data.articles.map(a => ({ ...a, _type: 'Article' })),
    ...data.blogs.map(b => ({ ...b, _type: 'Blog' })),
    ...data.reports.map(r => ({ ...r, _type: 'Report' })),
  ].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  const displayItems = allItems.slice(0, itemsToShow);
  const hasMore = itemsToShow < allItems.length;

  const handleLoadMore = () => {
    setItemsToShow(prev => Math.min(prev + 6, allItems.length));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-primary">
          <div className="bg-bg-card p-1.5 rounded-md">
            <Newspaper size={16} className="text-text-secondary" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide">Latest Spaceflight News</h2>
        </div>

        {showViewAll && (
          <Link
            href="/news"
            className="group flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            View all
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

<div className={layout === "compact" ? "flex flex-col gap-4 mt-3 h-full" : layout === "carousel" ? "relative w-full mt-3 block" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3"}>
        {layout === "carousel" ? (
          <div className="relative w-full overflow-visible">
            <Carousel disableDrag>
              <CarouselContent className="pb-4 pt-2 -ml-4 flex" transition={{ type: "spring", stiffness: 250, damping: 30, mass: 1 }}>
                {displayItems.map((item) => (
                  <CarouselItem key={`carousel-${item._type}-${item.id}`} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                    <DataCard
                      onClick={() => window.open(item.url, "_blank")}
                      className="flex flex-col h-full bg-bg-card p-4 cursor-pointer"
                    >
                      {item.image_url && (
                        <div className="w-full h-40 overflow-hidden rounded-xl mb-3 relative">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between gap-2 mb-2">    
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                            {item._type}
                          </span>
                          <span className="text-[10px] text-text-muted opacity-80">{item.news_site}</span>
                        </div>
                        <h3 className="font-bold text-sm line-clamp-2">{item.title}</h3>
                        <p className="text-sm mt-2 line-clamp-3 text-text-muted flex-1">{item.summary}</p>
                        <div className="opacity-50 text-[10px] mt-auto pt-2 border-t border-border/50">
                          {new Date(item.published_at).toLocaleDateString(undefined, { timeZone: 'UTC' })} {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                        </div>
                      </div>
                    </DataCard>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNavigation
                className="relative top-auto left-auto translate-y-0 w-full mt-4 flex items-center justify-center gap-4 pointer-events-none"
                classNameButton="pointer-events-auto bg-zinc-800 *:stroke-white hover:bg-zinc-700 dark:bg-zinc-200 dark:*:stroke-zinc-800"
                alwaysShow={true}
              />
            </Carousel>
          </div>
        ) : (
          displayItems.map((item) => (
          <DataCard
            key={`${item._type}-${item.id}`}
            onClick={() => window.open(item.url, "_blank")}
            className={layout === "compact" ? "flex-1 flex flex-col p-4" : ""}
          >
            {item.image_url && (
              <div className={`relative w-full mb-3 rounded-xl overflow-hidden ${layout === "compact" ? "h-32 lg:h-36" : "h-40"}`}>
                <Image 
                  src={item.image_url} 
                  alt={item.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover" 
                />
              </div>
            )}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between gap-2 mb-2">      
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                  {item._type}
                </span>
                <span className="text-[10px] text-text-muted opacity-80">{item.news_site}</span>
              </div>
              <h3 className={`font-bold ${layout === "compact" ? "text-sm line-clamp-2" : "line-clamp-2"}`}>{item.title}</h3>
              {layout !== "compact" && (
                 <p className="text-sm mt-2 line-clamp-3 text-text-muted flex-1">{item.summary}</p>
              )}
              <div className={`opacity-50 text-[10px] ${layout === "compact" ? "mt-auto pt-2" : "mt-2 pt-2"}`}>
                {new Date(item.published_at).toLocaleDateString(undefined, { timeZone: 'UTC' })} {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
              </div>
            </div>
          </DataCard>
        )))}
      </div>

      {!showViewAll && hasMore && (
        <div className="flex justify-center mt-6 pt-4">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-bg-card hover:bg-bg-hover text-text-primary border border-border rounded-lg text-sm font-medium transition-colors"
          >
            ↓
          </button>
        </div>
      )}
    </section>
  );
}

