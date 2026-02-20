"use client";

import Image from "next/image";
import {
  Camera,
  Globe,
  Moon,
  Orbit,
  Sun,
  Telescope,
  Thermometer,
  ImageIcon,
  Music,
  Rocket,
} from "lucide-react";
import { Sun as SunIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import type { DatasetTab } from "../lib/types";
import { TAB_CONFIG } from "../lib/constants";

const TAB_ICONS: Record<DatasetTab, React.ReactNode> = {
  apod: <Telescope size={14} />,
  neo: <Orbit size={14} />,
  mars: <Camera size={14} />,
  exoplanets: <Globe size={14} />,
  weather: <SunIcon size={14} />,
  insight: <Thermometer size={14} />,
  media: <ImageIcon size={14} />,
  sounds: <Music size={14} />,
  techport: <Rocket size={14} />,
};

interface HeaderProps {
  onLogoClick?: () => void;
  activeTab: DatasetTab | null;
  onTabChange: (tab: DatasetTab) => void;
  onHomeClick: () => void;
}

export function Header({
  onLogoClick,
  activeTab,
  onTabChange,
  onHomeClick,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo + Brand (acts as Home/Feed) */}
        <button
          onClick={onHomeClick}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-70"
        >
          <Image
            src="/noru-icon.png"
            alt="Noru Search logo"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="text-lg font-semibold tracking-tight text-text-primary">
            Noru
          </span>
          <span className="text-lg font-light tracking-tight text-text-muted">
            search
          </span>
        </button>

        {/* Tabs */}
        <nav
          className="-mb-px flex flex-1 items-center gap-0.5 overflow-x-auto scrollbar-none sm:gap-1"
          aria-label="Dataset navigation"
          role="tablist"
        >
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-4 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:text-sm ${
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
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
