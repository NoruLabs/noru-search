"use client";

import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { SearchBar } from "./components/SearchBar";
import { Feed } from "./components/datasets/Feed";
import { ApodPanel } from "./components/datasets/ApodPanel";
import { NeoPanel } from "./components/datasets/NeoPanel";
import { MarsPanel } from "./components/datasets/MarsPanel";
import { ExoplanetsPanel } from "./components/datasets/ExoplanetsPanel";
import { SpaceWeatherPanel } from "./components/datasets/SpaceWeatherPanel";
import type { DatasetTab } from "./lib/types";

const PANELS: Record<DatasetTab, React.ComponentType> = {
  apod: ApodPanel,
  neo: NeoPanel,
  mars: MarsPanel,
  exoplanets: ExoplanetsPanel,
  weather: SpaceWeatherPanel,
};

type ViewMode = "feed" | DatasetTab;

export default function Home() {
  const [view, setView] = useState<ViewMode>("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<DatasetTab[]>([]);

  const handleToggleFilter = useCallback((tab: DatasetTab) => {
    setActiveFilters((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
    );
  }, []);

  const handleNavigate = useCallback((tab: DatasetTab) => {
    setView(tab);
  }, []);

  const handleTabChange = useCallback((tab: DatasetTab) => {
    setView(tab);
    setSearchQuery("");
    setActiveFilters([]);
  }, []);

  const handleGoHome = useCallback(() => {
    setView("feed");
    setSearchQuery("");
    setActiveFilters([]);
  }, []);

  const ActivePanel = view !== "feed" ? PANELS[view] : null;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header onLogoClick={handleGoHome} />
      <Tabs
        activeTab={view === "feed" ? null : view}
        onTabChange={handleTabChange}
        onHomeClick={handleGoHome}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {view === "feed" ? (
          <div className="space-y-8">
            <SearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              activeFilters={activeFilters}
              onToggleFilter={handleToggleFilter}
            />
            <Feed
              searchQuery={searchQuery}
              activeFilters={activeFilters}
              onNavigate={handleNavigate}
            />
          </div>
        ) : ActivePanel ? (
          <ActivePanel />
        ) : null}
      </main>
    </div>
  );
}
