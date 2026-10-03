import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
