"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bookmark,
  BookmarkPlus,
  Play,
  Trash2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  getSavedSearches,
  addSavedSearch,
  removeSavedSearch,
  type SavedSearch,
} from "../../lib/storage";
import { formatRelativeTime } from "../../lib/scoring";
import type { DatasetTab } from "../../lib/types";

interface SavedSearchesPanelProps {
  currentQuery: string;
  currentFilters: {
    types: DatasetTab[];
    hazardousOnly: boolean;
    startDate: string;
    endDate: string;
  };
  onRunSearch: (query: string, filters: SavedSearch["filters"]) => void;
}

export function SavedSearchesPanel({
  currentQuery,
  currentFilters,
  onRunSearch,
}: SavedSearchesPanelProps) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    setSearches(getSavedSearches());
  }, []);

  const handleSave = useCallback(() => {
    if (!currentQuery.trim() || !saveName.trim()) return;
    const saved = addSavedSearch({
      name: saveName.trim(),
      query: currentQuery,
      filters: {
        types: currentFilters.types.length > 0 ? currentFilters.types : undefined,
        hazardousOnly: currentFilters.hazardousOnly || undefined,
        startDate: currentFilters.startDate || undefined,
        endDate: currentFilters.endDate || undefined,
      },
    });
    setSearches((prev) => [saved, ...prev]);
    setSaveName("");
    setShowSaveDialog(false);
  }, [currentQuery, currentFilters, saveName]);

  const handleDelete = useCallback((id: string) => {
    removeSavedSearch(id);
    setSearches((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleRun = useCallback(
    (search: SavedSearch) => {
      onRunSearch(search.query, search.filters);
    },
    [onRunSearch],
  );

  if (searches.length === 0 && !currentQuery) return null;

  return (
    <div className="space-y-3">
      {/* Header + save button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark size={14} className="text-text-muted" />
          <h3 className="text-xs font-semibold text-text-primary">Saved Searches</h3>
          {searches.length > 0 && (
            <span className="rounded-full bg-bg-card px-1.5 py-0.5 text-[10px] text-text-muted">
              {searches.length}
            </span>
          )}
        </div>
        {currentQuery && (
          <button
            onClick={() => setShowSaveDialog(!showSaveDialog)}
            className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
          >
            <BookmarkPlus size={12} />
            Save current
          </button>
        )}
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-card p-2 animate-fade-in">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setShowSaveDialog(false);
            }}
            placeholder="Name this search..."
            className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-muted/60"
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={!saveName.trim()}
            className="rounded-md bg-accent px-2 py-1 text-[10px] font-medium text-accent-text disabled:opacity-40"
          >
            Save
          </button>
          <button onClick={() => setShowSaveDialog(false)} className="text-text-muted hover:text-text-primary">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Saved searches list */}
      {searches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {searches.map((search) => (
            <div
              key={search.id}
              className="group flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-2.5 py-1.5 transition-colors hover:border-border-hover"
            >
              <button
                onClick={() => handleRun(search)}
                className="flex items-center gap-1.5 text-left"
                title={`Run: ${search.query}`}
              >
                <Play size={10} className="text-text-muted" />
                <span className="max-w-[140px] truncate text-[11px] font-medium text-text-primary">
                  {search.name}
                </span>
                {search.filters.types && search.filters.types.length > 0 && (
                  <SlidersHorizontal size={9} className="text-text-muted" />
                )}
              </button>
              <button
                onClick={() => handleDelete(search.id)}
                className="ml-1 opacity-0 transition-opacity group-hover:opacity-100"
                title="Remove"
              >
                <Trash2 size={10} className="text-text-muted hover:text-text-primary" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
