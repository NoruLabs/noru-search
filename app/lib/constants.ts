import type { DatasetTab } from "./types";

export const TAB_CONFIG: {
  id: DatasetTab;
  label: string;
  description: string;
}[] = [
  {
    id: "apod",
    label: "APOD",
    description: "Astronomy Picture of the Day",
  },
  {
    id: "neo",
    label: "Asteroids",
    description: "Near-Earth Objects",
  },
  {
    id: "mars",
    label: "Mars Rovers",
    description: "Rover Photos & Data",
  },
  {
    id: "exoplanets",
    label: "Exoplanets",
    description: "Discovered Worlds",
  },
  {
    id: "weather",
    label: "Space Weather",
    description: "Solar Activity & Storms",
  },
];

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
