"use client";

import { useTranslations } from "next-intl";
import { FileText, Edit3, CreditCard, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");

  const steps = [
    { icon: FileText, title: t("step1"), description: t("step1Desc") },
    { icon: Edit3, title: t("step2"), description: t("step2Desc") },
    { icon: CreditCard, image: "/images/chapa-logo.png", title: t("step3"), description: t("step3Desc") },
    { icon: Download, title: t("step4"), description: t("step4Desc") },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{t("title")}</h2>
          <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 overflow-hidden">
                {step.image ? (
                    <img src={step.image} alt="Chapa Logo" className="w-full h-full object-contain p-2" />
                ) : (
                    <step.icon className="w-8 h-16" />
                )}
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
