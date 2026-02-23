import { useQuery } from "@tanstack/react-query";
import type {
  SpaceNewsArticle,
  SpaceNewsBlog,
  SpaceNewsReport,
} from "../lib/types";

export interface SpaceNewsResponse {
  articles: SpaceNewsArticle[];
  blogs: SpaceNewsBlog[];
  reports: SpaceNewsReport[];
}

export function useSpaceNews() {
  return useQuery<SpaceNewsResponse>({
    queryKey: ["space-news"],
    queryFn: async () => {
      const res = await fetch("/api/space-news");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to load space news");
      }
      return res.json();
    },
    staleTime: 60 * 60 * 1000, // 1 hour (API route uses revalidate 24h)
  });
}
