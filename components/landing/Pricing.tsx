"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";

export default function Pricing() {
  const t = useTranslations("Pricing");
  const [activeTab, setActiveTab] = useState<"resume" | "va">("resume");

  const vaPackages = ["basic", "professional", "elite"] as const;

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-display">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600">{t("subtitle")}</p>

          <div className="mt-8 inline-flex p-1 bg-white rounded-full border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === "resume"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("tabResume")}
            </button>
            <button
              onClick={() => setActiveTab("va")}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === "va"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("tabVA")}
            </button>
          </div>
        </div>

        {activeTab === "resume" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
              <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-primary to-blue-600"></div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {t("resume.title")}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {t("resume.description")}
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {t("resume.badge")}
                  </Badge>
                </div>

                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-extrabold text-gray-900">
                    100
                  </span>
                  <span className="text-xl text-gray-500 ml-2">ETB</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <li key={item} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                      <span className="text-gray-700">
                        {t(`resume.features.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/resumes/templates" className="block">
                  <Button className="w-full text-lg py-6" size="lg">
                    {t("resume.cta")}
                  </Button>
                </Link>
              </div>
              <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t border-gray-100">
                {t("resume.guarantee")}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {vaPackages.map((pkg) => (
                <div
                  key={pkg}
                  className={`bg-white rounded-2xl shadow-lg border relative flex flex-col ${pkg === "professional" ? "border-primary ring-1 ring-primary shadow-xl scale-105 z-10" : "border-gray-100 hover:border-gray-200"}`}
                >
                  {pkg === "professional" && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {t("va.mostPopular")}
                    </div>
                  )}

                  <div className="p-8 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t(`va.packages.${pkg}.title`)}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 h-10">
                      {t(`va.packages.${pkg}.bestFor`)}
                    </p>

                    {/* Price placeholder if needed, or just "Contact" */}
                    {/* <div className="text-3xl font-bold text-gray-900 mb-6">{t(`va.packages.${pkg}.price`)}</div> */}

                    <ul className="space-y-4 mb-8">
                      {[1, 2, 3, 4, 5].map((item) => {
                        const featureKey = `va.packages.${pkg}.features.${item}`;
                        return (
                          <li key={item} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                            <span className="text-sm text-gray-700">
                              {t(featureKey)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-2">
                      <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                        {t("va.outcomeLabel")}
                      </p>
                      <p className="text-sm font-medium text-gray-900 italic">
                        &quot;{t(`va.packages.${pkg}.outcome`)}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="p-8 pt-0 mt-auto">
                    <Link href="/form/virtual-assistance" className="block">
                      <Button
                        variant={pkg === "professional" ? "default" : "outline"}
                        className="w-full"
                      >
                        {t("va.cta")}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                {t("va.notesTitle")}
              </h4>
              <ul className="grid sm:grid-cols-2 gap-4 text-sm text-blue-800">
                <li className="flex items-center before:content-['•'] before:mr-2 before:text-blue-500">
                  {t("va.notes.1")}
                </li>
                <li className="flex items-center before:content-['•'] before:mr-2 before:text-blue-500">
                  {t("va.notes.2")}
                </li>
                <li className="flex items-center before:content-['•'] before:mr-2 before:text-blue-500">
                  {t("va.notes.3")}
                </li>
                <li className="flex items-center before:content-['•'] before:mr-2 before:text-blue-500">
                  {t("va.notes.4")}
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-blue-200 text-center">
                <p className="font-medium text-blue-900 text-lg">
                  {t("va.positioningLine")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
