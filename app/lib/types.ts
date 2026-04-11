// APOD (Astronomy Picture of the Day)
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

// Space Flight News API (spaceflightnewsapi.net v4)
export interface SpaceNewsBase {
  id: number;
  title: string;
  url: string;
  image_url: string | null;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at?: string;
}

export interface SpaceNewsArticle extends SpaceNewsBase {
  featured?: boolean;
}

export type SpaceNewsBlog = SpaceNewsBase;

export type SpaceNewsReport = SpaceNewsBase;

export type DatasetTab = "apod" | "nasa-media" | "news" | "asteroids" | "exoplanets" | "gibs" | "techport";

// NASA Image and Video Library
export interface NasaMediaItem {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  media_type: "image" | "video" | "audio";
  thumbnail_url?: string;
}

export interface NasaMediaResponse {
  collection: {
    items: {
      data: {
        nasa_id: string;
        title: string;
        description: string;
        date_created: string;
        media_type: "image" | "video" | "audio";
      }[];
      links?: {
        href: string;
        rel: string;
        render?: string;
      }[];
    }[];
  };
}

export interface AsteroidResponse {
  element_count: number;
  near_earth_objects: Record<string, Asteroid[]>;
}

export interface Asteroid {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: {
    close_approach_date: string;
    close_approach_date_full: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      lunar: string;
      kilometers: string;
    };
  }[];
}

