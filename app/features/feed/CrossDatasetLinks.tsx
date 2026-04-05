"use client";

import {
  Link2,
  Newspaper,
  Sun,
  Orbit,
  Globe,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import type { DatasetTab, SolarFlare, NeoObject, Exoplanet } from "../../lib/types";

// ── Related Chips: contextual cross-dataset actions ──

interface RelatedChip {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CrossDatasetChipsProps {
  chips: RelatedChip[];
}

export function CrossDatasetChips({ chips }: CrossDatasetChipsProps) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.action}
          className="group flex items-center gap-1 rounded-full border border-border bg-bg-card px-2.5 py-1 text-[10px] font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
        >
          <span className="text-text-muted">{chip.icon}</span>
          {chip.label}
          <ArrowRight size={8} className="text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      ))}
    </div>
  );
}

// ── Helper: create chips from solar events ──

export function getWeatherRelatedChips(
  flare: SolarFlare,
  onNavigate: (tab: DatasetTab) => void,
  onSearch?: (query: string) => void,
): RelatedChip[] {
  const chips: RelatedChip[] = [];

  // Link to weather charts
  chips.push({
    label: "View in Weather Charts",
    icon: <Sun size={10} />,
    action: () => onNavigate("weather"),
  });

  // Related news search
  if (onSearch) {
    const searchTerm = flare.classType.startsWith("X")
      ? "X-class solar flare"
      : flare.classType.startsWith("M")
        ? "solar flare"
        : "solar activity";
    chips.push({
      label: `Search "${searchTerm}"`,
      icon: <Newspaper size={10} />,
      action: () => onSearch(searchTerm),
    });
  }

  return chips;
}

// ── Helper: create chips from NEO data ──

export function getNeoRelatedChips(
  neo: NeoObject,
  onNavigate: (tab: DatasetTab) => void,
  onSearch?: (query: string) => void,
): RelatedChip[] {
  const chips: RelatedChip[] = [];

  if (neo.is_potentially_hazardous_asteroid && onSearch) {
    chips.push({
      label: "Search hazardous asteroids",
      icon: <Orbit size={10} />,
      action: () => onSearch("hazardous asteroid"),
    });
  }

  chips.push({
    label: "View all asteroids",
    icon: <Orbit size={10} />,
    action: () => onNavigate("neo"),
  });

  if (onSearch) {
    chips.push({
      label: "Related news",
      icon: <Newspaper size={10} />,
      action: () => onSearch(`asteroid ${neo.name.replace(/[()]/g, "")}`),
    });
  }

  return chips;
}

// ── Helper: create chips from exoplanet data ──

export function getExoplanetRelatedChips(
  planet: Exoplanet,
  onNavigate: (tab: DatasetTab) => void,
  onSearch?: (query: string) => void,
): RelatedChip[] {
  const chips: RelatedChip[] = [];

  chips.push({
    label: "View all exoplanets",
    icon: <Globe size={10} />,
    action: () => onNavigate("exoplanets"),
  });

  if (onSearch) {
    chips.push({
      label: `Search "${planet.hostname}"`,
      icon: <Globe size={10} />,
      action: () => onSearch(planet.hostname),
    });
  }

  if (planet.discoverymethod && onSearch) {
    chips.push({
      label: `More by ${planet.discoverymethod}`,
      icon: <Globe size={10} />,
      action: () => onSearch(planet.discoverymethod),
    });
  }

  return chips;
}

// ── Related Section: wrapper for cross-links at bottom of detail views ──

export function RelatedSection({
  title,
  chips,
}: {
  title?: string;
  chips: RelatedChip[];
}) {
  if (chips.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {title ?? "Related"}
      </p>
      <CrossDatasetChips chips={chips} />
    </div>
  );
}
