"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  const t = useTranslations("Hero");
  const tTemplates = useTranslations("Templates");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const templates = [
    {
      id: "golden",
      image: "/images/templet-previev/golden-excutive.png",
    },
    {
      id: "elegant",
      image: "/images/templet-previev/elegant-sidebar.png",
    },
    {
      id: "modern-dark",
      image: "/images/templet-previev/modern-gold.png",
    },
    {
      id: "modern-sidebar",
      image: "/images/templet-previev/modern-sidebar.png",
    },
    {
      id: "corporate-focus",
      image: "/images/templet-previev/corporatr.png",
    },
    {
      id: "minimalist-teal",
      image: "/images/templet-previev/teal.png",
    },
    {
      id: "creative-split",
      image: "/images/templet-previev/crative-split.png",
    },
    {
      id: "executive-maroon",
      image: "/images/templet-previev/excutive.png",
    },
    {
      id: "emerald-professional",
      image: "/images/templet-previev/emraled.png",
    },
    {
      id: "freshman-entry",
      image: "/images/templet-previev/fresheman.png",
    },
    {
      id: "lavender-executive",
      image: "/images/templet-previev/lavender.png",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = 236; // Approx width of card (220px) + gap (16px)
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Run initial check
      handleScroll();
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-white">
      {/* Background radial glows */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-radial from-primary/5 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-radial from-secondary/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-[38%] xl:w-[35%] text-center lg:text-left z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-charcoal leading-tight mb-6 tracking-tight text-balance"
            >
              {t("title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-balance"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              {/* Desktop: Go to Template Gallery */}
              <Link
                href="/resumes/templates"
                className="hidden md:block w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-white text-base md:text-lg px-8 py-6 rounded-full w-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {t("ctaPrimary")}
                </Button>
              </Link>

              {/* Mobile: Direct to Builder (Bypass Gallery) */}
              <Link
                href="/form/cv?template=golden"
                className="md:hidden w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-white text-base md:text-lg px-8 py-6 rounded-full w-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {t("ctaPrimary")}
                </Button>
              </Link>

              <Link href="/form/virtual-assistance" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary/5 text-base md:text-lg px-8 py-6 rounded-full w-full font-semibold transition-all duration-300 cursor-pointer"
                >
                  {t("ctaSecondary")}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Template Gallery - Right Side with Carousel */}
          <div className="w-full lg:w-[62%] xl:w-[65%] relative group">
            {/* Left Scroll Button */}
            <AnimatePresence>
              {showLeftArrow && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll("left")}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white border border-gray-200/80 text-gray-700 hover:text-primary rounded-full p-3 shadow-lg z-20 cursor-pointer transition-all duration-200 hidden md:flex items-center justify-center hover:scale-105 active:scale-95 backdrop-blur-xs"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Right Scroll Button */}
            <AnimatePresence>
              {showRightArrow && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll("right")}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white border border-gray-200/80 text-gray-700 hover:text-primary rounded-full p-3 shadow-lg z-20 cursor-pointer transition-all duration-200 hidden md:flex items-center justify-center hover:scale-105 active:scale-95 backdrop-blur-xs"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Carousel Container */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory no-scrollbar scroll-smooth w-full"
            >
              {templates.map((template, idx) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * idx }}
                  className="flex-shrink-0 w-[160px] xs:w-[180px] sm:w-[200px] md:w-[220px] snap-center"
                >
                  <Link href={`/form/cv?template=${template.id}`}>
                    <div className="group flex flex-col items-center cursor-pointer">
                      {/* Image Wrapper */}
                      <div className="relative aspect-[1/1.4] w-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100/55 transition-all duration-300 group-hover:-translate-y-2">
                        <Image
                          src={template.image}
                          alt={tTemplates(`${template.id}.name`)}
                          fill
                          sizes="(max-width: 768px) 180px, 220px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                          priority={idx < 3}
                        />
                        {/* Subtle hover overlay */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                      {/* Title */}
                      <span className="mt-4 text-xs sm:text-sm md:text-base font-bold text-charcoal group-hover:text-primary transition-colors text-center font-sans tracking-tight">
                        {tTemplates(`${template.id}.name`)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
