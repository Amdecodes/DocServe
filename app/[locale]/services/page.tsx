import { FileText, Headset, Printer } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import Header from "@/components/landing/Header"; // Reusing landing header for now
import Footer from "@/components/landing/Footer"; // Reusing landing footer for now
import { useTranslations } from "next-intl";

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <ServiceCard
              title={t("resumeTitle")}
              description={t("resumeDescription")}
              price={t("resumePrice")}
              href="/form/cv"
              icon={<FileText className="h-6 w-6" />}
              popular
            />

            <ServiceCard
              title={t("vaTitle")}
              description={t("vaDescription")}
              price={t("vaPrice")}
              href="/form/virtual-assistance"
              icon={<Headset className="h-6 w-6" />}
            />

            <ServiceCard
              title={t("printTitle")}
              description={t("printDescription")}
              price={t("printPrice")}
              href="/print-orders"
              icon={<Printer className="h-6 w-6" />}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
