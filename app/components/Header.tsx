"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  Moon,
  Telescope,
  Menu,
  X,
  Newspaper,
  Image as ImageIcon,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import type { DatasetTab } from "../lib/types";
import { TAB_CONFIG } from "../lib/constants";

const TAB_ICONS: Record<DatasetTab, React.ReactNode> = {
  apod: <Telescope size={14} />,
  "nasa-media": <ImageIcon size={14} />,
  news: <Newspaper size={14} />
};

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const activeTab = pathname.split('/')[1] as DatasetTab | undefined;

  return (
    <header className="header-bar sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-12 items-center gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="header-tab flex shrink-0 items-center gap-2 !opacity-70 hover:!opacity-100 transition-opacity"
            data-active={pathname === "/"}
          >
            <img
              src="/noru-icon.png"
              alt="Noru Search logo"
              width={20}
              height={20}
              className="rounded-md"
            />
            <div className="flex items-baseline gap-1">
              <span className="text-[13px] font-semibold tracking-tight">
                Noru
              </span>
              <span className="text-[13px] font-light tracking-tight opacity-50">
                search
              </span>
            </div>
          </Link>

          {/* Desktop Tab navigation */}
          <nav
            className="hidden md:flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto scrollbar-none"
            aria-label="Dataset navigation"
            role="tablist"
          >
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={`/${tab.id}`}
                  className="header-tab"
                  data-active={isActive}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className="shrink-0">{TAB_ICONS[tab.id]}</span>
                  <span className="hidden lg:inline">{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="header-toggle flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="header-toggle flex h-8 w-8 shrink-0 items-center justify-center rounded-md md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-bg-primary animate-fade-in">
          <nav className="mx-auto max-w-7xl px-4 py-3 grid grid-cols-3 gap-2" role="tablist">
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={`/${tab.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-text"
                      : "text-text-muted hover:bg-bg-card hover:text-text-secondary"
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {TAB_ICONS[tab.id]}
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

