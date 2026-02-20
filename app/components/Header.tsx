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
    <header className="header-bar sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-12 items-center gap-4">
          {/* Brand */}
          <button
            onClick={onHomeClick}
            className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-70"
          >
            <Image
              src="/noru-icon.png"
              alt="Noru Search logo"
              width={24}
              height={24}
              className="rounded-lg"
            />
            <div className="flex items-baseline gap-1">
              <span
                className="text-[14px] font-semibold tracking-tight"
                style={{ color: "var(--header-text)" }}
              >
                Noru
              </span>
              <span
                className="text-[14px] font-light tracking-tight"
                style={{ color: "var(--header-text)", opacity: 0.45 }}
              >
                search
              </span>
            </div>
          </button>

          {/* Tab navigation */}
          <nav
            className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto scrollbar-none"
            aria-label="Dataset navigation"
            role="tablist"
          >
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="header-tab"
                  data-active={isActive}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className="shrink-0">{TAB_ICONS[tab.id]}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="header-toggle flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
