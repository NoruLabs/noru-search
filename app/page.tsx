"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { Footer } from "./components/Footer";
import { useAppSearchState, ViewMode } from "./hooks/useAppSearchState";

// Dynamically import dataset panels to reduce initial bundle size
const Feed = dynamic(() => import("./features/feed/Feed").then((mod) => mod.Feed));
const ApodPanel = dynamic(() => import("./features/apod/ApodPanel").then((mod) => mod.ApodPanel));
const NeoPanel = dynamic(() => import("./features/neo/NeoPanel").then((mod) => mod.NeoPanel));
const ExoplanetsPanel = dynamic(() => import("./features/exoplanets/ExoplanetsPanel").then((mod) => mod.ExoplanetsPanel));
const SpaceWeatherPanel = dynamic(() => import("./features/weather/SpaceWeatherPanel").then((mod) => mod.SpaceWeatherPanel));
const InsightPanel = dynamic(() => import("./features/insight/InsightPanel").then((mod) => mod.InsightPanel));
const MediaPanel = dynamic(() => import("./features/media/MediaPanel").then((mod) => mod.MediaPanel));
const SoundsPanel = dynamic(() => import("./features/sounds/SoundsPanel").then((mod) => mod.SoundsPanel));
const TechportPanel = dynamic(() => import("./features/techport/TechportPanel").then((mod) => mod.TechportPanel));

import { SearchResultsSkeleton, SearchHistory, SearchFiltersPanel } from "./components/search/SearchResults";
const SearchResults = dynamic(() => import("./components/search/SearchResults").then((mod) => mod.SearchResults));
const SavedSearchesPanel = dynamic(() => import("./components/search/SavedSearches").then((mod) => mod.SavedSearchesPanel));

import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { LoadingBar } from "./components/ui/LoadingBar";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import type { DatasetTab } from "./lib/types";

const PANELS: Record<DatasetTab, React.ComponentType> = {
  apod: ApodPanel,
  neo: NeoPanel,
  exoplanets: ExoplanetsPanel,
  weather: SpaceWeatherPanel,
  insight: InsightPanel,
  media: MediaPanel,
  sounds: SoundsPanel,
  techport: TechportPanel,
};

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const {
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
    clearHistory,
    removeFromHistory,
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
  } = useAppSearchState();

  const ActivePanel = view !== "feed" && view !== "search" ? PANELS[view] : null;
  const isSearchView = view === "search" && committedQuery.length >= 2;

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <LoadingBar isLoading={isFetching} />
      <Header
        onLogoClick={handleGoHome}
        activeTab={view !== "feed" && view !== "search" ? view : null}
        onTabChange={handleTabChange}
        onHomeClick={handleGoHome}
      />

      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <ErrorBoundary>
        {/* Feed + Search views share the search bar */}
        {(view === "feed" || view === "search") && (
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="relative flex-1">
                <SearchBar
                  query={searchQuery}
                  onQueryChange={handleSearchChange}
                  onSubmit={handleSubmitSearch}
                  isSearching={isFetching}
                  onFocus={() => setShowHistory(true)}
                  onBlur={() => setShowHistory(false)}
                  size={view === "feed" ? "hero" : "default"}
                />
                {/* Search History Dropdown */}
                {showHistory && !committedQuery && history.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-40 mt-2">
                    <SearchHistory
                      history={history}
                      onSelect={handleSelectHistory}
                      onRemove={removeFromHistory}
                      onClear={clearHistory}
                    />
                  </div>
                )}
              </div>

              {/* Filters button */}
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

            {/* Content */}
            {isSearchView ? (
              <>
                {/* Saved Searches */}
                <SavedSearchesPanel
                  currentQuery={committedQuery}
                  currentFilters={{
                    types: filterTypes,
                    hazardousOnly: hazardousOnly,
                    startDate: startDate,
                    endDate: endDate,
                  }}
                  onRunSearch={(q, filters) => {
                    setSearchQuery(q);
                    setCommittedQuery(q);
                    if (filters?.types) setFilterTypes(filters.types as DatasetTab[]);
                    if (filters?.hazardousOnly !== undefined) setHazardousOnly(filters.hazardousOnly);
                    if (filters?.startDate) setStartDate(filters.startDate);
                    if (filters?.endDate) setEndDate(filters.endDate);
                    setView("search");
                  }}
                />
                {isSearching && !searchData ? (
                  <SearchResultsSkeleton />
                ) : searchData ? (
                  <SearchResults data={searchData} onNavigate={handleNavigate} />
                ) : null}
              </>
            ) : (
              <Feed searchQuery="" onNavigate={handleNavigate} />
            )}
          </div>
        )}

        {/* Dataset panel views */}
        {ActivePanel && (
          <div className="animate-fade-in">
            <ActivePanel />
          </div>
        )}
        </ErrorBoundary>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
