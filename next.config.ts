import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "apod.nasa.gov" },
      { protocol: "https", hostname: "mars.nasa.gov" },
      { protocol: "https", hostname: "mars.jpl.nasa.gov" },
    ],
  },
};

export default nextConfig;
