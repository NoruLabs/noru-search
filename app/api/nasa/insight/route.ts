import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

export async function GET(request: NextRequest) {
  try {
    const { data } = await axios.get(`${NASA_BASE}/insight_weather/`, {
      params: {
        api_key: NASA_API_KEY,
        feedtype: "json",
        ver: "1.0",
      },
      timeout: 15000,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.msg || "Failed to fetch InSight weather" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
