import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { Exoplanet } from "../lib/types";

export function useExoplanets(limit: number = 50, offset: number = 0) {
  return useQuery<Exoplanet[]>({
    queryKey: ["exoplanets", limit, offset],
    queryFn: async () => {
      const { data } = await api.get("/exoplanets", {
        params: { limit, offset },
      });
      return data;
    },
    meta: { errorMessage: getApiErrorMessage },
  });
}

export function useExoplanetSearch(searchTerm: string) {
  return useQuery<Exoplanet[]>({
    queryKey: ["exoplanet-search", searchTerm],
    queryFn: async () => {
      const { data } = await api.get("/exoplanets", {
        params: { search: searchTerm, limit: 50 },
      });
      return data;
    },
    enabled: searchTerm.length >= 2,
    meta: { errorMessage: getApiErrorMessage },
  });
}
