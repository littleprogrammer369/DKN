/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // PWA support
  headers: async () => [
    {
      source: '/sw.js',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
    },
  ],
  // API proxy — در حالت development درخواست‌های /api/* به NestJS هدایت شود
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['react-icons', 'date-fns-jalali'],
  },
};

module.exports = nextConfig;
