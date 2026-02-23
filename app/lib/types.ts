// ── APOD (Astronomy Picture of the Day) ──
export interface ApodData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
  thumbnail_url?: string;
}

// ── NEO (Near Earth Objects) ──
export interface NeoObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproach[];
}

export interface CloseApproach {
  close_approach_date: string;
  close_approach_date_full: string;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface NeoFeedResponse {
  element_count: number;
  near_earth_objects: Record<string, NeoObject[]>;
}

// ── Mars Rover Photos ──
export interface MarsPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
    max_sol: number;
    max_date: string;
  };
}

export interface MarsRover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  cameras: { name: string; full_name: string }[];
}

// ── Exoplanets ──
export interface Exoplanet {
  pl_name: string;
  hostname: string;
  discoverymethod: string;
  disc_year: number;
  pl_orbper: number | null;
  pl_rade: number | null;
  pl_bmasse: number | null;
  pl_eqt: number | null;
  st_spectype: string | null;
  st_teff: number | null;
  sy_dist: number | null;
  pl_orbsmax: number | null;
}

// ── Space Weather (DONKI) ──
export interface SolarFlare {
  flrID: string;
  instruments: { displayName: string }[];
  beginTime: string;
  peakTime: string;
  endTime: string | null;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number | null;
  link: string;
}

export interface CoronalMassEjection {
  activityID: string;
  startTime: string;
  sourceLocation: string;
  activeRegionNum: number | null;
  link: string;
  note: string;
  instruments: { displayName: string }[];
  cmeAnalyses: CMEAnalysis[] | null;
}

export interface CMEAnalysis {
  speed: number;
  type: string;
  isMostAccurate: boolean;
  halfAngle: number;
  latitude: number;
  longitude: number;
}

export interface GeomagneticStorm {
  gstID: string;
  startTime: string;
  allKpIndex: { observedTime: string; kpIndex: number; source: string }[];
  link: string;
}

// ── InSight Mars Weather ──
export interface InsightSolData {
  sol: string;
  AT?: { av: number; mn: number; mx: number; ct: number };
  PRE?: { av: number; mn: number; mx: number; ct: number };
  HWS?: { av: number; mn: number; mx: number; ct: number };
  WD?: Record<string, { compass_degrees: number; compass_point: string; ct: number }>;
  First_UTC: string;
  Last_UTC: string;
  Season: string;
}

export interface InsightResponse {
  sol_keys: string[];
  [sol: string]: InsightSolData | string[];
}

// ── NASA Image & Video Library ──
export interface NasaMediaItem {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  media_type: "image" | "video" | "audio";
  center?: string;
  keywords?: string[];
  photographer?: string;
  thumbnail?: string;
  href?: string;
}

export interface NasaMediaSearchResponse {
  collection: {
    items: {
      data: NasaMediaItem[];
      links?: { href: string; rel: string; render?: string }[];
      href: string;
    }[];
    metadata: { total_hits: number };
  };
}

// ── Sounds of Space ──
export interface SpaceSound {
  id: string;
  title: string;
  description: string;
  duration: number;
  stream_url?: string;
  download_url?: string;
  tag_list?: string;
  last_modified: string;
}

// ── TechPort Projects ──
export interface TechportProject {
  projectId: number;
  title: string;
  description: string;
  startDateString?: string;
  endDateString?: string;
  statusDescription?: string;
  leadOrganization?: { organizationName: string };
  supportingOrganizations?: { organizationName: string }[];
  primaryTas?: { abbreviation: string; title: string }[];
  program?: { title: string };
  lastUpdated?: string;
  benefits?: string;
  website?: string;
}

export interface TechportListResponse {
  projects: { projectId: number; lastUpdated: string }[];
  totalCount: number;
}

// ── DONKI Additional Types ──
export interface SolarEnergeticParticle {
  sepID: string;
  eventTime: string;
  instruments: { displayName: string }[];
  link: string;
}

export interface InterplanetaryShock {
  activityID: string;
  catalog: string;
  location: string;
  eventTime: string;
  instruments: { displayName: string }[];
  link: string;
}

// ── Tab Configuration ──
export type DatasetTab =
  | "apod"
  | "neo"
  | "mars"
  | "exoplanets"
  | "weather"
  | "insight"
  | "media"
  | "sounds"
  | "techport";

// ── Space Flight News API (spaceflightnewsapi.net v4) ──
export interface SpaceNewsArticle {
  id: number;
  title: string;
  url: string;
  image_url: string | null;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at?: string;
  featured?: boolean;
}

export interface SpaceNewsBlog {
  id: number;
  title: string;
  url: string;
  image_url: string | null;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at?: string;
}

export interface SpaceNewsReport {
  id: number;
  title: string;
  url: string;
  image_url: string | null;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at?: string;
}
