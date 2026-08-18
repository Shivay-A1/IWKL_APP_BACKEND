/** @type {import('next').NextConfig} */
const nextConfig = {
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