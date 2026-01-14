"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Clock, Layout, BadgeCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const t = useTranslations("WhyChooseUs");

  const reasons = [
    { icon: CheckCircle, label: t("point1") },
    { icon: Clock, label: t("point2") },
    { icon: Layout, label: t("point3") },
    { icon: BadgeCheck, label: t("point4") },
    { icon: Lock, label: t("point5") },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-charcoal text-white rounded-3xl p-10 md:p-16 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t("title")}</h2>
              <div className="h-1 w-20 bg-secondary rounded-full" />
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <reason.icon className="w-6 h-6 text-secondary flex-shrink-0" />
                  <span className="font-medium">{reason.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
