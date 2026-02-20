import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NASA_IMAGES_API = "https://images-api.nasa.gov";

/**
 * Sounds of Space — queries the NASA Image & Video Library for audio assets.
 * The legacy /planetary/sounds endpoint is deprecated; this uses the media
 * search API filtered to media_type=audio, which hosts Voyager, Cassini,
 * and other space audio recordings.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "sounds";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "24";

  try {
    const { data } = await axios.get(`${NASA_IMAGES_API}/search`, {
      params: {
        q,
        media_type: "audio",
        page,
        page_size: limit,
      },
      timeout: 15000,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.reason || "Failed to fetch space sounds" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
