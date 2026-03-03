import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { InsightResponse } from "../lib/types";

export function useInsightWeather() {
  return useQuery<InsightResponse>({
    queryKey: ["insight-weather"],
    queryFn: async () => {
      const { data } = await api.get("/insight");
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    meta: { errorMessage: getApiErrorMessage },
  });
}
