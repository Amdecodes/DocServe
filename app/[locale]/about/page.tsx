import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { getTranslations } from "next-intl/server";
import { ArrowRight, CheckCircle, Clock, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

// Dynamic metadata using translations
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{t("premiumTitle")}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900">
              {t("title")}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section - Re-centered without image as requested */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                {t("missionTitle")}
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
                {t("missionDescription")}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto my-8 rounded-full" />
              <p className="text-lg text-slate-500 leading-relaxed">
                {t("description")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-12 pt-8">
              <div className="flex items-center gap-3 justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span className="text-lg font-medium text-slate-700">{t("qualityTitle")}</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span className="text-lg font-medium text-slate-700">{t("speedTitle")}</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span className="text-lg font-medium text-slate-700">{t("supportTitle")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              {t("whyUsTitle")}
            </h2>
            <p className="text-lg text-slate-600">
              {t("premiumDescription")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t("qualityTitle")}</h3>
              <p className="text-slate-500 leading-relaxed">
                {t("qualityDesc")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t("speedTitle")}</h3>
              <p className="text-slate-500 leading-relaxed">
                {t("speedDesc")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t("supportTitle")}</h3>
              <p className="text-slate-500 leading-relaxed">
                {t("supportDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center shadow-2xl overflow-hidden relative">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600 rounded-full blur-[100px] opacity-30 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                {t("ctaTitle")}
              </h2>
              <p className="text-lg text-slate-300">
                {t("premiumDescription")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-6 h-auto" asChild>
                  <Link href="/services">
                    {t("ctaButton")} <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
