import { NextRequest, NextResponse } from "next/server";

const TAP_API_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";

  let condition = "";
  let order = "disc_year DESC";

  if (filter === "hot") condition = "pl_eqt > 1000";
  if (filter === "cold") condition = "pl_eqt < 150 AND pl_eqt > 0";
  if (filter === "big") condition = "pl_rade > 2";
  if (filter === "far") condition = "sy_dist > 1000";
  if (filter === "recent") order = "disc_year DESC";

  const queryStr = `SELECT TOP 20 pl_name, hostname, disc_year, pl_rade, pl_bmasse, pl_eqt, sy_dist, discoverymethod, pl_orbper FROM pscomppars ${
    condition ? "WHERE " + condition + " AND " : "WHERE "
  } disc_year IS NOT NULL ORDER BY ${order}`;

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(`${TAP_API_URL}?query=${encodeURIComponent(queryStr)}&format=json`, {
        next: { revalidate: 3600 },
      });
      
      if (!response.ok) {
        if (response.status === 502 || response.status === 504 || response.statusText.includes("Proxy Error")) {
          // Caltech randomly drops connection with Proxy Error, retry
          retries--;
          if (retries === 0) throw new Error(`Caltech TAP API unreachable: ${response.statusText}`);
          await new Promise(r => setTimeout(r, 2000)); // wait 2s before retry
          continue;
        }
        throw new Error(`Failed to fetch exoplanets: ${response.statusText}`);
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error: any) {
      if (retries > 1 && error?.message?.includes("fetch")) {
        retries--;
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      console.error("Exoplanet fetch error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
}
