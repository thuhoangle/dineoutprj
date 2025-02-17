/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resizer.otstatic.com',
        port: '',
        pathname: '/v2/photos/xlarge/**',
      },
    ],
    domains: ['images.unsplash.com'],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: false,
      },
      {
        source: '/account',
        destination: '/account/profile',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
