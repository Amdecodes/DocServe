import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Preview from "@/components/landing/Preview";
import PaymentTrust from "@/components/landing/PaymentTrust";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
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
