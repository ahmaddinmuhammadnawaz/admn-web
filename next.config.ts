import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Adjust this size as your database grows
    },
  },
};

export default nextConfig;