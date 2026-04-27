import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },

      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
    domains: ["localhost", "127.0.0.1", "i.ibb.co"],
  },
};

export default nextConfig;
