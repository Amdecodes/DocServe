"use client"

import { useCV } from "@/components/cv/CVContext"
// Import Layouts
import { ModernLayout } from "./layouts/Modern"
import { ClassicLayout } from "./layouts/Classic"

export function CVPreview() {
  const { selectedTemplate, cvData } = useCV()

  const renderLayout = () => {
    switch (selectedTemplate) {
      case "modern":
        return <ModernLayout data={cvData} />
      case "classic":
        return <ClassicLayout data={cvData} />
      case "simple":
         return <ModernLayout data={cvData} /> // Fallback for now
      default:
        return <ModernLayout data={cvData} />
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] transition-transform">
        {renderLayout()}
      </div>
    </div>
  )
}
