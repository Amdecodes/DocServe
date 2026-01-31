import { WebDevForm } from "@/components/web-dev/WebDevForm";
import { useTranslations } from "next-intl";

export default function WebDevelopmentPage() {
  const t = useTranslations("WebDevelopment");

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      <WebDevForm />
    </div>
  );
}
