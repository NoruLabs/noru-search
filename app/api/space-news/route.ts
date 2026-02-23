import { NextResponse } from "next/server";
import axios from "axios";

const BASE = "https://api.spaceflightnewsapi.net/v4";

/**
 * Space News API route: fetches latest articles, blogs, and reports
 * from Space Flight News API (no API key). Cached for daily refresh.
 */
export const revalidate = 86400; // 24 hours

export async function GET() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const publishedAtGte = yesterday.toISOString();

  try {
    const [articlesRes, blogsRes, reportsRes] = await Promise.all([
      axios.get(`${BASE}/articles/`, {
        params: {
          _limit: 10,
          published_at_gte: publishedAtGte,
        },
        timeout: 15000,
      }),
      axios.get(`${BASE}/blogs/`, {
        params: { _limit: 5 },
        timeout: 10000,
      }),
      axios.get(`${BASE}/reports/`, {
        params: { _limit: 3 },
        timeout: 10000,
      }),
    ]);

    const articles = articlesRes.data?.results ?? [];
    const blogs = blogsRes.data?.results ?? [];
    const reports = reportsRes.data?.results ?? [];

    // If filtered articles are too few, fetch without date filter
    if (articles.length < 5) {
      const fallback = await axios.get(`${BASE}/articles/`, {
        params: { _limit: 10 },
        timeout: 15000,
      });
      const fallbackResults = fallback.data?.results ?? [];
      if (fallbackResults.length > articles.length) {
        return NextResponse.json({
          articles: fallbackResults,
          blogs,
          reports,
        });
      }
    }

    return NextResponse.json({
      articles,
      blogs,
      reports,
    });
  } catch (err) {
    console.error("[space-news]", err);
    return NextResponse.json(
      { error: "Failed to load space news", articles: [], blogs: [], reports: [] },
      { status: 502 }
    );
  }
}
