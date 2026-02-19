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
    <nav className="border-b border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mb-px flex gap-0.5 overflow-x-auto scrollbar-none sm:gap-1">
          {/* Home / Feed tab */}
          <button
            onClick={onHomeClick}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:text-sm ${
              activeTab === null
                ? "border-accent text-text-primary"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
            aria-selected={activeTab === null}
            role="tab"
          >
            <Home size={14} />
            Feed
          </button>

          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:text-sm ${
                  isActive
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
                aria-selected={isActive}
                role="tab"
              >
                {TAB_ICONS[tab.id]}
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
