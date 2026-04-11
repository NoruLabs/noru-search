import { useQuery } from "@tanstack/react-query";
import type { ApodData } from "../lib/types";

export function useApod(date?: string) {
  return useQuery<ApodData>({
    queryKey: ["apod", date],
    queryFn: async () => {
      const url = new URL("/api/nasa/apod", window.location.origin);
      if (date) url.searchParams.set("date", date);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to load APOD");
      return res.json();
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useApodRange(startDate: string, endDate: string) {
  return useQuery<ApodData[]>({
    queryKey: ["apod-range", startDate, endDate],
    queryFn: async () => {
      const url = new URL("/api/nasa/apod", window.location.origin);
      url.searchParams.set("start_date", startDate);
      url.searchParams.set("end_date", endDate);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to load APOD range");
      return res.json();
    },
    enabled: !!startDate && !!endDate,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
