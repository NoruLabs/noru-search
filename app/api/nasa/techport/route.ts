import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const TECHPORT_BASE = "https://api.nasa.gov/techport/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("id");
  const updatedSince = searchParams.get("updated_since");

  try {
    // Single project detail
    if (projectId) {
      const { data } = await axios.get(
        `${TECHPORT_BASE}/projects/${projectId}`,
        {
          params: { api_key: NASA_API_KEY },
          timeout: 15000,
        }
      );
      return NextResponse.json(data.project || data);
    }

    // List projects (updated since a date)
    const since = updatedSince || getDefaultSinceDate();
    const { data } = await axios.get(`${TECHPORT_BASE}/projects`, {
      params: {
        api_key: NASA_API_KEY,
        updatedSince: since,
      },
      timeout: 15000,
    });

    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.msg || "Failed to fetch TechPort data" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getDefaultSinceDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d.toISOString().split("T")[0];
}
