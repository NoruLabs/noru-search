"use client";

import { useQuery } from "@tanstack/react-query";
import { DataCard } from "../components/ui/DataCard";
import { Telescope, Flame, Snowflake, Clock, Globe } from "lucide-react";
import { useState } from "react";

// The NASA Exoplanet Archive TAP API endpoint
// https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html
const TAP_API_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

export function useExoplanets(filter: string) {
  return useQuery({
    queryKey: ["exoplanets", filter],
    queryFn: async () => {
      const res = await fetch(`/api/exoplanets?filter=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch exoplanets");
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
