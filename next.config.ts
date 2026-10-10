import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.GITHUB_PAGES_BASE_PATH || "",
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_PAGES_BASE_PATH || "",
  },
  images: { unoptimized: true },
};

export default nextConfig;
