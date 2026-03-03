import { useQuery } from "@tanstack/react-query";
import { api, getApiErrorMessage } from "../lib/api";
import type { TechportProject, TechportListResponse } from "../lib/types";

export function useTechportProjects(updatedSince?: string) {
  return useQuery<TechportListResponse>({
    queryKey: ["techport-projects", updatedSince],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (updatedSince) params.updated_since = updatedSince;
      const { data } = await api.get("/techport", { params });
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    meta: { errorMessage: getApiErrorMessage },
  });
}

export function useTechportProject(projectId: number | null) {
  return useQuery<TechportProject>({
    queryKey: ["techport-project", projectId],
    queryFn: async () => {
      const { data } = await api.get("/techport", {
        params: { id: projectId },
      });
      return data;
    },
    enabled: projectId !== null,
    staleTime: 10 * 60 * 1000,
    meta: { errorMessage: getApiErrorMessage },
  });
}
