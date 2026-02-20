import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "FLR"; // FLR, CME, GST, SEP, IPS
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  const daysBack = 30;
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysBack);

  try {
    const params: Record<string, string> = {
      api_key: NASA_API_KEY,
      startDate: startDate || start.toISOString().split("T")[0],
      endDate: endDate || end.toISOString().split("T")[0],
    };

    const endpoint =
      type === "CME" ? "CME" : type === "GST" ? "GST" : type === "SEP" ? "SEP" : type === "IPS" ? "IPS" : "FLR";

    const { data } = await axios.get(`${NASA_BASE}/DONKI/${endpoint}`, {
      params,
    });
    return NextResponse.json(data || []);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.msg || "Failed to fetch space weather" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
