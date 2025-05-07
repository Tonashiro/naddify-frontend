import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.discordapp.com",
        protocol: "https",
      },
      { hostname: "iitbmzodvfigdiuiozwt.supabase.co", protocol: "https" },
    ],
  },
};

export default nextConfig;
