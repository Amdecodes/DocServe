"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { motion } from "framer-motion";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-linear-to-br from-lightbg to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-charcoal leading-tight mb-6"
            >
              {t("title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <Link href="/resumes/templates">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-white text-lg px-8 py-6 rounded-full w-full sm:w-auto"
                >
                  {t("ctaPrimary")}
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary/5 text-lg px-8 py-6 rounded-full w-full sm:w-auto"
                >
                  {t("ctaSecondary")}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Visual / Video */}
          <div className="flex-1 relative w-full max-w-xl">
            {/* Abstract Background Shapes - Animated */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-secondary/20 to-primary/10 rounded-full blur-3xl -z-10"
            />

            {/* Video Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.8,
              }}
              className="relative bg-white p-2 rounded-xl shadow-2xl border border-gray-100"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/LXb3EKWsInQ?si=placeholder"
                  title="Paperless Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
