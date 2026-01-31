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
    formats: ['image/avif', 'image/webp'],
    // Ensure image optimization is enabled in production
    unoptimized: process.env.NODE_ENV === 'development',
  },
  output: 'standalone',
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
    ],
  },
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
};

export default withNextIntl(nextConfig);
