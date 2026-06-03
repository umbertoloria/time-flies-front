import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {},
  /* config options here */
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
