import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zemfyznetvnfzfkzauyg.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Ensure image optimization is enabled in production
    unoptimized: process.env.NODE_ENV === "development",
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
    ],
  },
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium", "sharp"],
  // Tell Next.js output tracer to include the Chromium binary files.
  // Without this, Vercel doesn't deploy the bin/ directory because nothing
  // statically imports it — @sparticuz/chromium reads it at runtime only.
  outputFileTracingIncludes: {
    "/api/pdf/download": [
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
    "/api/payment/chapa/webhook": [
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.senedx.com https://*.clerk.accounts.dev; connect-src 'self' https://clerk.senedx.com https://*.clerk.accounts.dev wss://*.clerk.accounts.dev https://utfs.io; img-src 'self' data: blob: https://zemfyznetvnfzfkzauyg.supabase.co https://utfs.io https://img.clerk.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
