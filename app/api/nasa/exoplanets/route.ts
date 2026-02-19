import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const EXOPLANET_BASE = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "50";
  const offset = searchParams.get("offset") || "0";
  const search = searchParams.get("search") || "";

  try {
    let whereClause = "default_flag=1";
    if (search) {
      whereClause += `+AND+pl_name+LIKE+'%25${search}%25'`;
    }

    const query = `SELECT+pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,st_spectype,st_teff,sy_dist,pl_orbsmax+FROM+ps+WHERE+${whereClause}+ORDER+BY+disc_year+DESC`;

    const { data } = await axios.get(EXOPLANET_BASE, {
      params: {
        query,
        format: "json",
      },
      paramsSerializer: () => `query=${query}&format=json`,
    });

    // The API may return a limited set, slice client-side
    const sliced = Array.isArray(data) ? data.slice(Number(offset), Number(offset) + Number(limit)) : data;
    return NextResponse.json(sliced);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: "Failed to fetch exoplanet data" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
