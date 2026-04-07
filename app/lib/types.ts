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

export type DatasetTab = "apod" | "nasa-media" | "news";

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

