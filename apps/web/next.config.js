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
      {
        protocol: 'https',
        hostname: 'oissfgnrpjfveyjaokgk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
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
