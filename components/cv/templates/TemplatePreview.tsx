import { cn } from "@/lib/utils"

interface TemplatePreviewProps {
  templateId: string
  className?: string
}

export function TemplatePreview({ templateId, className }: TemplatePreviewProps) {
  // Placeholder colors for different templates
  const bgColors: Record<string, string> = {
    modern: "bg-blue-100",
    classic: "bg-gray-100",
    fancy: "bg-purple-100",
  }

  return (
    <div
      className={cn(
        "relative aspect-[1/1.414] w-full overflow-hidden rounded-md border border-gray-200",
        bgColors[templateId] || "bg-gray-50",
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <span className="text-sm font-medium uppercase tracking-widest">
          {templateId} Preview
        </span>
      </div>
      {/* Skeleton / abstract preview lines */}
      <div className="absolute top-8 left-8 right-8 space-y-4 opacity-50">
        <div className="h-8 w-1/3 rounded bg-gray-300" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="mt-8 space-y-2">
          <div className="h-2 w-full rounded bg-gray-200" />
          <div className="h-2 w-full rounded bg-gray-200" />
          <div className="h-2 w-2/3 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
