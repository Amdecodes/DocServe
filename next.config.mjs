import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default withNextIntl(nextConfig);
