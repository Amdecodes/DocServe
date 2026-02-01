"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PrintProduct } from "@/types/print";
import { ProductCard } from "@/components/print/ProductCard";
import {
  PRINT_CATEGORIES,
  CATEGORY_ITEMS,
  PrintCategory,
} from "@/config/print-categories";
import {
  Megaphone,
  Shirt,
  StickyNote,
  BookOpen,
  ChevronRight,
  Store,
  ArrowLeft,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface PrintCatalogProps {
  products: PrintProduct[];
}

const CATEGORY_ICONS = {
  [PRINT_CATEGORIES.CARDS]: BookOpen,
  [PRINT_CATEGORIES.MARKETING]: Megaphone,
  [PRINT_CATEGORIES.MERCHANDISE]: Shirt,
  [PRINT_CATEGORIES.STATIONERY]: StickyNote,
};

export function PrintCatalog({ products }: PrintCatalogProps) {
  const t = useTranslations("PrintOrders");
  const [activeCategory, setActiveCategory] = useState<string>(
    PRINT_CATEGORIES.CARDS,
  );
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(
    null,
  );
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to content when category/subcategory changes (Mobile UX)
  useEffect(() => {
    if (contentRef.current && window.innerWidth < 1024) {
      // Small timeout to allow render to complete
      setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [activeCategory, activeSubCategory]);

  const subCategories = CATEGORY_ITEMS[activeCategory as PrintCategory] || [];

  const filteredProducts = products.filter(
    (p) =>
      (p.category || PRINT_CATEGORIES.MARKETING) === activeCategory &&
      (!activeSubCategory || p.sub_category === activeSubCategory),
  );

  // Also filter products if we are in "Folder View" (no subcategory selected)
  // to show a preview count or something, but actually we only need filteredProducts
  // when activeSubCategory IS set.

  return (
    <div className="space-y-12">
      {/* Category Folders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(PRINT_CATEGORIES).map((category) => {
          const Icon = CATEGORY_ICONS[category];
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setActiveSubCategory(null);
              }}
              className={cn(
                "relative group flex flex-col items-start p-6 rounded-3xl transition-all duration-300 border text-left outline-none",
                isActive
                  ? "bg-white border-teal-500 shadow-xl shadow-teal-900/5 scale-[1.02]"
                  : "bg-white/80 border-transparent hover:border-gray-200 hover:shadow-lg hover:-translate-y-1",
              )}
            >
              {/* Folder Tab Effect */}
              <div
                className={cn(
                  "absolute top-0 left-6 -mt-3 h-4 w-24 rounded-t-lg transition-colors duration-300",
                  isActive
                    ? "bg-teal-500"
                    : "bg-gray-100 group-hover:bg-gray-200",
                )}
              />

              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                  isActive
                    ? "bg-teal-50 text-teal-600"
                    : "bg-gray-50 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600",
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              <h3
                className={cn(
                  "text-lg font-bold mb-2 transition-colors",
                  isActive
                    ? "text-gray-900"
                    : "text-gray-600 group-hover:text-gray-900",
                )}
              >
                {t(`categories.${category}`)}
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed mb-4 min-h-[40px]">
                {t(`categories.desc_${category}`)}
              </p>

              <div
                className={cn(
                  "mt-auto flex items-center text-xs font-bold uppercase tracking-wider transition-colors",
                  isActive
                    ? "text-teal-600"
                    : "text-gray-300 group-hover:text-teal-400",
                )}
              >
                {isActive ? t("viewing") : t("explore")}
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Subcategory Folders OR Products Grid */}
      <div ref={contentRef} className="scroll-mt-24">
        <AnimatePresence mode="wait">
          {!activeSubCategory ? (
            /* Level 2: Subcategory Folders */
            <motion.div
              key="subcategories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Folder className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">
                  {t(`categories.${activeCategory}`)} {t("categories.folders")}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subCategories.map((subCat) => {
                  // Filter products for this subcategory
                  const subCatProducts = products.filter(
                    (p) =>
                      p.category === activeCategory &&
                      p.sub_category === subCat,
                  );
                  const count = subCatProducts.length;
                  const firstProduct = subCatProducts[0];

                  return (
                    <button
                      key={subCat}
                      onClick={() => setActiveSubCategory(subCat)}
                      className={cn(
                        "group bg-white p-4 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all text-left flex items-center justify-between overflow-hidden relative",
                        firstProduct?.image_url ? "h-24 sm:h-28" : "h-auto",
                      )}
                    >
                      <div className="flex items-center gap-4 z-10 w-full">
                        {firstProduct?.image_url ? (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                            <Image
                              src={firstProduct.image_url}
                              alt={subCat}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="80px"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors shrink-0">
                            <Folder className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors truncate">
                            {/* User requested name instead of folder name if product exists */}
                            {firstProduct && firstProduct.name
                              ? firstProduct.name
                              : subCat}
                          </h3>
                          {/* If we showed product name, show subcat as label, else show count */}
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {firstProduct ? subCat : `${count} ${t("items")}`}
                          </p>
                        </div>
                      </div>

                      {/* Decorative Background for Image Cards */}
                      {firstProduct?.image_url && (
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-0 pointer-events-none" />
                      )}

                      <div className="relative z-10 shrink-0 pl-2">
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500" />
                      </div>
                    </button>
                  );
                })}

                {/* Fallback for items with no subcategory? Optional. */}
              </div>
            </motion.div>
          ) : (
            /* Level 3: Products */
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-[400px]"
            >
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={() => setActiveSubCategory(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {activeSubCategory}
                    <span className="text-gray-300 font-light">/</span>
                    <span className="text-base font-normal text-gray-500">
                      {t(`categories.${activeCategory}`)}
                    </span>
                  </h2>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Store className="w-8 h-8" />
                  </div>
                  <p className="text-gray-900 font-medium">{t("noProducts")}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("checkBackLater")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
