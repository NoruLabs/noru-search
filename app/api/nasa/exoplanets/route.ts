import { NextRequest, NextResponse } from "next/server";

const EXOPLANET_BASE = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";    

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "50";
  const search = searchParams.get("search") || "";

  try {
    let whereClause = "default_flag=1";
    if (search) {
      const safeSearch = encodeURIComponent(search.replace(/'/g, "''")); // Sanitize SQL injection
      whereClause += `+AND+(pl_name+LIKE+'%25${safeSearch}%25'+OR+hostname+LIKE+'%25${safeSearch}%25')`;
    }

    let query = `SELECT+pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,st_spectype,st_teff,sy_dist,pl_orbsmax+FROM+ps+WHERE+${whereClause}+ORDER+BY+disc_year+DESC`;
    
    // Only add TOP limit if explicitly requested
    if (limit && limit !== "0") {
      query = `SELECT+TOP+${limit}+pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,st_spectype,st_teff,sy_dist,pl_orbsmax+FROM+ps+WHERE+${whereClause}+ORDER+BY+disc_year+DESC`;
    }

    const response = await fetch(`${EXOPLANET_BASE}?query=${query}&format=json`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exoplanet data: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Exoplanet fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
