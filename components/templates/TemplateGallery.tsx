"use client";

import { useCV } from "@/components/cv/CVContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { TEMPLATES } from "@/config/templates";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import Image from "next/image";

export function TemplateGallery() {
  const { setTemplate } = useCV();
  const router = useRouter();
  const t = useTranslations("Templates");

  const handleSelect = (templateId: string) => {
    setTemplate(templateId);
    router.push("/form/cv");
  };

  return (
    <>
      {TEMPLATES.map((template, idx) => (
        <div
          key={template.id}
          className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
        >
          {/* Badge overlays */}
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            {idx === 0 && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 font-semibold shadow-sm">
                <Star className="w-3 h-3 mr-1 fill-current" /> Popular
              </Badge>
            )}
            {template.tags.includes("ats") && (
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm shadow-sm font-medium"
              >
                <Check className="w-3 h-3 mr-1" /> ATS
              </Badge>
            )}
          </div>

          {/* Preview Image Area */}
          <div className="aspect-[210/297] bg-gray-100 relative overflow-hidden group-hover:bg-gray-50 transition-colors">
            {/* Real preview image or fallback */}
            <div className="absolute inset-0 p-4 transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="relative w-full h-full shadow-lg rounded-sm overflow-hidden bg-white">
                <Image
                  src={template.previewImage || "/images/cv-preview.jpg"}
                  alt={template.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* Hover overlay with Action */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 backdrop-blur-[2px]">
              <Button
                onClick={() => handleSelect(template.id)}
                size="lg"
                className="w-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-primary hover:bg-primary/90 text-white rounded-full"
              >
                {t("useThisTemplate")}
              </Button>
            </div>
          </div>

          {/* Info Area */}
          <div className="p-5 border-t border-gray-50 bg-white relative z-20">
            <div className="mb-2">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors flex items-center justify-between">
                {t(`${template.id}.name`)}
                {/* Arrow icon that appears on hover */}
                {/* <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-primary" /> */}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {t(`${template.id}.description`)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-[10px] text-gray-400 py-1">
                  + {template.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
