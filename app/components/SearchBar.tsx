"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useRef } from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
  isSearching?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  size?: "default" | "hero";
}

export function SearchBar({
  query,
  onQueryChange,
  onSubmit,
  isSearching,
  onFocus,
  onBlur,
  size = "default",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isHero = size === "hero";

  return (
    <div className="relative group" role="search">
      <label htmlFor="search-input" className="sr-only">
        Search across all NASA datasets
      </label>

      {/* Icon */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? "" : "text-text-muted group-focus-within:text-accent"}`}>
        {isSearching ? (
          <Loader2 size={isHero ? 18 : 16} className="animate-spin" />
        ) : (
          <Search size={isHero ? 18 : 16} />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        onBlur={() => setTimeout(() => onBlur?.(), 150)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        placeholder="Search across all NASA datasets..."
        aria-label="Search across all NASA datasets"
        autoComplete="off"
        className={`w-full rounded-2xl border border-border/60 bg-bg-card/80 backdrop-blur-sm text-text-primary outline-none transition-all placeholder:text-text-muted/60 focus:border-accent/50 focus:ring-2 focus:ring-accent/10 focus:bg-bg-card ${
          isHero
            ? "py-3.5 pl-12 pr-12 text-base"
            : "py-2.5 pl-10 pr-10 text-sm"
        }`}
      />

      {/* Right section: clear */}
      {query && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          <button
            onClick={() => onQueryChange("")}
            className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-bg-card-hover transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
