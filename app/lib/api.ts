import axios from "axios";

// ── Internal API client (calls our own route handlers — key stays server-side) ──
export const api = axios.create({
  baseURL: "/api/nasa",
  timeout: 30000,
});

// ── Error handler ──
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      if (status === 429) return "Rate limit exceeded. Please wait a moment.";
      if (status === 403) return "API key is invalid or expired.";
      if (status >= 500) return "NASA servers are temporarily unavailable.";
      return `Request failed (${status}). Please try again.`;
    }
    if (error.code === "ECONNABORTED") return "Request timed out. Try again.";
    return "Network error. Check your connection.";
  }
  return "An unexpected error occurred.";
}
