"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Preview() {
  const t = useTranslations("Preview");

  return (
    <section className="py-20 bg-lightbg">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{t("title")}</h2>
        <div className="h-1 w-20 bg-secondary mx-auto rounded-full mb-12" />

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* CV Preview */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative group"
          >
             <div className="w-full max-w-sm aspect-[1/1.4] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                <span className="text-gray-400 font-medium">CV Preview</span>
             </div>
             <p className="mt-4 font-medium text-charcoal">{t("cvLabel")}</p>
          </motion.div>

          {/* Agreement Preview */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="relative group"
          >
             <div className="w-full max-w-sm aspect-[1/1.4] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                <span className="text-gray-400 font-medium">Agreement Preview</span>
             </div>
             <p className="mt-4 font-medium text-charcoal">{t("agreementLabel")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
