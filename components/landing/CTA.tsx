"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function CTA() {
  const t = useTranslations("CallToAction");

  return (
    <section className="py-20 bg-primary text-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{t("text")}</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8 rounded-full">
            {t("cta1")}
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 rounded-full">
            {t("cta2")}
          </Button>
        </div>
      </div>
    </section>
  );
}
