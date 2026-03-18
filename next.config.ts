import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demos.codezeel.com',
        pathname: '/wordpress/WCM08/**',
      },
    ],
  },
};

export default nextConfig;
