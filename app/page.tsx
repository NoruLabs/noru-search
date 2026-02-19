"use client";

import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { SearchBar } from "./components/SearchBar";
import { Feed } from "./components/datasets/Feed";
import { Footer } from "./components/Footer";
import { ApodPanel } from "./components/datasets/ApodPanel";
import { NeoPanel } from "./components/datasets/NeoPanel";
import { MarsPanel } from "./components/datasets/MarsPanel";
import { ExoplanetsPanel } from "./components/datasets/ExoplanetsPanel";
import { SpaceWeatherPanel } from "./components/datasets/SpaceWeatherPanel";
import {
  SearchResults,
  SearchResultsSkeleton,
  SearchHistory,
  SearchFiltersPanel,
} from "./components/search/SearchResults";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { LoadingBar } from "./components/ui/LoadingBar";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { useUniversalSearch } from "./hooks/useSearch";
import { useSearchHistory } from "./hooks/useSearchHistory";
import type { DatasetTab } from "./lib/types";

const PANELS: Record<DatasetTab, React.ComponentType> = {
  apod: ApodPanel,
  neo: NeoPanel,
  mars: MarsPanel,
  exoplanets: ExoplanetsPanel,
  weather: SpaceWeatherPanel,
};

type ViewMode = "feed" | "search" | DatasetTab;

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
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

  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();

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

  const ActivePanel = view !== "feed" && view !== "search" ? PANELS[view] : null;
  const isSearchView = view === "search" && committedQuery.length >= 2;

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <LoadingBar isLoading={isFetching} />
      <Header onLogoClick={handleGoHome} />
      <Tabs
        activeTab={view !== "feed" && view !== "search" ? view : null}
        onTabChange={handleTabChange}
        onHomeClick={handleGoHome}
      />

      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <ErrorBoundary>
        {/* Feed + Search views share the search bar */}
        {(view === "feed" || view === "search") && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="relative flex-1">
                <SearchBar
                  query={searchQuery}
                  onQueryChange={handleSearchChange}
                  onSubmit={handleSubmitSearch}
                  isSearching={isFetching}
                  onFocus={() => setShowHistory(true)}
                  onBlur={() => setShowHistory(false)}
                />
                {/* Search History Dropdown */}
                {showHistory && !committedQuery && history.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-40 mt-1">
                    <SearchHistory
                      history={history}
                      onSelect={handleSelectHistory}
                      onRemove={removeFromHistory}
                      onClear={clearHistory}
                    />
                  </div>
                )}
              </div>

              {/* Filters button (only show when searching) */}
              {isSearchView && (
                <SearchFiltersPanel
                  activeTypes={filterTypes}
                  onToggleType={handleToggleType}
                  hazardousOnly={hazardousOnly}
                  onToggleHazardous={() => setHazardousOnly((p) => !p)}
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  isOpen={showFilters}
                  onToggle={() => setShowFilters((p) => !p)}
                />
              )}
            </div>

            {/* Content area */}
            {isSearchView ? (
              isSearching && !searchData ? (
                <SearchResultsSkeleton />
              ) : searchData ? (
                <SearchResults data={searchData} onNavigate={handleNavigate} />
              ) : null
            ) : (
              <Feed searchQuery="" onNavigate={handleNavigate} />
            )}
          </div>
        )}

        {/* Dataset panel views */}
        {ActivePanel && <ActivePanel />}
        </ErrorBoundary>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
