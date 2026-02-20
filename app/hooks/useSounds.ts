import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { NasaMediaSearchResponse } from "../lib/types";

/**
 * Fetches audio assets from the NASA Image & Video Library (media_type=audio).
 * Covers Voyager plasma waves, Cassini Saturn sounds, etc.
 */
export function useSpaceSounds(query: string = "sounds", page: number = 1) {
  return useQuery<NasaMediaSearchResponse>({
    queryKey: ["space-sounds", query, page],
    queryFn: async () => {
      const { data } = await api.get("/sounds", {
        params: { q: query, page },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    meta: { errorMessage: getApiErrorMessage },
  });
}
