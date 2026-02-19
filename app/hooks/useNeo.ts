import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { NeoFeedResponse, NeoObject } from "../lib/types";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function useNeoFeed(startDate?: string, endDate?: string) {
  const today = new Date();
  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);

  const start = startDate || formatDate(today);
  const end = endDate || formatDate(weekFromNow);

  return useQuery<NeoObject[]>({
    queryKey: ["neo-feed", start, end],
    queryFn: async () => {
      const { data } = await api.get<NeoFeedResponse>("/neo", {
        params: { start_date: start, end_date: end },
      });
      const allObjects = Object.values(data.near_earth_objects).flat();
      return allObjects.sort((a, b) => {
        const distA = parseFloat(
          a.close_approach_data[0]?.miss_distance?.kilometers || "0"
        );
        const distB = parseFloat(
          b.close_approach_data[0]?.miss_distance?.kilometers || "0"
        );
        return distA - distB;
      });
    },
    meta: { errorMessage: getApiErrorMessage },
  });
}
