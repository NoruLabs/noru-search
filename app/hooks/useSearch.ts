import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type {
  ApodData,
  NeoObject,
  MarsPhoto,
  Exoplanet,
  SolarFlare,
  DatasetTab,
} from "../lib/types";

export interface SearchFilters {
  types?: DatasetTab[];
  hazardousOnly?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface SearchResponse {
  query: string;
  results: {
    apod?: ApodData[];
    neo?: NeoObject[];
    mars?: MarsPhoto[];
    exoplanets?: Exoplanet[];
    weather?: SolarFlare[];
  };
  counts: Record<string, number>;
  totalResults: number;
  errors: Record<string, string>;
}

export function useUniversalSearch(query: string, filters?: SearchFilters) {
  return useQuery<SearchResponse>({
    queryKey: ["universal-search", query, filters],
    queryFn: async () => {
      const params: Record<string, string> = { q: query };
      if (filters?.types?.length) params.types = filters.types.join(",");
      if (filters?.hazardousOnly) params.hazardous = "true";
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;

      const { data } = await api.get("/search", { params });
      return data;
    },
    enabled: query.trim().length >= 2,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
