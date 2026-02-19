"use client";

import { Search, X, Loader2 } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
  isSearching?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchBar({
  query,
  onQueryChange,
  onSubmit,
  isSearching,
  onFocus,
  onBlur,
}: SearchBarProps) {
  return (
    <div className="relative" role="search">
      <label htmlFor="search-input" className="sr-only">Search across all NASA datasets</label>
      {isSearching ? (
        <Loader2
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted animate-spin"
        />
      ) : (
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
      )}
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        onBlur={() => {
          // Slight delay so clicks on history items register
          setTimeout(() => onBlur?.(), 150);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        placeholder="Search across all NASA datasets..."
        aria-label="Search across all NASA datasets"
        autoComplete="off"
        className="w-full rounded-xl border border-border bg-bg-card py-3 pl-11 pr-10 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
      />
      {query && (
        <button
          onClick={() => onQueryChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
