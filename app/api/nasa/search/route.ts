import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

/**
 * Universal search endpoint — queries multiple NASA APIs in parallel
 * and returns text-matched results grouped by dataset type.
 *
 * Query params:
 *   q          — search text (required)
 *   types      — comma-separated dataset types to search (default: all)
 *   startDate  — ISO date string for date range filter
 *   endDate    — ISO date string for date range filter
 *   hazardous  — "true" to only return hazardous NEOs
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const types = searchParams.get("types")?.split(",") || [
    "apod",
    "neo",
    "mars",
    "exoplanets",
    "weather",
  ];
  const hazardousOnly = searchParams.get("hazardous") === "true";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const results: Record<string, unknown[]> = {};
  const counts: Record<string, number> = {};
  const errors: Record<string, string> = {};
  const promises: Promise<void>[] = [];

  // ── APOD: search past 30 days of pictures ──
  if (types.includes("apod")) {
    promises.push(
      axios
        .get(`${NASA_BASE}/planetary/apod`, {
          params: {
            api_key: NASA_API_KEY,
            count: 30,
          },
          timeout: 15000,
        })
        .then(({ data }) => {
          const matched = (data as Record<string, string>[]).filter(
            (item) =>
              item.title?.toLowerCase().includes(q) ||
              item.explanation?.toLowerCase().includes(q)
          );
          results.apod = matched.slice(0, 10);
          counts.apod = matched.length;
        })
        .catch((err) => {
          errors.apod = err.message;
        })
    );
  }

  // ── NEO: search today's asteroids by name ──
  if (types.includes("neo")) {
    promises.push(
      axios
        .get(`${NASA_BASE}/neo/rest/v1/feed`, {
          params: {
            api_key: NASA_API_KEY,
            start_date: startDate || todayStr,
            end_date: endDate || todayStr,
          },
          timeout: 15000,
        })
        .then(({ data }) => {
          let allNeo = Object.values(
            data.near_earth_objects as Record<string, Record<string, unknown>[]>
          ).flat();
          // Text filter
          allNeo = allNeo.filter((n) =>
            (n.name as string)?.toLowerCase().includes(q)
          );
          // Hazardous filter
          if (hazardousOnly) {
            allNeo = allNeo.filter(
              (n) => n.is_potentially_hazardous_asteroid === true
            );
          }
          results.neo = allNeo.slice(0, 20);
          counts.neo = allNeo.length;
        })
        .catch((err) => {
          errors.neo = err.message;
        })
    );
  }

  // ── Mars: search by camera name ──
  if (types.includes("mars")) {
    promises.push(
      axios
        .get(`${NASA_BASE}/mars-photos/api/v1/rovers/curiosity/photos`, {
          params: { api_key: NASA_API_KEY, sol: 1000, page: 1 },
          timeout: 15000,
        })
        .then(({ data }) => {
          const photos = ((data.photos || []) as Record<string, unknown>[]).filter(
            (p) => {
              const cam = p.camera as Record<string, string>;
              const rover = p.rover as Record<string, string>;
              return (
                cam?.full_name?.toLowerCase().includes(q) ||
                cam?.name?.toLowerCase().includes(q) ||
                rover?.name?.toLowerCase().includes(q)
              );
            }
          );
          results.mars = photos.slice(0, 12);
          counts.mars = photos.length;
        })
        .catch((err) => {
          errors.mars = err.message;
        })
    );
  }

  // ── Exoplanets: search by planet or host star name ──
  if (types.includes("exoplanets")) {
    promises.push(
      axios
        .get("https://exoplanetarchive.ipac.caltech.edu/TAP/sync", {
          params: {
            query: `SELECT pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,st_spectype,st_teff,sy_dist,pl_orbsmax FROM pscomppars WHERE LOWER(pl_name) LIKE '%${q}%' OR LOWER(hostname) LIKE '%${q}%' ORDER BY disc_year DESC`,
            format: "json",
          },
          timeout: 15000,
        })
        .then(({ data }) => {
          const exoplanets = Array.isArray(data) ? data : [];
          results.exoplanets = exoplanets.slice(0, 20);
          counts.exoplanets = exoplanets.length;
        })
        .catch((err) => {
          errors.exoplanets = err.message;
        })
    );
  }

  // ── Space Weather: search flares by class ──
  if (types.includes("weather")) {
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 60);
    promises.push(
      axios
        .get(`${NASA_BASE}/DONKI/FLR`, {
          params: {
            api_key: NASA_API_KEY,
            startDate: startDate || monthAgo.toISOString().split("T")[0],
            endDate: endDate || todayStr,
          },
          timeout: 15000,
        })
        .then(({ data }) => {
          const flares = ((data || []) as Record<string, string>[]).filter(
            (f) =>
              f.classType?.toLowerCase().includes(q) ||
              f.sourceLocation?.toLowerCase().includes(q)
          );
          results.weather = flares.slice(0, 20);
          counts.weather = flares.length;
        })
        .catch((err) => {
          errors.weather = err.message;
        })
    );
  }

  await Promise.all(promises);

  const totalResults = Object.values(counts).reduce((a, b) => a + b, 0);

  return NextResponse.json({ query: q, results, counts, totalResults, errors });
}
