import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

/**
 * Feed endpoint: returns a combined set of data from multiple NASA APIs
 * for the unified homepage feed.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const types = searchParams.get("types")?.split(",") || [
    "apod",
    "neo",
    "mars",
    "weather",
  ];

  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const todayStr = today.toISOString().split("T")[0];
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const results: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  // Fetch all requested types in parallel
  const promises: Promise<void>[] = [];

  if (types.includes("apod")) {
    promises.push(
      axios
        .get(`${NASA_BASE}/planetary/apod`, {
          params: { api_key: NASA_API_KEY },
          timeout: 15000,
        })
        .then(({ data }) => {
          results.apod = data;
        })
        .catch((err) => {
          errors.apod = err.message;
        })
    );
  }

  if (types.includes("neo")) {
    promises.push(
      axios
        .get(`${NASA_BASE}/neo/rest/v1/feed`, {
          params: {
            api_key: NASA_API_KEY,
            start_date: todayStr,
            end_date: todayStr,
          },
          timeout: 15000,
        })
        .then(({ data }) => {
          const allNeo = Object.values(
            data.near_earth_objects as Record<string, unknown[]>
          ).flat();
          results.neo = allNeo;
        })
        .catch((err) => {
          errors.neo = err.message;
        })
    );
  }

  if (types.includes("mars")) {
    promises.push(
      axios
        .get(`${NASA_BASE}/mars-photos/api/v1/rovers/curiosity/photos`, {
          params: { api_key: NASA_API_KEY, sol: 1000, page: 1 },
          timeout: 15000,
        })
        .then(({ data }) => {
          results.mars = (data.photos || []).slice(0, 6);
        })
        .catch((err) => {
          errors.mars = err.message;
        })
    );
  }

  if (types.includes("weather")) {
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 30);
    promises.push(
      axios
        .get(`${NASA_BASE}/DONKI/FLR`, {
          params: {
            api_key: NASA_API_KEY,
            startDate: monthAgo.toISOString().split("T")[0],
            endDate: todayStr,
          },
          timeout: 15000,
        })
        .then(({ data }) => {
          results.weather = (data || []).slice(0, 5);
        })
        .catch((err) => {
          errors.weather = err.message;
        })
    );
  }

  await Promise.all(promises);

  return NextResponse.json({ results, errors });
}
