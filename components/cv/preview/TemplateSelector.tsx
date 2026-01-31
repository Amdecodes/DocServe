import { useState, useEffect } from "react";
import { TEMPLATES } from "@/config/templates";
import { useCV } from "@/components/cv/CVContext";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, LayoutList, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TemplateSelectorProps {
  layout?: "horizontal" | "vertical";
  onSelect?: () => void;
}

export function TemplateSelector({ layout = "horizontal", onSelect }: TemplateSelectorProps) {
  const { selectedTemplate, setTemplate } = useCV();
  const [isExpanded, setIsExpanded] = useState(true);
  const t = useTranslations("Templates");

  // Auto-minimize after selection ONLY on horizontal/mobile
  const handleSelect = (id: string) => {
    setTemplate(id);
    if (onSelect) onSelect();
    if (layout === "horizontal") {
      setTimeout(() => setIsExpanded(false), 400); // Snappier
    }
  };

  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];
  const isVertical = layout === "vertical";

  // Effect to scroll active template into view
  useEffect(() => {
    if (isExpanded) {
      const activeEl = document.getElementById(`template-${selectedTemplate}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedTemplate, isExpanded]);

  return (
    <div className={cn("w-full relative", isVertical ? "h-full" : "")}>
      <AnimatePresence mode="wait">
        {/* Vertical mode is ALWAYS expanded; Horizontal uses isExpanded state */}
        {(isVertical || isExpanded) ? (
          <motion.div
            key="expanded"
            initial={isVertical ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isVertical ? undefined : { opacity: 0, y: 10 }}
            className={cn(
              "flex gap-2",
              isVertical ? "flex-col h-full overflow-y-auto no-scrollbar py-2" : "flex-col"
            )}
          >
            {/* Header - simple text in vertical mode */}
            <div className={cn(
              "flex items-center justify-between px-2 mb-2 shrink-0",
              isVertical && "flex-col gap-2 items-center text-center px-1"
            )}>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-display">
                <Settings2 className="w-3 h-3" /> {isVertical ? "Themes" : t("title") || "Themes"}
              </span>
              {!isVertical && (
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight transition-colors"
                >
                  Done
                </button>
              )}
            </div>

            {/* Template List */}
            <div className={cn(
              "flex no-scrollbar scroll-smooth snap-x snap-mandatory items-center px-1",
              isVertical ? "flex-col gap-5 overflow-y-auto pb-8" : "flex-row gap-3 overflow-x-auto py-1"
            )}>
              {TEMPLATES.map((template) => {
                const isActive = selectedTemplate === template.id;
                
                return (
                  <button
                    key={template.id}
                    id={`template-${template.id}`}
                    onClick={() => handleSelect(template.id)}
                    className={cn(
                      "group relative flex flex-col shrink-0 transition-all duration-300 ease-out snap-center focus:outline-none",
                      isActive 
                        ? (isVertical ? "w-20 -translate-y-1" : "w-20 -translate-y-1") 
                        : (isVertical ? "w-16 opacity-70 hover:opacity-100 hover:-translate-y-1" : "w-14 hover:-translate-y-1 opacity-70 hover:opacity-100"),
                    )}
                  >
                    <div className={cn(
                      "relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-300 bg-white shadow-sm",
                      isActive 
                        ? "border-teal-500 shadow-md ring-2 ring-teal-500/10" 
                        : "border-gray-200 bg-white/50 hover:border-teal-300"
                    )}>
                      {template.previewImage ? (
                        <Image 
                          src={template.previewImage} 
                          alt={template.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100px, 150px"
                        />
                      ) : (
                        <div 
                          className="absolute inset-0 opacity-80"
                          style={{
                            background: `linear-gradient(45deg, ${template.colorScheme.primary} 0%, ${template.colorScheme.secondary} 100%)`
                          }}
                        />
                      )}
                      
                      {isActive && (
                        <div className="absolute inset-0 bg-teal-500/5 backdrop-blur-[1px]" />
                      )}

                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-teal-500 text-white p-1 rounded-full shadow-lg scale-110">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-1 text-center">
                      <span className={cn(
                        "block text-[8px] font-bold transition-colors truncate px-1",
                        isActive ? "text-teal-600" : "text-gray-400 group-hover:text-teal-500"
                      )}>
                        {t(`${template.id}.name`)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Collapsed Pill (Only for mobile/horizontal) */
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 w-full bg-white/40 hover:bg-white/60 transition-all duration-300 rounded-xl p-1.5 group pr-4 shadow-sm border border-white/50"
          >
            <div className="relative w-10 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
               {activeTemplate.previewImage ? (
                  <Image 
                    src={activeTemplate.previewImage} 
                    alt="" 
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
               ) : (
                  <div className="w-full h-full" style={{ background: activeTemplate.colorScheme.primary }} />
               )}
               <div className="absolute inset-0 bg-black/5" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Theme</span>
              <span className="text-xs font-bold text-gray-800 truncate leading-none">{t(`${activeTemplate.id}.name`)}</span>
            </div>
            <div className="ml-auto flex items-center gap-1 text-teal-600 group-hover:translate-x-1 transition-transform">
              <span className="text-[10px] font-bold uppercase">Change</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
