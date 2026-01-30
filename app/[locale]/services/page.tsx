import { FileText, Headset, Printer, Scroll, Laptop } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { useTranslations } from "next-intl";

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <div className="flex-1 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {/* Hero Section */}
          <div className="mb-20 text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-light">
              {t("description")}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Resume Builder */}
            <ServiceCard
              title={t("resumeTitle")}
              description={t("resumeDescription")}
              price={t("resumePrice")}
              href="/resumes/templates"
              icon={<FileText className="h-6 w-6 text-blue-600" />}
              popular
            />

            {/* Agreement Services - NEW */}
            <ServiceCard
              title={t("agreementTitle")}
              description={t("agreementDescription")}
              price={t("agreementPrice")}
              href="/agreements"
              icon={<Scroll className="h-6 w-6 text-orange-600" />}
            />

            {/* Virtual Assistance */}
            <ServiceCard
              title={t("vaTitle")}
              description={t("vaDescription")}
              price={t("vaPrice")}
              href="/form/virtual-assistance"
              icon={<Headset className="h-6 w-6 text-purple-600" />}
            />

            {/* Printing */}
            <ServiceCard
              title={t("printTitle")}
              description={t("printDescription")}
              price={t("printPrice")}
              href="/print-orders"
              icon={<Printer className="h-6 w-6 text-teal-600" />}
            />

            {/* Web Development */}
            <ServiceCard
              title={t("webDevTitle")}
              description={t("webDevDescription")}
              price={t("webDevPrice")}
              href="/services/web-development"
              icon={<Laptop className="h-6 w-6 text-blue-600" />}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
