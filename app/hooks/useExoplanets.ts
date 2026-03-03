import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { Exoplanet } from "../lib/types";

export function useExoplanets(limit?: number, offset: number = 0) {
  return useQuery<Exoplanet[]>({
    queryKey: ["exoplanets", limit, offset],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;
      const { data } = await api.get("/exoplanets", { params });
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    meta: { errorMessage: getApiErrorMessage },
  });
}

export function useExoplanetSearch(searchTerm: string) {
  return useQuery<Exoplanet[]>({
    queryKey: ["exoplanet-search", searchTerm],
    queryFn: async () => {
      const { data } = await api.get("/exoplanets", {
        params: { search: searchTerm },
      });
      return data;
    },
    enabled: searchTerm.length >= 2,
    meta: { errorMessage: getApiErrorMessage },
  });
}
