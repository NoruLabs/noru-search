import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_IMAGES_API = "https://images-api.nasa.gov";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "space";
  const mediaType = searchParams.get("media_type") || "image";
  const page = searchParams.get("page") || "1";
  const yearStart = searchParams.get("year_start");
  const yearEnd = searchParams.get("year_end");

  try {
    const params: Record<string, string> = {
      q,
      media_type: mediaType,
      page,
      page_size: "24",
    };
    if (yearStart) params.year_start = yearStart;
    if (yearEnd) params.year_end = yearEnd;

    const { data } = await axios.get(`${NASA_IMAGES_API}/search`, {
      params,
      timeout: 15000,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.reason || "Failed to fetch NASA media" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
