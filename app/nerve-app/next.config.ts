import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'ik.imagekit.io',
      protocol: 'https'
    }]
  }
  /* config options here */
};

export default nextConfig;
