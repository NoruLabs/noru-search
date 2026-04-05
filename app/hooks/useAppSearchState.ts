import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUniversalSearch } from "./useSearch";
import { useSearchHistory } from "./useSearchHistory";
import type { DatasetTab } from "../lib/types";

export type ViewMode = "feed" | "search" | DatasetTab;

export function useAppSearchState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params
  const initialQuery = searchParams.get("q") || "";
  const initialView: ViewMode = initialQuery
    ? "search"
    : (searchParams.get("tab") as DatasetTab) || "feed";

  const [view, setView] = useState<ViewMode>(initialView);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [committedQuery, setCommittedQuery] = useState(initialQuery);
  const [showHistory, setShowHistory] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Search filters
  const [filterTypes, setFilterTypes] = useState<DatasetTab[]>([]);
  const [hazardousOnly, setHazardousOnly] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // Debounce search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback(
    (q: string) => {
      setSearchQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (q.trim().length >= 2) {
        debounceRef.current = setTimeout(() => {
          setCommittedQuery(q.trim());
          setView("search");
        }, 400);
      } else if (q.trim().length === 0) {
        setCommittedQuery("");
        if (view === "search") setView("feed");
      }
    },
    [view]
  );

  // Universal search query
  const {
    data: searchData,
    isLoading: isSearching,
    isFetching,
  } = useUniversalSearch(committedQuery, {
    types: filterTypes.length > 0 ? filterTypes : undefined,
    hazardousOnly,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Save to history when results arrive
  useEffect(() => {
    if (searchData && searchData.totalResults >= 0 && committedQuery) {
      addToHistory(committedQuery, searchData.totalResults);
    }
  }, [searchData, committedQuery, addToHistory]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (view === "search" && committedQuery) {
      params.set("q", committedQuery);
      if (filterTypes.length > 0) params.set("types", filterTypes.join(","));
      if (hazardousOnly) params.set("hazardous", "true");
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
    } else if (view !== "feed" && view !== "search") {
      params.set("tab", view);
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/", { scroll: false });
  }, [view, committedQuery, filterTypes, hazardousOnly, startDate, endDate, router]);

  const handleSubmitSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (q.length >= 2) {
      setCommittedQuery(q);
      setView("search");
      setShowHistory(false);
    }
  }, [searchQuery]);

  const handleSelectHistory = useCallback(
    (q: string) => {
      setSearchQuery(q);
      setCommittedQuery(q);
      setView("search");
      setShowHistory(false);
    },
    []
  );

  const handleNavigate = useCallback((tab: DatasetTab) => {
    setView(tab);
  }, []);

  const handleTabChange = useCallback((tab: DatasetTab) => {
    setView(tab);
    setSearchQuery("");
    setCommittedQuery("");
    setShowFilters(false);
  }, []);

  const handleGoHome = useCallback(() => {
    setView("feed");
    setSearchQuery("");
    setCommittedQuery("");
    setShowFilters(false);
  }, []);

  const handleToggleType = useCallback((type: DatasetTab) => {
    setFilterTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  return {
    view,
    setView,
    searchQuery,
    setSearchQuery,
    committedQuery,
    setCommittedQuery,
    showHistory,
    setShowHistory,
    showFilters,
    setShowFilters,
    filterTypes,
    setFilterTypes,
    hazardousOnly,
    setHazardousOnly,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    handleSearchChange,
    searchData,
    isSearching,
    isFetching,
    handleSubmitSearch,
    handleSelectHistory,
    handleNavigate,
    handleTabChange,
    handleGoHome,
    handleToggleType
  };
}
