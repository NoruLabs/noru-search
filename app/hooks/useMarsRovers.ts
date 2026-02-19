import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { MarsPhoto, MarsRover } from "../lib/types";

export function useMarsRovers() {
  return useQuery<MarsRover[]>({
    queryKey: ["mars-rovers"],
    queryFn: async () => {
      const { data } = await api.get("/mars/rovers");
      return data.rovers;
    },
    meta: { errorMessage: getApiErrorMessage },
  });
}

export function useMarsPhotos(
  rover: string,
  options?: { sol?: number; earthDate?: string; camera?: string; page?: number }
) {
  return useQuery<MarsPhoto[]>({
    queryKey: ["mars-photos", rover, options],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        rover,
        page: options?.page || 1,
      };
      if (options?.sol !== undefined) params.sol = options.sol;
      if (options?.earthDate) params.earth_date = options.earthDate;
      if (options?.camera) params.camera = options.camera;
      if (!options?.sol && !options?.earthDate) {
        params.sol = 1000;
      }
      const { data } = await api.get("/mars", { params });
      return data.photos;
    },
    enabled: !!rover,
    meta: { errorMessage: getApiErrorMessage },
  });
}
