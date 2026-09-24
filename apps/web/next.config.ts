import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@forgefit/domain", "@forgefit/supabase", "@forgefit/ui"],
  typedRoutes: true,
  turbopack: { root: path.resolve(process.cwd(), "../..") },
  // Routes from before the four-section navigation. Temporary (307) while the structure settles.
  async redirects() {
    return [
      { source: "/dashboard", destination: "/today", permanent: false },
      { source: "/workout", destination: "/train", permanent: false },
      { source: "/exercises", destination: "/train/exercises", permanent: false },
      { source: "/diet", destination: "/nutrition", permanent: false },
      { source: "/grocery", destination: "/nutrition/grocery", permanent: false },
      { source: "/recipes/:id", destination: "/nutrition/recipes/:id", permanent: false },
      { source: "/shop", destination: "/train/equipment", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
