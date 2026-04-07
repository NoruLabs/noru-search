import { useQuery } from '@tanstack/react-query';
import type { NasaMediaItem, NasaMediaResponse } from '../lib/types';

export function useNasaMedia(query: string) {
  return useQuery({
    queryKey: ['nasa-media', query],
    queryFn: async (): Promise<NasaMediaItem[]> => {
      const currentYear = new Date().getFullYear();
      // If query is empty, just fetch the most recent images overall
      const queryParam = query.trim() ? `q=${encodeURIComponent(query)}&` : "";

      let res = await fetch(`https://images-api.nasa.gov/search?${queryParam}media_type=image&year_start=${currentYear - 2}`);
      if (!res.ok) throw new Error("Failed to fetch NASA media");
      let data: NasaMediaResponse = await res.json();

      // If very few results found in the last 2 years, fallback to all-time
      if (data.collection.items.length < 10) {
         res = await fetch(`https://images-api.nasa.gov/search?${queryParam}media_type=image`);
         if (!res.ok) throw new Error("Failed to fetch fallback NASA media");
         data = await res.json();
      }

      return data.collection.items
        .map(item => {
          const info = item.data[0];
          const thumbnail = item.links?.find(l => l.rel === "preview")?.href;
          
          return {
            nasa_id: info.nasa_id,
            title: info.title,
            description: info.description,
            date_created: info.date_created,
            media_type: info.media_type,
            thumbnail_url: thumbnail,
          };
        })
        .filter(item => item.thumbnail_url)
        .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
