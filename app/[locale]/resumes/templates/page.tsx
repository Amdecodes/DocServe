import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/navigation";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { CVProvider } from "@/components/cv/CVContext";
import Header from "@/components/landing/Header";
import { Sparkles } from "lucide-react";

export default async function TemplatesPage() {
  const t = await getTranslations("TemplatesPage");

  return (
    <CVProvider>
      <div className="min-h-screen bg-gray-50/50 pb-20">
        <Header />

        {/* Hero Section */}
        <div className="bg-white relative overflow-hidden pt-32 pb-20 border-b border-gray-100">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.4] pointer-events-none"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
              <Sparkles className="w-3 h-3" /> Professional CV Builder
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {t("description")}
            </p>
          </div>
        </div>

        {/* Templates Grid Section */}
        <div className="container mx-auto px-4 py-16 -mt-8 relative z-20">
          <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-sm">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Available Templates
                </h2>
                <p className="text-gray-500 mt-1">{t("select")}</p>
              </div>
              {/* Future Filters */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <TemplateGallery />
            </div>
          </div>
        </div>
      </div>
    </CVProvider>
  );
}
