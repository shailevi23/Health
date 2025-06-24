/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
        'utf-8-validate': false,
        bufferutil: false
      };
    }
    return config;
  },
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['cmgsdgyjrwdermgxokxf.supabase.co'],
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cmgsdgyjrwdermgxokxf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  runtime: 'edge'
};

module.exports = nextConfig; 