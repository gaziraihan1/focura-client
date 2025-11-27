import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next.config.js
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ALLOWS ALL DOMAINS
      },
    ],
  
}

};

export default nextConfig;
