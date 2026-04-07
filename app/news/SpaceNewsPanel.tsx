"use client";

import { useState } from "react";
import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { useSpaceNews } from "../hooks/useSpaceNews";
import { ErrorState } from "../components/ui/ErrorState";
import { DataCard } from "../components/ui/DataCard";
import type { SpaceNewsBase } from "../lib/types";

interface SpaceNewsPanelProps {
  limit?: number;
  showViewAll?: boolean;
  layout?: "grid" | "compact";
}

export function SpaceNewsPanel({ limit = 6, showViewAll = false, layout = "grid" }: SpaceNewsPanelProps) {
  const { data, isLoading, error } = useSpaceNews();
  const [itemsToShow, setItemsToShow] = useState(limit);

  if (isLoading) return null;
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

<div className={layout === "compact" ? "flex flex-col gap-4 mt-3 h-full" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3"}>
        {displayItems.map((item) => (
          <DataCard
            key={`${item._type}-${item.id}`}
            onClick={() => window.open(item.url, "_blank")}
            className={layout === "compact" ? "flex-1 flex flex-col p-4" : ""}
          >
            {item.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={item.image_url} 
                alt="" 
                className={`w-full object-cover mb-3 rounded-xl ${layout === "compact" ? "h-32 lg:h-36" : "h-40"}`} 
              />
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
                {new Date(item.published_at).toLocaleDateString()} {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}   
              </div>
            </div>
          </DataCard>
        ))}
      </div>

      {!showViewAll && hasMore && (
        <div className="flex justify-center mt-6 pt-4">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-bg-card hover:bg-bg-hover text-text-primary border border-border rounded-lg text-sm font-medium transition-colors"
          >
            ?
          </button>
        </div>
      )}
    </section>
  );
}

