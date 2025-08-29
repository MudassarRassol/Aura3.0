import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint ko build ke time ignore karega
  },
};

export default nextConfig;
