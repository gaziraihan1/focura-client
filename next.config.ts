import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  images: {
    remotePatterns: [
      // Cloudinary - user avatars, file uploads, project images
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Google OAuth user avatars
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // GitHub user avatars
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // Unsplash - marketing/hero images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
