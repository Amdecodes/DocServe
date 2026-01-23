import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/navigation";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { CVProvider } from "@/components/cv/CVContext"; // Import Provider
import Header from "@/components/landing/Header";

export default async function TemplatesPage() {
  const t = await getTranslations("TemplatesPage");

  return (
    <CVProvider>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t("description")}
            </p>

            <div className="flex justify-center gap-4">
              {/* Search or Filters could go here later */}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-500">{t("select")}</p>
            {/* Filter dropdowns could go here */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Template Gallery */}
            <TemplateGallery />
          </div>
        </div>
      </div>
    </CVProvider>
  );
}
