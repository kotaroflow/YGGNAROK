import path from "node:path";
import type { NextConfig } from "next";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const ONE_HOUR_IN_SECONDS = 60 * 60;

const GLOBAL_SECURITY_HEADERS = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-site",
  },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: `max-age=${ONE_YEAR_IN_SECONDS}; includeSubDomains`,
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    root: path.join(__dirname),
  },
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: GLOBAL_SECURITY_HEADERS,
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`,
          },
        ],
      },
      {
        source: "/auth-art/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`,
          },
        ],
      },
      {
        source: "/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_HOUR_IN_SECONDS}, stale-while-revalidate=${ONE_YEAR_IN_SECONDS}`,
          },
        ],
      },
      {
        source: "/:path*.json",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_HOUR_IN_SECONDS}, stale-while-revalidate=${ONE_HOUR_IN_SECONDS}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
