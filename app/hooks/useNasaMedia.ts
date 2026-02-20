import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { NasaMediaSearchResponse } from "../lib/types";

export function useNasaMedia(
  query: string = "space",
  options?: { mediaType?: string; page?: number; yearStart?: string; yearEnd?: string }
) {
  return useQuery<NasaMediaSearchResponse>({
    queryKey: ["nasa-media", query, options],
    queryFn: async () => {
      const params: Record<string, string | number> = { q: query };
      if (options?.mediaType) params.media_type = options.mediaType;
      if (options?.page) params.page = options.page;
      if (options?.yearStart) params.year_start = options.yearStart;
      if (options?.yearEnd) params.year_end = options.yearEnd;
      const { data } = await api.get("/media", { params });
      return data;
    },
    enabled: query.trim().length >= 1,
    staleTime: 5 * 60 * 1000,
    meta: { errorMessage: getApiErrorMessage },
  });
}
