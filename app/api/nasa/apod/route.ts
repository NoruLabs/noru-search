import { NextRequest, NextResponse } from "next/server";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  try {
    const params = new URLSearchParams({ api_key: NASA_API_KEY });
    if (date) params.append("date", date);

    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const response = await fetch(`${NASA_BASE}/planetary/apod?${params.toString()}`, {
      next: { revalidate: 3600 }, // Cache on edge for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch APOD: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("APOD fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
