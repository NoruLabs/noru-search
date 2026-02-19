import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type {
  SolarFlare,
  CoronalMassEjection,
  GeomagneticStorm,
} from "../lib/types";

function getDateRange(daysBack: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysBack);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

export function useSolarFlares(daysBack: number = 30) {
  const { startDate, endDate } = getDateRange(daysBack);

  return useQuery<SolarFlare[]>({
    queryKey: ["solar-flares", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get("/weather", {
        params: { type: "FLR", start_date: startDate, end_date: endDate },
      });
      return data;
    },
    meta: { errorMessage: getApiErrorMessage },
  });
}

export function useCoronalMassEjections(daysBack: number = 30) {
  const { startDate, endDate } = getDateRange(daysBack);

  return useQuery<CoronalMassEjection[]>({
    queryKey: ["cme", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get("/weather", {
        params: { type: "CME", start_date: startDate, end_date: endDate },
      });
      return data;
    },
    meta: { errorMessage: getApiErrorMessage },
  });
}

export function useGeomagneticStorms(daysBack: number = 30) {
  const { startDate, endDate } = getDateRange(daysBack);

  return useQuery<GeomagneticStorm[]>({
    queryKey: ["geo-storms", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get("/weather", {
        params: { type: "GST", start_date: startDate, end_date: endDate },
      });
      return data;
    },
    meta: { errorMessage: getApiErrorMessage },
  });
}
