/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'iwklappbackend-production.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: '*.up.railway.app',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://iwklappbackend-production.up.railway.app/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://iwklappbackend-production.up.railway.app/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
