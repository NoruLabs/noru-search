"use client";

import { useState } from "react";
import { Search, Image as ImageIcon } from "lucide-react";
import { useNasaMedia } from "../hooks/useNasaMedia";
import { DataCard } from "../components/ui/DataCard";
import { ErrorState } from "../components/ui/ErrorState";

export function NasaMediaPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [itemsToShow, setItemsToShow] = useState(8);
  const { data, isLoading, error } = useNasaMedia(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setItemsToShow(8); // Reset pagination on new search
  };

  const displayItems = data ? data.slice(0, itemsToShow) : [];
  const hasMore = data ? itemsToShow < data.length : false;

  const handleLoadMore = () => {
    if (data) setItemsToShow(prev => Math.min(prev + 8, data.length));
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-text-primary">
          <div className="bg-bg-card p-1.5 rounded-md">
            <ImageIcon size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">NASA Image and Video Library</h1>
            <p className="text-xs text-text-muted">Search millions of photos from NASA</p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for moon, apollo, mars..."
            className="w-full bg-bg-card border border-border text-text-primary placeholder:text-text-muted rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-shadow"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </form>
      </div>

      {/* Error state */}
      {error && <ErrorState message={error.message} />}

      {/* No results state */}
      {!isLoading && !error && data && data.length === 0 && searchTerm !== "" && (
        <div className="text-center py-12 text-text-muted text-sm glass-card rounded-xl">
          No images found for "{searchTerm}". Try another cosmic keyword.
        </div>
      )}

      {!isLoading && !error && data && data.length === 0 && searchTerm === "" && (
        <div className="text-center py-12 text-text-muted text-sm glass-card rounded-xl">
          No recent images found. Try searching for a specific term like mars or apollo.
        </div>
      )}

      {/* Results Gallery (Pinterest / Google Images style) */}
      {!isLoading && data && data.length > 0 && (
        <>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {displayItems.map((item) => (
              <DataCard
                key={item.nasa_id}
                className="!p-3 flex flex-col group hover:border-accent/40 h-full"
                onClick={() => window.open(`https://images.nasa.gov/details-${item.nasa_id}`, "_blank")}
              >
                <div className="overflow-hidden rounded-lg mb-3 flex-grow bg-black aspect-[4/3] flex">
                  {item.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover self-center"
                      loading="lazy"
                    />
                  )}
                </div>
                <h3 className="font-bold text-sm text-text-primary line-clamp-2 mt-auto">{item.title}</h3>
                <p className="text-[10px] text-text-muted mt-2">
                  {new Date(item.date_created).toLocaleDateString()}
                </p>
              </DataCard>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6 pt-4">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-bg-card hover:bg-bg-hover text-text-primary border border-border rounded-lg text-sm font-medium transition-colors"
              >
                ↓
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

