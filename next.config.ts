import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido 'output: export' para habilitar ISR
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx']
};

export default nextConfig;
