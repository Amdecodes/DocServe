"use client";

import { useCV } from "@/components/cv/CVContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { TEMPLATES } from "@/config/templates"; // Import from central config

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
      {TEMPLATES.map((template) => (
        <div
          key={template.id}
          className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
          {/* Preview Image Area */}
          <div className="aspect-210/297 bg-gray-200 relative overflow-hidden">
            {/* Placeholder since we might not have real images yet */}
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              {t("previewNotAvailable")}
            </div>

            {/* This overlay appears on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleSelect(template.id)}
                className="bg-teal-600 text-white px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg hover:bg-teal-700"
              >
                {t("useThisTemplate")}
              </button>
            </div>
          </div>

          {/* Info Area */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                {t(`${template.id}.name`)}
              </h3>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">
              {t(`${template.id}.description`)}
            </p>

            <div className="flex gap-2 mt-3">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
