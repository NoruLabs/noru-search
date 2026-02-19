"use client";

import {
  Camera,
  Globe,
  Home,
  Orbit,
  Sun,
  Telescope,
} from "lucide-react";
import type { DatasetTab } from "../lib/types";
import { TAB_CONFIG } from "../lib/constants";

const TAB_ICONS: Record<DatasetTab, React.ReactNode> = {
  apod: <Telescope size={16} />,
  neo: <Orbit size={16} />,
  mars: <Camera size={16} />,
  exoplanets: <Globe size={16} />,
  weather: <Sun size={16} />,
};

interface TabsProps {
  activeTab: DatasetTab | null;
  onTabChange: (tab: DatasetTab) => void;
  onHomeClick: () => void;
}

export function Tabs({ activeTab, onTabChange, onHomeClick }: TabsProps) {
  return (
    <nav className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mb-px flex gap-1 overflow-x-auto scrollbar-none">
          {/* Home / Feed tab */}
          <button
            onClick={onHomeClick}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === null
                ? "border-accent text-text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
            aria-selected={activeTab === null}
            role="tab"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Feed</span>
          </button>

          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
                aria-selected={isActive}
                role="tab"
              >
                {TAB_ICONS[tab.id]}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
