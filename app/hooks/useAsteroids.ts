import { useQuery } from '@tanstack/react-query';
import type { Asteroid, AsteroidResponse } from '../lib/types';

export function useAsteroids() {
  return useQuery({
    queryKey: ['asteroids-feed'],
    queryFn: async (): Promise<Asteroid[]> => {
      const res = await fetch('/api/nasa/neo');
      if (!res.ok) throw new Error("Failed to fetch asteroids feed");
      
      const data: AsteroidResponse = await res.json();
      
      // Flat map all the dates into a single array
      const allAsteroids: Asteroid[] = [];
      Object.keys(data.near_earth_objects).forEach(date => {
        allAsteroids.push(...data.near_earth_objects[date]);
      });
      
      // Sort by closest approach
      allAsteroids.sort((a, b) => {
        const aDist = parseFloat(a.close_approach_data[0].miss_distance.kilometers);
        const bDist = parseFloat(b.close_approach_data[0].miss_distance.kilometers);
        return aDist - bDist;
      });

      return allAsteroids;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
