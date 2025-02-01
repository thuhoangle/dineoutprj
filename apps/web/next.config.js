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
  },
};

export default nextConfig;
