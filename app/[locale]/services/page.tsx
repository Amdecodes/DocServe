import { FileText, PenTool } from "lucide-react"
import { ServiceCard } from "@/components/services/ServiceCard"
import Header from "@/components/landing/Header"; // Reusing landing header for now
import Footer from "@/components/landing/Footer"; // Reusing landing footer for now
import { useTranslations } from "next-intl"

export default function ServicesPage() {
  const t = useTranslations("ServicesPage")
  
  return (
    <main className="min-h-screen bg-gray-50/50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t("description")}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            title={t("cvTitle")}
            description={t("cvDescription")}
            price={t("cvPrice")}
            href="/services/cv/templates"
            icon={<FileText className="h-6 w-6" />}
            popular
          />
          
          <ServiceCard
            title={t("letterTitle")}
            description={t("letterDescription")}
            price={t("letterPrice")}
            href="#"
            icon={<PenTool className="h-6 w-6" />}
          />

          {/* Placeholder for future service */}
          <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center text-gray-400">
            <p className="font-medium">{t("comingSoon")}</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
