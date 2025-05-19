/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'plus.unsplash.com',
      'placebear.com',
      'resizer.otstatic.com',
      'oissfgnrpjfveyjaokgk.supabase.co',
      'images.unsplash.com',
      'lh5.googleusercontent.com',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resizer.otstatic.com',
        pathname: '/v2/photos/xlarge/**',
      },
      {
        protocol: 'https',
        hostname: 'oissfgnrpjfveyjaokgk.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
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
