import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { ApodData } from "../lib/types";

export function useApod(date?: string) {
  return useQuery<ApodData>({
    queryKey: ["apod", date],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (date) params.date = date;
      const { data } = await api.get("/apod", { params });
      return data;
    },
    meta: { errorMessage: getApiErrorMessage },
  });
}

export function useApodRange(startDate: string, endDate: string) {
  return useQuery<ApodData[]>({
    queryKey: ["apod-range", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get("/apod", {
        params: { start_date: startDate, end_date: endDate },
      });
      return data;
    },
    enabled: !!startDate && !!endDate,
  });
}
