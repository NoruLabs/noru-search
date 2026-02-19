"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "noru-search-history";
const MAX_HISTORY = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount?: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      // Ignore parse errors
    }
  }, []);

  const addToHistory = useCallback(
    (query: string, resultCount?: number) => {
      const trimmed = query.trim();
      if (!trimmed || trimmed.length < 2) return;

      setHistory((prev) => {
        // Remove duplicate
        const filtered = prev.filter(
          (h) => h.query.toLowerCase() !== trimmed.toLowerCase()
        );
        const next = [
          { query: trimmed, timestamp: Date.now(), resultCount },
          ...filtered,
        ].slice(0, MAX_HISTORY);

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    },
    []
  );

  const removeFromHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const next = prev.filter(
        (h) => h.query.toLowerCase() !== query.toLowerCase()
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
