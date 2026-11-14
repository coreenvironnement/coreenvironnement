import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

import { IMAGE_LEGACY_REDIRECTS } from "./lib/media/image-legacy-redirects";

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
      ...IMAGE_LEGACY_REDIRECTS,
    ];
  },
};

export default nextConfig;
