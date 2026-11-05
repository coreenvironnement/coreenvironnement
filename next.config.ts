import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  async redirects() {
    return [
      {
        source: "/location-benne/paris",
        destination: "/location-benne/75-paris",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
