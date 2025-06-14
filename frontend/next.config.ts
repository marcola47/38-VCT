import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "@/app/components",
      "@/libs/formatters",
      "@/libs/helpers",
      "@/libs/hooks",
      "@/libs/validators",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "https",
        hostname: "api.pagar.me"
      },
      {
        protocol: "https",
        hostname: "utfs.io"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
    ]
  },
};

export default nextConfig;
