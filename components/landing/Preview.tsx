"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Preview() {
  const t = useTranslations("Preview");

  const images = [
    "/images/auto play/Pasted image.png",
    "/images/auto play/Pasted image (2).png",
    "/images/auto play/Pasted image (3).png",
    "/images/auto play/Pasted image (4).png",
    "/images/auto play/Pasted image (5).png",
    "/images/auto play/Pasted image (6).png",
    "/images/auto play/Pasted image (7).png",
    "/images/auto play/Pasted image (8).png",
    "/images/auto play/Pasted image (9).png",
    "/images/auto play/shirt-1.png",
    "/images/auto play/shirt-2.jpg",
 
  ];

  return (
    <section className="py-20 bg-lightbg">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{t("title")}</h2>
        <div className="h-1 w-20 bg-secondary mx-auto rounded-full mb-12" />

        <div className="relative w-full overflow-hidden">
          {/* Gradient Overlay Left */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-lightbg to-transparent z-10" />
          
          {/* Gradient Overlay Right */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-lightbg to-transparent z-10" />

          <motion.div 
             className="flex gap-6 md:gap-8"
             animate={{ x: ["0%", "-50%"] }}
             transition={{ 
               repeat: Infinity, 
               ease: "linear", 
               duration: 30 
             }}
             style={{ width: "fit-content" }}
          >
            {[...images, ...images].map((src, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-64 md:w-80 aspect-[1/1.4] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative"
              >
                <Image 
                  src={src} 
                  alt="Document Preview" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 320px"
                  quality={75}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
