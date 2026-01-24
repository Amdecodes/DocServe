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
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <VirtualAssistanceForm source="dashboard" />
      </div>
    </main>
  );
}
