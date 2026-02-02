import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Preview from "@/components/landing/Preview";
import PaymentTrust from "@/components/landing/PaymentTrust";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SENEDX - #1 Document & Resume Builder in Ethiopia",
  description: "Build professional CVs, Resumes, and Cover Letters in minutes. Trusted by Ethiopian professionals. ATS-friendly templates, instant PDF download.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SENEDX",
    "url": "https://senedx.com",
    "logo": "https://senedx.com/logo.png",
    "description": "Professional document services in Ethiopia.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://senedx.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Preview />
      <PaymentTrust />
      <CTA />
      <Footer />
    </main>
  );
}
