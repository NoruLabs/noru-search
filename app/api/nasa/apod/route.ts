import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  try {
    const params: Record<string, string> = { api_key: NASA_API_KEY };
    if (date) params.date = date;

    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const { data } = await axios.get(`${NASA_BASE}/planetary/apod`, { params });
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.msg || "Failed to fetch APOD" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
