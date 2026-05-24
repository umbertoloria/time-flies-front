import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    API_ENDPOINT: 'https://tfapi.umbertoloria.com:8443',
  },
  /* config options here */
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
