import type { DatasetTab } from "./types";

export interface TabConfig {
  id: DatasetTab;
  label: string;
  description: string;
  color: string;
}

export const TAB_CONFIG: TabConfig[] = [
  { id: "apod",       label: "APOD",          description: "Astronomy Picture of the Day",  color: "var(--c-apod)" },
  { id: "neo",        label: "Asteroids",     description: "Near-Earth Objects",            color: "var(--c-neo)" },
  { id: "mars",       label: "Mars Rovers",   description: "Rover Photos & Data",           color: "var(--c-mars)" },
  { id: "exoplanets", label: "Exoplanets",    description: "Discovered Worlds",             color: "var(--c-exo)" },
  { id: "weather",    label: "Space Weather", description: "Solar Activity & Storms",       color: "var(--c-weather)" },
  { id: "insight",    label: "InSight",       description: "Mars Surface Conditions",       color: "var(--c-insight)" },
  { id: "media",      label: "NASA Media",    description: "Images & Videos",               color: "var(--c-media)" },
  { id: "sounds",     label: "Sounds",        description: "Audio from Space",              color: "var(--c-sounds)" },
  { id: "techport",   label: "TechPort",      description: "Technology Projects",           color: "var(--c-techport)" },
];

/** Get a tab's accent color by ID */
export function getTabColor(id: DatasetTab): string {
  return TAB_CONFIG.find((t) => t.id === id)?.color ?? "var(--accent)";
}

export const MARS_ROVERS = ["curiosity", "opportunity", "spirit"] as const;

export const MARS_CAMERAS: Record<string, string> = {
  FHAZ: "Front Hazard Avoidance",
  RHAZ: "Rear Hazard Avoidance",
  MAST: "Mast Camera",
  CHEMCAM: "Chemistry & Camera",
  MAHLI: "Mars Hand Lens Imager",
  MARDI: "Mars Descent Imager",
  NAVCAM: "Navigation Camera",
  PANCAM: "Panoramic Camera",
  MINITES: "Mini-TES",
};
