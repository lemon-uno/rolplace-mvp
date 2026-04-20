import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    mcpServer: true,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kkwmeitllnobphblxhio.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
