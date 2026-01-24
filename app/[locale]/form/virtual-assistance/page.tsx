import { VirtualAssistanceForm } from "@/components/virtual-assistance/VirtualAssistanceForm";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "VirtualAssistance" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default function VirtualAssistancePage() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-6 md:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-50/50 to-transparent -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <VirtualAssistanceForm source="dashboard" />
      </div>
    </main>
  );
}
