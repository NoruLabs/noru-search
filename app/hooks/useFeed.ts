import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type {
  ApodData,
  NeoObject,
  MarsPhoto,
  SolarFlare,
} from "../lib/types";

export interface FeedResponse {
  results: {
    apod?: ApodData;
    neo?: NeoObject[];
    mars?: MarsPhoto[];
    weather?: SolarFlare[];
  };
  errors: Record<string, string>;
}

export function useFeed() {
  return useQuery<FeedResponse>({
    queryKey: ["feed"],
    queryFn: async () => {
      const { data } = await api.get("/feed");
      return data;
    },
    staleTime: 3 * 60 * 1000, // 3 min
  });
}
