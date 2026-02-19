import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rover = searchParams.get("rover") || "curiosity";
  const sol = searchParams.get("sol");
  const earthDate = searchParams.get("earth_date");
  const camera = searchParams.get("camera");
  const page = searchParams.get("page") || "1";

  try {
    const params: Record<string, string> = {
      api_key: NASA_API_KEY,
      page,
    };
    if (sol) params.sol = sol;
    if (earthDate) params.earth_date = earthDate;
    if (camera) params.camera = camera;
    if (!sol && !earthDate) params.sol = "1000";

    const { data } = await axios.get(
      `${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/photos`,
      { params }
    );
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.msg || "Failed to fetch Mars photos" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
