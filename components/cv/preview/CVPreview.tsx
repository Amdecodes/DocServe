"use client";

import { Suspense, lazy, useMemo } from "react";
import { useCV } from "@/components/cv/CVContext";
import { DEFAULT_TEMPLATE } from "@/config/templates";
import { CVData } from "@/types/cv";

// Create a map of lazy-loaded components for client-side
const lazyTemplates: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<{ data: CVData }>>
> = {
  modern: lazy(() =>
    import("./layouts/Modern").then((m) => ({ default: m.ModernLayout })),
  ),
  professional: lazy(() =>
    import("./layouts/Professional").then((m) => ({
      default: m.ProfessionalLayout,
    })),
  ),
  classic: lazy(() =>
    import("./layouts/Classic").then((m) => ({ default: m.ClassicLayout })),
  ),
};

export function CVPreview() {
  const { selectedTemplate, cvData } = useCV();

  const TemplateComponent = useMemo(() => {
    return lazyTemplates[selectedTemplate] || lazyTemplates[DEFAULT_TEMPLATE];
  }, [selectedTemplate]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] transition-transform">
        <Suspense
          fallback={
            <div className="p-10 text-gray-400">Loading template...</div>
          }
        >
          <TemplateComponent data={cvData} />
        </Suspense>
      </div>
    </div>
  );
}
