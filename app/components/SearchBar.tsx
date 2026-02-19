"use client";

import { Search, X } from "lucide-react";
import type { DatasetTab } from "../lib/types";
import { TAB_CONFIG } from "../lib/constants";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeFilters: DatasetTab[];
  onToggleFilter: (tab: DatasetTab) => void;
}

export function SearchBar({
  query,
  onQueryChange,
  activeFilters,
  onToggleFilter,
}: SearchBarProps) {
  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search space data..."
          className="w-full rounded-xl border border-border bg-bg-card py-3 pl-11 pr-10 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2">
        {TAB_CONFIG.map((tab) => {
          const isActive = activeFilters.includes(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => onToggleFilter(tab.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent text-accent-text"
                  : "border-border text-text-muted hover:border-border-hover hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
