import { TemplateCard } from "@/components/cv/templates/TemplateCard"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { useTranslations } from "next-intl"

const TEMPLATE_IDS = ["modern", "classic", "simple"]

export default function TemplateSelectionPage() {
  const t = useTranslations("TemplateSelectionPage")

  return (
    <div className="min-h-screen bg-gray-50/50">
       <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
            {t("title")}
          </h1>
          <p className="mb-12 text-lg text-gray-600">
            {t("description")}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_IDS.map((id) => (
            <TemplateCard
              key={id}
              id={id}
              name={t(`templates.${id}.name`)}
              description={t(`templates.${id}.description`)}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
