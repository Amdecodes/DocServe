import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zemfyznetvnfzfkzauyg.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
    // Disable image optimization for Supabase signed URLs since they already include tokens
    unoptimized: process.env.NODE_ENV === 'production' ? false : true,
  },
};

export default withNextIntl(nextConfig);
