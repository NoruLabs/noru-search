import { useQuery } from '@tanstack/react-query';
import type { NasaMediaItem, NasaMediaResponse } from '../lib/types';

export function useNasaMedia(query: string) {
  return useQuery({
    queryKey: ['nasa-media', query],
    queryFn: async (): Promise<NasaMediaItem[]> => {
      const currentYear = new Date().getFullYear();
      
      if (!query.trim()) {
        // If there's no query, NASA's API default sorts oldest first.
        // To get the absolute newest published images, we fetch the last pages of the current year.
        const resInit = await fetch(`https://images-api.nasa.gov/search?q=&media_type=image&year_start=${currentYear}`);
        if (!resInit.ok) throw new Error("Failed to fetch NASA media");
        const initData = await resInit.json();
        
        const totalHits = initData.collection.metadata.total_hits;
        const lastPage = Math.ceil(totalHits / 100);
        
        let allItems: any[] = [];
        
        if (lastPage > 0) {
          // Fetch the final page
          const p1 = fetch(`https://images-api.nasa.gov/search?q=&media_type=image&year_start=${currentYear}&page=${lastPage}`)
            .then(r => r.json());
          
          // Fetch the second to last page if the last page has very few items
          const p2 = lastPage > 1 
            ? fetch(`https://images-api.nasa.gov/search?q=&media_type=image&year_start=${currentYear}&page=${lastPage - 1}`).then(r => r.json())
            : Promise.resolve({ collection: { items: [] } });
            
          const [resLast, resPrev] = await Promise.all([p1, p2]);
          allItems = [...resPrev.collection.items, ...resLast.collection.items];
        } else {
          allItems = initData.collection.items;
        }

        return allItems
          .map(item => {
            const info = item.data[0];
            const thumbnail = item.links?.find((l: any) => l.rel === "preview")?.href;
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
          // Sort newest descending
          .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
      }

      // If user typed a search term: use active searching
      const queryParam = `q=${encodeURIComponent(query)}&`;
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
          const thumbnail = item.links?.find((l: any) => l.rel === "preview")?.href;
          
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
