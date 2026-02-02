import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SENEDX - Professional Document Services for Ethiopia",
    template: "%s | SENEDX",
  },
  description: "Create professional CVs, cover letters, and legal documents online in Ethiopia. Fast, easy, and print-ready templates for job seekers and businesses.",
  keywords: ["legal documents", "Ethiopia contracts", "online agreements", "print-ready contracts", "SENEDX", "document services Ethiopia"],
  authors: [{ name: "SENEDX Team" }],
  openGraph: {
    title: "SENEDX - Professional Document Services",
    description: "Create professional documents online. Fast, easy, and print-ready.",
    url: "https://senedx.com",
    siteName: "SENEDX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SENEDX Professional Documents",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SENEDX - Professional Document Services",
    description: "Create professional documents online. Fast, easy, and print-ready.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://senedx.com",
    languages: {
      "en-US": "https://senedx.com/en",
      "am-ET": "https://senedx.com/am",
    },
  },
  verification: {
    google: "IxM9WZ1vze2Dqy56X6GlTXjQfufjX24C75EOzYXD6_g",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen bg-lightbg text-charcoal font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

