import Header from "@/components/landing/Header";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function PricesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-10">
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
