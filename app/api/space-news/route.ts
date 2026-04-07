import { NextResponse } from "next/server";
import axios from "axios";

const BASE = "https://api.spaceflightnewsapi.net/v4";

export const revalidate = 3600; // Cache for 1 hour

// Small asynchronous pause to avoid overwhelming the API firewall with requests connected at the exact same millisecond
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper for fetching with graceful fallback
async function fetchWithRetry(url: string, params: Record<string, any> = {}, delayMs: number = 0) {
  if (delayMs > 0) await delay(delayMs);

  const query = new URLSearchParams(params).toString();
  const fullUrl = query ? `${url}?${query}` : url;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds max instead of 10s

    // We use fetch instead of axios to leverage native Next.js caching
    const res = await fetch(fullUrl, {
      next: { revalidate: 3600 },
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[space-news] Non-200 response from ${url}: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    return data.results ?? [];
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`[space-news] Fetch request to ${url} timed out.`);
    } else {
      console.error(`[space-news] Fetch error for ${url}:`, error.message || error);
    }
    return [];
  }
}

export async function GET() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const publishedAtGte = yesterday.toISOString();

  try {
    // Stagger the start imperceptibly (100ms, 200ms) to prevent
    // the Cloudflare/Spaceflight firewall from rejecting connections (Connect Timeout).
    const [articles, blogs, reports] = await Promise.all([
      fetchWithRetry(`${BASE}/articles/`, { limit: 20, published_at_gte: publishedAtGte }, 0),
      fetchWithRetry(`${BASE}/blogs/`, { limit: 10 }, 100),
      fetchWithRetry(`${BASE}/reports/`, { limit: 10 }, 200)
    ]);

    let finalArticles = articles;

    // If there are too few articles, do a quick fallback
    if (finalArticles.length < 5) {
      const fallbackArticles = await fetchWithRetry(`${BASE}/articles/`, { limit: 30 });
      if (fallbackArticles.length > finalArticles.length) {
        finalArticles = fallbackArticles;
      }
    }

    return NextResponse.json({
      articles: finalArticles,
      blogs,
      reports,
    });
  } catch (err) {
    console.error("[space-news] Unexpected global error", err);
    return NextResponse.json(
      { error: "Failed to load space news", articles: [], blogs: [], reports: [] },
      { status: 500 }
    );
  }
}
