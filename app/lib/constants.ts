import type { DatasetTab } from "./types";

export interface TabConfig {
  id: DatasetTab;
  label: string;
  description: string;
  color: string;
}

export const TAB_CONFIG: TabConfig[] = [
  { id: "apod",       label: "APOD",          description: "Astronomy Picture of the Day",  color: "var(--c-apod)" },
  { id: "news",       label: "Space News",    description: "Latest Spaceflight Details",    color: "var(--c-weather)" },
  { id: "nasa-media", label: "NASA Media",    description: "NASA Image and Video Library",  color: "var(--c-asteroids)" },
  { id: "asteroids",  label: "Asteroids",     description: "Near Earth Objects",            color: "var(--c-weather)" },
  { id: "exoplanets", label: "Exoplanets",    description: "Planets Beyond Solar System",   color: "var(--c-apod)" },
  { id: "gibs",       label: "Earth GIBS",    description: "Global Imagery Browse",         color: "var(--c-weather)" },
  { id: "techport",   label: "TechPort",      description: "NASA Technology Projects",      color: "var(--c-asteroids)" }
];

/** Get a tab's accent color by ID */
export function getTabColor(id: DatasetTab): string {
  return TAB_CONFIG.find((t) => t.id === id)?.color ?? "var(--accent)";
}

